'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { CheckCircle2, AlertCircle, MessageCircle, Send } from 'lucide-react';

export interface WholesaleFormProps {
  locale: Locale;
}

export const WholesaleForm: React.FC<WholesaleFormProps> = ({ locale }) => {
  const dict = getDictionary(locale);
  const f = dict.wholesale.form;

  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone'>('whatsapp');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [customSizes, setCustomSizes] = useState(false);
  const [privateLabel, setPrivateLabel] = useState(false);
  const [notes, setNotes] = useState('');
  const [hpField, setHpField] = useState(''); // Honeypot

  // Submission Status
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { key: 'mattresses', label: locale === 'hi' ? 'गद्दे (मैट्रेस)' : 'Mattresses (Gaddas)' },
    { key: 'pillows', label: dict.nav.pillows },
    { key: 'razais', label: dict.nav.razais },
    { key: 'blankets', label: dict.nav.blankets },
  ];

  const handleCategoryToggle = (catKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catKey) ? prev.filter((k) => k !== catKey) : [...prev, catKey]
    );
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = locale === 'hi' ? 'कृपया पूरा नाम दर्ज करें' : 'Please enter your full name';
    }
    if (!businessName.trim() || businessName.trim().length < 2) {
      errors.businessName =
        locale === 'hi' ? 'कृपया दुकान या फर्म का नाम दर्ज करें' : 'Please enter your business/shop name';
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.mobileNumber =
        locale === 'hi'
          ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit Indian mobile number';
    }
    if (selectedCategories.length === 0) {
      errors.categories =
        locale === 'hi'
          ? 'कृपया कम से कम एक श्रेणी चुनें'
          : 'Please select at least one product category';
    }
    if (!estimatedQuantity.trim()) {
      errors.estimatedQuantity =
        locale === 'hi' ? 'कृपया अनुमानित मात्रा दर्ज करें' : 'Please specify estimated quantity';
    }
    if (!destinationLocation.trim()) {
      errors.destinationLocation =
        locale === 'hi' ? 'कृपया डिलीवरी का शहर व राज्य बताएं' : 'Please enter destination city & state';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return; // Prevent double submit
    if (!validate()) return;

    setStatus('submitting');
    setApiErrorMessage(null);

    try {
      const response = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          businessName,
          mobileNumber,
          preferredContact,
          categories: selectedCategories,
          estimatedQuantity,
          destinationLocation,
          customSizes,
          privateLabel,
          notes,
          hp_field: hpField,
        }),
      });

      const data = await response.json();

      // STRICT GUARANTEE: Show success ONLY if response is 200 OK and data.accepted is true
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
              ? 'ऑनलाइन फॉर्म डिलीवरी अभी सक्रिय नहीं है। कृपया नीचे दिए गए बटन से अपनी पूछताछ सीधे व्हाट्सएप पर भेजें।'
              : 'Online form submission is awaiting sales desk email setup. Please tap below to send your enquiry directly via WhatsApp.'
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

  // WhatsApp fallback text pre-populated with user inputs
  const whatsappFallbackText = `Hello Diamond Fibre, I am reaching out regarding a wholesale enquiry.\n\nName: ${fullName || '[Name]'}\nBusiness: ${businessName || '[Business]'}\nPhone: ${mobileNumber || '[Phone]'}\nCategories: ${selectedCategories.join(', ') || '[Categories]'}\nEstimated Qty: ${estimatedQuantity || '[Quantity]'}\nDestination: ${destinationLocation || '[Location]'}\nNotes: ${notes || 'None'}`;

  if (status === 'success') {
    return (
      <div className="bg-[var(--color-warm-ivory-100)] border-2 border-emerald-500/50 rounded-2xl p-8 sm:p-10 shadow-sm text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-2xl text-[var(--color-carbon-900)]">
          {f.successTitle}
        </h3>
        <p className="text-sm text-[var(--color-carbon-600)] max-w-lg leading-relaxed">
          {f.successMessage}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <a
            href={buildWhatsAppLink(whatsappFallbackText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-[#1EBE5D] transition-colors min-h-[48px] shadow-xs"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{locale === 'hi' ? 'व्हाट्सएप पर भी संदेश भेजें' : 'Connect on WhatsApp Now'}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setSelectedCategories([]);
              setNotes('');
            }}
            className="text-xs font-semibold text-[var(--color-carbon-600)] hover:text-[var(--color-carbon-900)] py-2 px-4"
          >
            {locale === 'hi' ? 'नया फॉर्म भरें' : 'Submit Another Enquiry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] flex flex-col gap-6"
    >
      <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-carbon-900)] border-b border-[var(--color-sand-300)] pb-4">
        {f.heading}
      </h3>

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

      {status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm flex flex-col gap-3"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p>{apiErrorMessage || f.errorMessage}</p>
          </div>
          <div>
            <a
              href={buildWhatsAppLink(whatsappFallbackText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full font-semibold text-xs hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{f.whatsappFallbackButton}</span>
            </a>
          </div>
        </div>
      )}

      {/* Grid: Name & Business */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={f.nameLabel}
          placeholder={f.namePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={fieldErrors.fullName}
          required
        />
        <Input
          label={f.businessLabel}
          placeholder={f.businessPlaceholder}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          error={fieldErrors.businessName}
          required
        />
      </div>

      {/* Grid: Phone & Preferred Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={f.phoneLabel}
          placeholder={f.phonePlaceholder}
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          error={fieldErrors.mobileNumber}
          helperText={locale === 'hi' ? '10 अंकों का भारतीय नंबर' : '10-digit Indian mobile number'}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-carbon-800)]">
            {f.preferredContactLabel}
          </label>
          <div className="flex items-center gap-4 min-h-[48px] px-2">
            <label className="inline-flex items-center gap-2 text-sm text-[var(--color-carbon-800)] cursor-pointer">
              <input
                type="radio"
                name="preferredContact"
                value="whatsapp"
                checked={preferredContact === 'whatsapp'}
                onChange={() => setPreferredContact('whatsapp')}
                className="accent-[var(--color-terracotta-500)] w-4 h-4"
              />
              <span>{f.preferredWhatsApp}</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[var(--color-carbon-800)] cursor-pointer">
              <input
                type="radio"
                name="preferredContact"
                value="phone"
                checked={preferredContact === 'phone'}
                onChange={() => setPreferredContact('phone')}
                className="accent-[var(--color-terracotta-500)] w-4 h-4"
              />
              <span>{f.preferredCall}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[var(--color-carbon-800)]">
          {f.categoriesLabel}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {categoryOptions.map((cat) => {
            const isChecked = selectedCategories.includes(cat.key);
            return (
              <label
                key={cat.key}
                className={`min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                  isChecked
                    ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)]'
                    : 'border-[var(--color-sand-300)] bg-white text-[var(--color-carbon-800)] hover:bg-[var(--color-sand-300)]/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat.key)}
                  className="accent-[var(--color-terracotta-500)] w-4 h-4 rounded"
                />
                <span>{cat.label}</span>
              </label>
            );
          })}
        </div>
        {fieldErrors.categories && (
          <p className="text-xs font-medium text-[var(--color-error-red)] mt-1">
            {fieldErrors.categories}
          </p>
        )}
      </div>

      {/* Grid: Quantity & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={f.quantityLabel}
          placeholder={f.quantityPlaceholder}
          value={estimatedQuantity}
          onChange={(e) => setEstimatedQuantity(e.target.value)}
          error={fieldErrors.estimatedQuantity}
          helperText={
            locale === 'hi'
              ? 'कोई न्यूनतम सीमा नहीं। अपनी आवश्यकतानुसार संख्या लिखें।'
              : 'No minimum order quantity required. State your requirement.'
          }
          required
        />
        <Input
          label={f.locationLabel}
          placeholder={f.locationPlaceholder}
          value={destinationLocation}
          onChange={(e) => setDestinationLocation(e.target.value)}
          error={fieldErrors.destinationLocation}
          helperText={
            locale === 'hi' ? 'माल ढुलाई व आपूर्ति जांच हेतु' : 'For freight and dispatch feasibility'
          }
          required
        />
      </div>

      {/* Optional Inquiries: Custom Sizes & Private Labeling */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-sand-300)]/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-600)]">
          {f.customInquiriesLabel}
        </span>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--color-carbon-800)] cursor-pointer">
            <input
              type="checkbox"
              checked={customSizes}
              onChange={(e) => setCustomSizes(e.target.checked)}
              className="accent-[var(--color-terracotta-500)] w-4 h-4 rounded"
            />
            <span>{f.customSizesCheck}</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--color-carbon-800)] cursor-pointer">
            <input
              type="checkbox"
              checked={privateLabel}
              onChange={(e) => setPrivateLabel(e.target.checked)}
              className="accent-[var(--color-terracotta-500)] w-4 h-4 rounded"
            />
            <span>{f.privateLabelCheck}</span>
          </label>
        </div>
      </div>

      {/* Additional Notes */}
      <Textarea
        label={f.notesLabel}
        placeholder={f.notesPlaceholder}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Submit Action */}
      <div className="pt-2 flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto self-start flex items-center gap-2"
        >
          {status === 'submitting' ? (
            <span>{f.submittingText}</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{f.submitButton}</span>
            </>
          )}
        </Button>

        {/* Factual Privacy Disclosure */}
        <p className="text-[11px] text-[var(--color-carbon-600)] leading-relaxed">
          {f.privacyNotice}
        </p>
      </div>
    </form>
  );
};
