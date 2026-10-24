'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import {
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Send,
  Loader2,
  Check,
} from 'lucide-react';

export interface WholesaleFormProps {
  locale: Locale;
}

export const WholesaleForm: React.FC<WholesaleFormProps> = ({ locale }) => {
  const dict = getDictionary(locale);
  const f = dict.wholesale.form;

  const formId = 'wf';

  // Section A: Contact Details
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Section B: Product Requirements (Multi-Select Categories)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['mattresses']);

  // Quantity Dropdown & Custom Quantity
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');
  const [customQuantity, setCustomQuantity] = useState<string>('');

  // Optional Delivery & Notes
  const [destinationLocation, setDestinationLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [hpField, setHpField] = useState(''); // Honeypot

  // Form State
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const coreCategories = [
    {
      key: 'mattresses',
      label: locale === 'hi' ? 'गद्दे' : 'Mattresses',
    },
    {
      key: 'pillows',
      label: locale === 'hi' ? 'तकिए' : 'Pillows',
    },
    {
      key: 'razais',
      label: locale === 'hi' ? 'रज़ाइयां' : 'Razais',
    },
    {
      key: 'blankets',
      label: locale === 'hi' ? 'कंबल' : 'Blankets',
    },
  ];

  const quantityOptions = [
    {
      value: '1–24 units',
      label: f.quantityOption1_24 || (locale === 'hi' ? '1–24 नग' : '1–24 units'),
    },
    {
      value: '25–50 units',
      label: f.quantityOption25_50 || (locale === 'hi' ? '25–50 नग' : '25–50 units'),
    },
    {
      value: '51–100 units',
      label: f.quantityOption51_100 || (locale === 'hi' ? '51–100 नग' : '51–100 units'),
    },
    {
      value: '100+ units',
      label: f.quantityOption100Plus || (locale === 'hi' ? '100+ नग' : '100+ units'),
    },
    {
      value: 'custom',
      label: f.quantityOptionCustom || (locale === 'hi' ? 'कस्टम मात्रा' : 'Custom quantity'),
    },
  ];

  // Category multi-select toggle handler
  const handleCategoryToggle = (key: string) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];

      if (updated.length > 0 && fieldErrors.categories) {
        setFieldErrors((e) => {
          const next = { ...e };
          delete next.categories;
          return next;
        });
      }
      return updated;
    });
  };

  // Quantity dropdown change handler: clears custom quantity when switching away from custom
  const handleQuantitySelectChange = (value: string) => {
    setSelectedQuantity(value);
    if (value !== 'custom') {
      setCustomQuantity('');
    }
    if (fieldErrors.quantity || fieldErrors.customQuantity) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.quantity;
        delete next.customQuantity;
        return next;
      });
    }
  };

  // Validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Full name
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = locale === 'hi' ? 'कृपया अपना पूरा नाम लिखें' : 'Please enter your full name';
    }

    // 2. Mobile number
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.mobileNumber =
        locale === 'hi'
          ? 'कृपया वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit Indian mobile number';
    }

    // 3. Categories (must pick at least one)
    if (selectedCategories.length === 0) {
      errors.categories =
        locale === 'hi'
          ? 'कृपया कम से कम एक उत्पाद श्रेणी चुनें'
          : 'Please select at least one product category';
    }

    // 4. Custom Quantity validation (only required if custom option is explicitly chosen)
    if (selectedQuantity === 'custom' && !customQuantity.trim()) {
      errors.customQuantity =
        locale === 'hi'
          ? 'कृपया अपनी अनुमानित मात्रा लिखें'
          : 'Please enter your approximate quantity';
    }

    setFieldErrors(errors);
    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      const firstError = Object.keys(errors)[0];
      setTimeout(() => {
        const target = document.querySelector<HTMLElement>(
          `[name="${firstError}"], #${formId}-${firstError}, input[aria-invalid="true"]`
        );
        target?.focus?.();
        target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }, 50);
    }

    return isValid;
  };

  const getEffectiveCategories = (): string[] => {
    return selectedCategories.length > 0 ? selectedCategories : ['mattresses'];
  };

  const getEffectiveQuantity = (): string => {
    if (selectedQuantity === 'custom') {
      const trimmed = customQuantity.trim();
      if (!trimmed) return '';
      return /\D/.test(trimmed) ? trimmed : `${trimmed} units`;
    }
    return selectedQuantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return; // Prevent double submit
    if (!validate()) return;

    setStatus('submitting');
    setApiErrorMessage(null);

    const payloadCategories = getEffectiveCategories();
    const payloadQuantity = getEffectiveQuantity();
    const payloadBusinessName = businessName.trim() || undefined;
    const payloadLocation = destinationLocation.trim() || undefined;

    try {
      const response = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          businessName: payloadBusinessName,
          mobileNumber: mobileNumber.replace(/\D/g, ''),
          preferredContact: 'whatsapp',
          categories: payloadCategories,
          estimatedQuantity: payloadQuantity || undefined,
          destinationLocation: payloadLocation,
          notes: notes.trim() || undefined,
          hp_field: hpField,
        }),
      });

      const data = await response.json();

      if (response.ok && data.accepted === true) {
        setStatus('success');
      } else {
        setStatus('error');
        if (
          data?.code === 'PROVIDER_NOT_CONFIGURED' ||
          data?.code === 'PROVIDER_CREDENTIALS_MISSING' ||
          data?.code === 'EMAIL_DISPATCH_FAILED'
        ) {
          setApiErrorMessage(
            locale === 'hi'
              ? 'ऑनलाइन ईमेल सेवा अभी सक्रिय नहीं है। कृपया नीचे दिए गए बटन से अपनी पूछताछ सीधे व्हाट्सएप पर भेजें।'
              : 'Email dispatch is awaiting mail server credentials. Please tap below to send your enquiry directly via WhatsApp.'
          );
        } else {
          setApiErrorMessage(data?.message || data?.error || f.errorMessage);
        }
      }
    } catch {
      setStatus('error');
      setApiErrorMessage(f.errorMessage);
    }
  };

  // WhatsApp fallback text (no purchase type remnants)
  const whatsappCategoriesText = getEffectiveCategories()
    .map((catKey) => {
      const match = coreCategories.find((c) => c.key === catKey);
      return match ? match.label : catKey;
    })
    .join(', ');

  const effectiveQty = getEffectiveQuantity();
  const qtyDisplay = effectiveQty || (locale === 'hi' ? 'पुष्टि हेतु' : 'To be confirmed');
  const businessDisplay = businessName.trim() || (locale === 'hi' ? 'व्यक्तिगत / प्रत्यक्ष खरीदार' : 'Individual / Direct Buyer');

  const whatsappFallbackText =
    locale === 'hi'
      ? `नमस्ते डायमंड फाइबर, मैं थोक / व्यावसायिक आपूर्ति के लिए पूछताछ करना चाहता हूँ।\n\nनाम: ${fullName || '[नाम]'}\nमोबाइल: ${mobileNumber || '[नंबर]'}\nदुकान/फर्म: ${businessDisplay}\nश्रेणियां: ${whatsappCategoriesText}\nमात्रा: ${qtyDisplay}\nडिलीवरी स्थान: ${destinationLocation.trim() || 'पुष्टि हेतु'}\nअतिरिक्त विवरण: ${notes.trim() || 'कोई नहीं'}`
      : `Hello Diamond Fibre, I am reaching out regarding a wholesale enquiry.\n\nName: ${fullName || '[Name]'}\nPhone: ${mobileNumber || '[Phone]'}\nBusiness: ${businessDisplay}\nCategories: ${whatsappCategoriesText}\nEstimated Qty: ${qtyDisplay}\nDestination: ${destinationLocation.trim() || 'To be confirmed'}\nNotes: ${notes.trim() || 'None'}`;

  // Success view
  if (status === 'success') {
    return (
      <div
        data-clarity-mask="true"
        className="bg-white border-2 border-emerald-600/40 rounded-3xl p-6 sm:p-10 shadow-sm text-center flex flex-col items-center gap-5 animate-fadeIn"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-md">
          <h3 className="font-display font-semibold text-2xl text-[var(--color-carbon-900)]">
            {f.successTitle || (locale === 'hi' ? 'पूछताछ प्राप्त हुई' : 'Enquiry Received')}
          </h3>
          <p className="text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {f.successMessage}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <a
            href={buildWhatsAppLink(whatsappFallbackText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-[var(--color-carbon-900)] text-white rounded-xl px-7 py-3.5 font-semibold text-sm hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] active:scale-[1.02] press-scale transition-all duration-150 ease-out motion-reduce:transform-none shadow-xs min-h-[48px] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
            <span>{f.whatsappDirectConnect || (locale === 'hi' ? 'व्हाट्सएप पर तुरंत चैट करें' : 'Connect on WhatsApp Now')}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setFullName('');
              setMobileNumber('');
              setBusinessName('');
              setSelectedCategories(['mattresses']);
              setSelectedQuantity('');
              setCustomQuantity('');
              setDestinationLocation('');
              setNotes('');
            }}
            className="text-xs font-semibold text-[var(--color-carbon-700)] hover:text-[var(--color-carbon-900)] active:scale-[1.02] press-scale transition-all duration-150 ease-out motion-reduce:transform-none py-2.5 px-5 cursor-pointer rounded-full border border-[var(--color-sand-300)] bg-[var(--color-warm-ivory-100)] hover:bg-[var(--color-sand-300)]/40 min-h-[44px] flex items-center justify-center w-full sm:w-auto"
          >
            {f.submitAnotherButton || (locale === 'hi' ? 'नई पूछताछ भरें' : 'Submit Another Enquiry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-clarity-mask="true"
      className="bg-white border border-[var(--color-sand-300)] rounded-3xl p-5 sm:p-8 md:p-10 shadow-[var(--shadow-card)] flex flex-col gap-8"
    >
      {/* Form Header */}
      <div className="flex flex-col gap-2 pb-5 border-b border-[var(--color-sand-300)]">
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)] tracking-tight">
          {f.heading}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
          {f.subheading ||
            (locale === 'hi'
              ? 'अपनी आवश्यकता बताएं। रतलाम स्थित हमारी टीम आपके ऑर्डर की समीक्षा कर सीधे व्हाट्सएप पर ट्रेड मूल्य व उपलब्धता साझा करेगी।'
              : 'Tell us what you need. Our team in Ratlam will review your requirements and share wholesale pricing and availability directly on WhatsApp.')}
        </p>
      </div>

      {/* Honeypot field (hidden from view and assistive tech) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website_url_hp"
          value={hpField}
          onChange={(e) => setHpField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error Alert with Immediate WhatsApp Fallback */}
      {status === 'error' && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex flex-col gap-3 animate-fadeIn"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{apiErrorMessage || f.errorMessage}</p>
          </div>
          <div>
            <a
              href={buildWhatsAppLink(whatsappFallbackText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-carbon-900)] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] active:scale-[1.02] press-scale transition-all duration-150 ease-out motion-reduce:transform-none shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>{f.whatsappFallbackButton}</span>
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION A: CONTACT DETAILS
          ========================================================================= */}
      <fieldset className="flex flex-col gap-4 border-none p-0 m-0">
        <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-terracotta-600)] mb-1">
          {f.sectionContact || (locale === 'hi' ? '1. संपर्क विवरण' : '1. Contact Details')}
        </legend>

        {/* Name and Mobile Number (Side-by-side on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              id={`${formId}-fullName`}
              label={f.nameLabel}
              placeholder={f.namePlaceholder}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.fullName;
                    return next;
                  });
                }
              }}
              error={fieldErrors.fullName}
              required
            />
          </div>

          <div>
            <Input
              id={`${formId}-mobileNumber`}
              label={f.phoneLabel}
              placeholder={f.phonePlaceholder}
              type="tel"
              inputMode="numeric"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                if (fieldErrors.mobileNumber) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.mobileNumber;
                    return next;
                  });
                }
              }}
              error={fieldErrors.mobileNumber}
              helperText={f.phoneHelper || (locale === 'hi' ? '10 अंकों का भारतीय नंबर' : '10-digit Indian mobile number')}
              required
            />
          </div>
        </div>

        {/* Business / Shop Name (Optional, full-width below) */}
        <div>
          <Input
            id={`${formId}-businessName`}
            label={`${f.businessLabel} ${f.businessOptional || (locale === 'hi' ? '(वैकल्पिक)' : '(Optional)')}`}
            placeholder={f.businessPlaceholder}
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              if (fieldErrors.businessName) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.businessName;
                  return next;
                });
              }
            }}
            error={fieldErrors.businessName}
          />
        </div>
      </fieldset>

      {/* =========================================================================
          SECTION B: PRODUCT REQUIREMENTS
          ========================================================================= */}
      <fieldset className="flex flex-col gap-6 pt-5 border-t border-[var(--color-sand-300)]">
        <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-terracotta-600)] mb-1">
          {f.sectionRequirements || (locale === 'hi' ? '2. उत्पाद आवश्यकताएं' : '2. Product Requirements')}
        </legend>

        {/* 1. Product Category Selection (Multi-Select Grid) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-semibold text-[var(--color-carbon-900)]">
              {f.categoryLabel || (locale === 'hi' ? 'उत्पाद श्रेणी' : 'Product Category')}
            </span>
            <p className="text-xs text-[var(--color-carbon-600)]">
              {f.categoryInstruction || (locale === 'hi' ? 'उन सभी उत्पादों को चुनें जिनमें आपकी रुचि है।' : "Select all products you're interested in.")}
            </p>
          </div>

          <div
            role="group"
            aria-label={f.categoryLabel || (locale === 'hi' ? 'उत्पाद श्रेणी' : 'Product Category')}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
          >
            {coreCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => handleCategoryToggle(cat.key)}
                  className={`min-h-[52px] sm:min-h-[56px] p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 ease-out flex items-center justify-between gap-2.5 cursor-pointer active:scale-[1.015] press-scale-subtle motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] focus-visible:ring-offset-1 ${isSelected
                    ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)] shadow-xs'
                    : 'border-[var(--color-sand-300)] bg-[var(--color-warm-ivory-100)]/60 text-[var(--color-carbon-800)] hover:border-[var(--color-sand-400)] hover:bg-[var(--color-sand-300)]/30'
                    }`}
                >
                  <span
                    className={`text-xs sm:text-sm leading-snug break-words ${isSelected
                      ? 'text-[var(--color-terracotta-800)] font-semibold'
                      : 'text-[var(--color-carbon-900)] font-medium'
                      }`}
                  >
                    {cat.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSelected
                      ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-white'
                      : 'border-[var(--color-sand-400)] bg-white'
                      }`}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {fieldErrors.categories && (
            <p className="text-xs font-medium text-[var(--color-error-red)] mt-0.5 animate-fadeIn">
              {fieldErrors.categories}
            </p>
          )}
        </div>

        {/* 2. Quantity Section: Compact Dropdown & Optional Custom Input */}
        <div className="flex flex-col gap-3">
          <Select
            id={`${formId}-quantity`}
            name="estimatedQuantity"
            label={f.quantityLabel || (locale === 'hi' ? 'अनुमानित मात्रा (वैकल्पिक)' : 'Estimated Quantity (Optional)')}
            placeholder={f.quantityPlaceholder || (locale === 'hi' ? 'अनुमानित मात्रा चुनें' : 'Select estimated quantity')}
            options={quantityOptions}
            value={selectedQuantity}
            onChange={handleQuantitySelectChange}
            error={fieldErrors.quantity}
            clearAriaLabel={locale === 'hi' ? 'मात्रा चयन हटाएं' : 'Clear quantity selection'}
          />

          {/* Compact Custom Quantity numeric/text input revealed only if "custom" is selected */}
          {selectedQuantity === 'custom' && (
            <div className="animate-fadeIn">
              <Input
                id={`${formId}-customQuantity`}
                type="text"
                label={f.customQuantityLabel || (locale === 'hi' ? 'अनुमानित संख्या लिखें *' : 'Approximate quantity *')}
                placeholder={f.customQuantityPlaceholder || (locale === 'hi' ? 'उदा. 35 या 150' : 'e.g. 35 or 150')}
                value={customQuantity}
                onChange={(e) => {
                  setCustomQuantity(e.target.value);
                  if (fieldErrors.customQuantity) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.customQuantity;
                      return next;
                    });
                  }
                }}
                error={fieldErrors.customQuantity}
              />
            </div>
          )}
        </div>

        {/* 3. Optional Fields: Delivery Location & Additional Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              id={`${formId}-destinationLocation`}
              label={`${f.locationLabel} ${f.locationOptionalBadge || (locale === 'hi' ? '(वैकल्पिक)' : '(Optional)')}`}
              placeholder={f.locationPlaceholder}
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              helperText={
                f.locationHelper ||
                (locale === 'hi' ? 'माल ढुलाई व क्षेत्रीय आपूर्ति जांच हेतु' : 'For freight and transport connectivity')
              }
            />
          </div>

          <div>
            <Textarea
              id={`${formId}-notes`}
              label={`${f.notesLabel} ${f.notesOptionalBadge || (locale === 'hi' ? '(वैकल्पिक)' : '(Optional)')}`}
              placeholder={f.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </fieldset>

      {/* =========================================================================
          SUBMISSION ACTION & PRIVACY
          ========================================================================= */}
      <div className="pt-2 flex flex-col gap-3.5">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto self-start flex items-center justify-center gap-2 min-h-[50px] px-8 text-sm font-bold shadow-sm hover:shadow-md cursor-pointer"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{f.submittingText}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 shrink-0" />
              <span>{f.submitButton}</span>
            </>
          )}
        </Button>

        {/* Factual Privacy Disclosure */}
        <p className="text-[11px] sm:text-xs text-[var(--color-carbon-600)] leading-relaxed">
          {f.privacyNotice}
        </p>
      </div>
    </form>
  );
};
