import type { CategoryData } from '../types/catalog.ts';

export const CATEGORIES_DATA: Record<string, CategoryData> = {
  mattresses: {
    key: 'mattresses',
    slug: 'mattresses',
    name: {
      en: 'Mattresses',
      hi: 'गद्दे',
    },
    shortTag: {
      en: 'Mattresses (Gaddas)',
      hi: 'गद्दे (मैट्रेस)',
    },
    tagline: {
      en: 'Quilted floor gaddas and boxed-edge bed mattresses',
      hi: 'पारंपरिक रजाईदार गद्दे एवं आधुनिक बॉक्स्ड-एज मैट्रेस',
    },
    overview: {
      en: 'Handcrafted and machine-quilted mattresses and floor gaddas direct from our Ratlam facility. From flexible rolling floor gaddas to firm boxed-edge mattresses for bed frames. Available in standard 3 × 6 ft, 4 × 6 ft, and 6 × 6 ft sizes.',
      hi: 'हमारी रतलाम वर्कशॉप में निर्मित पारंपरिक एवं आधुनिक गद्दे (मैट्रेस)। फर्श व दीवान के लिए मुड़ने वाले रजाईदार गद्दों से लेकर पलंग के लिए बॉक्स्ड-एज मैट्रेस तक। 3 × 6 फीट, 4 × 6 फीट और 6 × 6 फीट के मानक मापों में उपलब्ध।',
    },
    representativeImages: [
      {
        src: '/images/retouched/gaddas/hero-gadda-sage-botanical.webp',
        alt: {
          en: 'Thick quilted sage botanical gadda with boxed piped edge from current seasonal batch',
          hi: 'वर्तमान सीजनल बैच से सेज ग्रीन फ्लोरल रजाईदार गद्दे का वास्तविक फोटो',
        },
        isRepresentative: true,
        caption: {
          en: 'Sage botanical quilted gadda with boxed piped edge. Fabrics rotate seasonally.',
          hi: 'मजबूत पाइपिंग बॉर्डर वाला सेज ग्रीन फ्लोरल गद्दा। कपड़े बैच के अनुसार बदलते हैं।',
        },
      },
      {
        src: '/images/retouched/mattresses/hero-mattress-maroon-boxed.webp',
        alt: {
          en: 'Thick maroon floral boxed-edge mattress with reinforced border piping and deep tufting',
          hi: 'मजबूत पाइपिंग बॉर्डर और गहरे टफ्टिंग वाला मोटा महरून फ्लोरल मैट्रेस',
        },
        isRepresentative: true,
        caption: {
          en: 'Boxed-edge bed mattress with deep tufting and durable piped borders.',
          hi: 'मजबूत पाइपिंग बॉर्डर और गहरे टफ्टिंग वाला बेड मैट्रेस।',
        },
      },
      {
        src: '/images/retouched/gaddas/gadda-rose-tufted-profile.webp',
        alt: {
          en: 'Side profile view of tufted charcoal and rose floral gadda showing layered thickness',
          hi: 'गहरे फ्लोरल प्रिंट वाले गद्दे का साइड प्रोफाइल जिसमें मोटाई और टफ्टिंग दिखती है',
        },
        isRepresentative: true,
        caption: {
          en: 'Tufted floral gadda showing multi-layer thickness and piped border.',
          hi: 'गहरे फ्लोरल प्रिंट वाले गद्दे की मोटाई और बॉर्डर सिलाई।',
        },
      },
      {
        src: '/images/retouched/mattresses/mattress-stacked-boxed.webp',
        alt: {
          en: 'Stack of thick boxed-edge mattresses showing reinforced sidewall stitching',
          hi: 'मोटे बॉक्स्ड-एज मैट्रेस का स्टैक जिसमें मजबूत साइडवॉल सिलाई दिखती है',
        },
        isRepresentative: true,
        caption: {
          en: 'Reinforced sidewall construction on stacked mattresses.',
          hi: 'स्टैक किए गए मैट्रेस की मजबूत साइडवॉल और बॉर्डर सिलाई।',
        },
      },
      {
        src: '/images/retouched/gaddas/gadda-starburst-geo.webp',
        alt: {
          en: 'Neutral geometric starburst print quilted gadda laid out flat',
          hi: 'जियोमेट्रिक स्टारबर्स्ट प्रिंट वाला रजाईदार गद्दा',
        },
        isRepresentative: true,
        caption: {
          en: 'Neutral geometric print gadda with dense channel quilting.',
          hi: 'सघन क्विल्टिंग वाला जियोमेट्रिक प्रिंट गद्दा।',
        },
      },
      {
        src: '/images/retouched/mattresses/mattress-mint-perspective.webp',
        alt: {
          en: 'Perspective view of mint botanical tufted mattress showing padded height',
          hi: 'मिंट ग्रीन फ्लोरल टफ्टेड मैट्रेस का फ्रंट व्यू जिसमें पूरी मोटाई दिखती है',
        },
        isRepresentative: true,
        caption: {
          en: 'Firm tufted mattress profile designed for standard bed frames.',
          hi: 'मानक बेड फ्रेम के लिए तैयार किया गया मजबूत टफ्टेड मैट्रेस।',
        },
      },
      {
        src: '/images/retouched/gaddas/gadda-red-tartan-profile.webp',
        alt: {
          en: 'Traditional red and black plaid tartan tufted gadda profile',
          hi: 'पारंपरिक लाल और काले चेक्स (टार्टन) प्रिंट वाला टफ्टेड गद्दा',
        },
        isRepresentative: true,
        caption: {
          en: 'Classic red tartan plaid gadda with firm tufting.',
          hi: 'पारंपरिक लाल चेक्स प्रिंट वाला मजबूत टफ्टेड गद्दा।',
        },
      },
      {
        src: '/images/retouched/mattresses/mattress-assorted-stack.webp',
        alt: {
          en: 'Stack of mattresses in assorted seasonal fabric prints in showroom',
          hi: 'विभिन्न मौसमी प्रिंट्स वाले मैट्रेस का स्टैक',
        },
        isRepresentative: true,
        caption: {
          en: 'Assorted seasonal batch prints ready for dispatch.',
          hi: 'डिलीवरी के लिए तैयार विभिन्न मौसमी प्रिंट्स के मैट्रेस।',
        },
      },
      {
        src: '/images/retouched/gaddas/gadda-dusty-rose-corner.webp',
        alt: {
          en: 'Corner close-up of stacked dusty rose diamond tufted gaddas',
          hi: 'गुलाबी डायमंड प्रिंट वाले टफ्टेड गद्दे का कोना और मोटाई',
        },
        isRepresentative: true,
        caption: {
          en: 'Stacked dusty rose diamond tufted gaddas showing corner construction.',
          hi: 'गुलाबी डायमंड प्रिंट वाले गद्दे के कोने और बॉर्डर की सिलाई।',
        },
      },
      {
        src: '/images/retouched/razais/razai-crimson-paisley.webp',
        alt: {
          en: 'Rich crimson floral paisley printed seasonal winter mattress or floor gadda',
          hi: 'गहरे लाल पैस्ले फ्लोरल प्रिंट वाला सीजनल विंटर मैट्रेस / गद्दा',
        },
        isRepresentative: true,
        caption: {
          en: 'Crimson floral paisley quilt pattern mattress for everyday comfort.',
          hi: 'रोजमर्रा के आराम के लिए गहरे लाल पैस्ले प्रिंट का गद्दा।',
        },
      },
      {
        src: '/images/retouched/razais/razai-blue-plaid-fold.webp',
        alt: {
          en: 'Classic blue plaid tartan quilted mattress or floor gadda folded showing reverse lining',
          hi: 'नीले चेक्स वाला मुड़ा हुआ रजाईदार गद्दा / मैट्रेस जिसमें अंदर की लाइनिंग दिखती है',
        },
        isRepresentative: true,
        caption: {
          en: 'Classic plaid mattress with neat fold and bound edges.',
          hi: 'मजबूत किनारों वाला क्लासिक चेक्स रजाईदार गद्दा।',
        },
      },
    ],
    confirmedDimensions: [
      {
        name: { en: 'Single Bed Size', hi: 'सिंगल बेड साइज' },
        dimensionsFeet: '3 × 6 ft',
        availabilityNote: {
          en: 'Confirmed baseline size; subject to specific model availability.',
          hi: 'मानक साइज; विशिष्ट मॉडल की उपलब्धता के अधीन।',
        },
      },
      {
        name: { en: 'Double Bed Size', hi: 'डबल बेड साइज' },
        dimensionsFeet: '4 × 6 ft',
        availabilityNote: {
          en: 'Confirmed baseline size; subject to specific model availability.',
          hi: 'मानक साइज; विशिष्ट मॉडल की उपलब्धता के अधीन।',
        },
      },
      {
        name: { en: 'Large Bed Size', hi: 'बड़ा बेड साइज' },
        dimensionsFeet: '6 × 6 ft',
        availabilityNote: {
          en: 'Confirmed baseline size; subject to specific model availability.',
          hi: 'मानक साइज; विशिष्ट मॉडल की उपलब्धता के अधीन।',
        },
      },
    ],
    dimensionAvailabilityNote: {
      en: 'Confirmed baseline dimensions are 3 × 6 ft, 4 × 6 ft, and 6 × 6 ft. Availability varies by specific model. Thickness and custom constructions confirmed upon enquiry.',
      hi: 'मानक माप 3 × 6 फीट, 4 × 6 फीट और 6 × 6 फीट हैं। उपलब्धता मॉडल के अनुसार भिन्न हो सकती है। मोटाई व कस्टम साइज पुष्टि के अधीन हैं।',
    },
    whatsappPrefill: {
      en: 'Hello Diamond Fibre, I am enquiring about your Mattresses (Gaddas). Please share current dimensions, seasonal designs, and pricing for delivery to [City/Pin].',
      hi: 'नमस्ते डायमंड फाइबर, मैं आपके गद्दों (मैट्रेस) के बारे में जानकारी चाहता हूँ। कृपया उपलब्ध साइज, वर्तमान डिजाइन और [शहर/पिनकोड] के लिए डिलीवरी की जानकारी साझा करें।',
    },
  },

  pillows: {
    key: 'pillows',
    slug: 'pillows',
    name: {
      en: 'Pillows',
      hi: 'तकिए',
    },
    shortTag: {
      en: 'Everyday Support',
      hi: 'आरामदायक तकिए',
    },
    tagline: {
      en: 'Bedding pillows manufactured in Ratlam',
      hi: 'रतलाम में निर्मित आरामदायक तकिए',
    },
    overview: {
      en: 'Bedding pillows manufactured in Ratlam. Contact our team for current filling options, dimensions, and pack quantities.',
      hi: 'रतलाम में निर्मित तकिए। उपलब्ध भराई, साइज और पैक मात्रा की जानकारी के लिए हमारी टीम से संपर्क करें।',
    },
    representativeImages: [
      {
        src: '/images/retouched/pillows/hero-pillow-retail-floral.webp',
        alt: {
          en: 'Retail packaged floral pillow in clear protective sleeve with Diamond Fibre branding',
          hi: 'सुरक्षात्मक स्लीव में पैक सिंगल फ्लोरल बेडिंग तकिया',
        },
        isRepresentative: true,
        caption: {
          en: 'Retail packaged bedding pillow in sealed protective sleeve.',
          hi: 'सुरक्षात्मक पारदर्शी स्लीव में पैक बेडिंग तकिया।',
        },
      },
      {
        src: '/images/retouched/pillows/pillow-wholesale-bundle-purple.webp',
        alt: {
          en: 'Wholesale commercial pack of 4 packaged pillows strapped for distributor dispatch',
          hi: 'थोक वितरण के लिए स्ट्रैप से बंधा 4 तकियों का कमर्शियल पैक',
        },
        isRepresentative: true,
        caption: {
          en: 'Commercial 4-pack pillow bundle secured for wholesale dispatch.',
          hi: 'थोक आपूर्ति के लिए 4 तकियों का सुरक्षित बंडल पैक।',
        },
      },
      {
        src: '/images/retouched/pillows/pillow-polka-dot-packaged.webp',
        alt: {
          en: 'White and teal polka dot pillow sealed in retail packaging sleeve',
          hi: 'सफेद और टील पोलका डॉट प्रिंट वाला पैक तकिया',
        },
        isRepresentative: true,
        caption: {
          en: 'Sealed pillow in contemporary geometric dot print.',
          hi: 'आधुनिक पोलका डॉट प्रिंट में पैक तकिया।',
        },
      },
      {
        src: '/images/retouched/pillows/pillow-botanical-packaged.webp',
        alt: {
          en: 'Soft mint botanical silhouette pillow in sealed protective wrap',
          hi: 'सॉफ्ट मिंट बॉटनिकल प्रिंट वाला पैक तकिया',
        },
        isRepresentative: true,
        caption: {
          en: 'Botanical print pillow sealed for dust protection.',
          hi: 'धूल से सुरक्षा के लिए पैक बॉटनिकल प्रिंट तकिया।',
        },
      },
      {
        src: '/images/retouched/pillows/pillow-commercial-strapped-bundle.webp',
        alt: {
          en: 'Commercial bundle of 4 pillows in mixed contemporary prints',
          hi: 'विभिन्न प्रिंट्स में 4 तकियों का कमर्शियल बंडल',
        },
        isRepresentative: true,
        caption: {
          en: 'Wholesale 4-pillow bundled packaging for retail stockists.',
          hi: 'खुदरा विक्रेताओं के लिए 4 तकियों का थोक बंडल पैक।',
        },
      },
    ],
    confirmedDimensions: [],
    dimensionAvailabilityNote: {
      en: 'Pillow dimensions, outer shells, and filling options are confirmed based on current production runs.',
      hi: 'तकियों के माप, कवर और भराई के विकल्प वर्तमान उत्पादन बैच के आधार पर बताए जाते हैं।',
    },
    whatsappPrefill: {
      en: 'Hello Diamond Fibre, please share details on your Pillow options, pack quantities, and prices.',
      hi: 'नमस्ते डायमंड फाइबर, कृपया अपने तकियों की रेंज, पैक ऑप्शंस और कीमतों की जानकारी साझा करें।',
    },
  },

  razais: {
    key: 'razais',
    slug: 'razais',
    name: {
      en: 'Razais',
      hi: 'रज़ाइयां',
    },
    shortTag: {
      en: 'Traditional Quilts',
      hi: 'पारंपरिक रज़ाइयां',
    },
    tagline: {
      en: 'Quilted covers and filling for seasonal comfort',
      hi: 'मौसमी आराम के लिए रजाईदार कवर और भराई वाली रज़ाइयां',
    },
    overview: {
      en: 'Traditional Indian quilts with filling and seasonal printed covers. Ask about available sizes and current batch availability.',
      hi: 'भराई और मौसमी प्रिंट वाले कवर की पारंपरिक रज़ाइयां। उपलब्ध साइज और वर्तमान बैच की उपलब्धता के लिए संपर्क करें।',
    },
    representativeImages: [
      {
        src: '/images/retouched/razais/hero-razai-patchwork-terracotta.webp',
        alt: {
          en: 'Earthy terracotta, olive, and brown geometric patchwork quilted razai with folded corner',
          hi: 'टेराकोटा, ऑलिव और भूरे रंग के पैचवर्क प्रिंट वाली रजाईदार रज़ाई',
        },
        isRepresentative: true,
        caption: {
          en: 'Geometric patchwork razai with piped border and soft quilted channels.',
          hi: 'पाइपिंग बॉर्डर और मुलायम क्विल्टिंग वाली पैचवर्क रज़ाई।',
        },
      },
      {
        src: '/images/retouched/razais/razai-gold-bridal-brocade.webp',
        alt: {
          en: 'Traditional gold and crimson jacquard brocade bridal razai with rich dark lining',
          hi: 'पारंपरिक सुनहरी और लाल ब्रोकेड वाली विवाह स्पेशल रज़ाई',
        },
        isRepresentative: true,
        caption: {
          en: 'Traditional bridal brocade razai with decorative border and contrast lining.',
          hi: 'पारंपरिक ब्राइडल ब्रोकेड रज़ाई और गहरा बॉर्डर।',
        },
      },
      {
        src: '/images/retouched/razais/razai-blue-diamond-ikat.webp',
        alt: {
          en: 'Royal blue and indigo geometric diamond ikat print quilted razai',
          hi: 'रॉयल ब्लू और इंडिगो डायमंड प्रिंट वाली रजाईदार रज़ाई',
        },
        isRepresentative: true,
        caption: {
          en: 'Indigo diamond ikat razai spread showing quilted grid.',
          hi: 'इंडिगो डायमंड प्रिंट वाली रज़ाई की क्विल्टिंग डिजाइन।',
        },
      },
      {
        src: '/images/retouched/razais/razai-purple-floral-stack.webp',
        alt: {
          en: 'Folded stack of purple and white floral vine quilts with satin piped edges',
          hi: 'साटन पाइपिंग वाली बैंगनी फ्लोरल रज़ाइयों का फोल्ड किया हुआ स्टैक',
        },
        isRepresentative: true,
        caption: {
          en: 'Folded seasonal razais showing smooth satin piped borders.',
          hi: 'साटन पाइपिंग बॉर्डर वाली सीजनल रज़ाइयों का स्टैक।',
        },
      },
      {
        src: '/images/retouched/blankets/blanket-lavender-fleece.webp',
        alt: {
          en: 'Soft lavender floral printed fleece razai folded diagonally',
          hi: 'सॉफ्ट लैवेंडर फ्लोरल प्रिंट वाली फ्लीस रज़ाई',
        },
        isRepresentative: true,
        caption: {
          en: 'Lightweight floral blanket-weight razai for mild weather comfort.',
          hi: 'हल्के मौसम के लिए आरामदायक फ्लोरल फ्लीस रज़ाई।',
        },
      },
    ],
    confirmedDimensions: [],
    dimensionAvailabilityNote: {
      en: 'Razai dimensions, weights, and seasonal cover prints vary by production batch.',
      hi: 'रज़ाइयों के माप, वजन और कवर प्रिंट उत्पादन बैच के अनुसार बदलते रहते हैं।',
    },
    whatsappPrefill: {
      en: 'Hello Diamond Fibre, I would like to see available seasonal Razai prints, size options, and pricing.',
      hi: 'नमस्ते डायमंड फाइबर, मैं आपकी रज़ाइयों के वर्तमान प्रिंट्स, साइज और कीमतों की जानकारी देखना चाहता हूँ।',
    },
  },

  blankets: {
    key: 'blankets',
    slug: 'blankets',
    name: {
      en: 'Blankets',
      hi: 'कंबल',
    },
    shortTag: {
      en: 'Everyday Bedding',
      hi: 'घरेलू कंबल',
    },
    tagline: {
      en: 'Bedding blankets for home comfort',
      hi: 'घरेलू आराम के लिए कंबल',
    },
    overview: {
      en: 'Bedding blankets for home comfort. Enquire about current seasonal options, colors, and availability.',
      hi: 'घरेलू उपयोग के लिए कंबल। वर्तमान मौसमी विकल्पों, रंगों और उपलब्धता के लिए संपर्क करें।',
    },
    representativeImages: [
      {
        src: '/images/retouched/blankets/hero-blanket-wine-mink-embossed.webp',
        alt: {
          en: 'Deep wine floral embossed mink blanket showing rich plush pile and ornate border',
          hi: 'गहरे वाइन रंग का फ्लोरल एम्बॉस्ड मिंक कंबल, मुलायम रेशे और नक्काशीदार बॉर्डर',
        },
        isRepresentative: true,
        caption: {
          en: 'Embossed floral mink blanket with high-sheen velvet pile and decorative border.',
          hi: 'मुलायम रेशे और सजावटी बॉर्डर वाला एम्बॉस्ड फ्लोरल मिंक कंबल।',
        },
      },
      {
        src: '/images/retouched/blankets/blanket-pink-floral-plush.webp',
        alt: {
          en: 'Vibrant hot pink floral plush mink blanket spread with floral medallion',
          hi: 'चमकदार गुलाबी फ्लोरल मिंक कंबल का पूरा फैलाव',
        },
        isRepresentative: true,
        caption: {
          en: 'Vibrant pink floral mink blanket with soft plush finish.',
          hi: 'मुलायम फिनिश वाला चमकदार गुलाबी फ्लोरल मिंक कंबल।',
        },
      },
      {
        src: '/images/retouched/blankets/blanket-wine-floral-spread.webp',
        alt: {
          en: 'Full spread view of deep wine floral embossed mink blanket',
          hi: 'वाइन रंग के फ्लोरल एम्बॉस्ड मिंक कंबल का पूरा फैलाव',
        },
        isRepresentative: true,
        caption: {
          en: 'Full decorative border detailing on heavy mink blanket.',
          hi: 'भारी मिंक कंबल पर विस्तृत नक्काशीदार बॉर्डर।',
        },
      },
      {
        src: '/images/retouched/blankets/blanket-wine-folded-square.webp',
        alt: {
          en: 'Neatly folded square of wine floral mink blanket showing plush thickness',
          hi: 'तह किया हुआ वाइन फ्लोरल मिंक कंबल जिसमें इसकी मोटाई दिखती है',
        },
        isRepresentative: true,
        caption: {
          en: 'Folded blanket presentation demonstrating plush thickness.',
          hi: 'तह किए गए कंबल में मुलायम रेशों का घनापन और मोटाई।',
        },
      },
    ],
    confirmedDimensions: [],
    dimensionAvailabilityNote: {
      en: 'Blanket sizes, weaves, and seasonal weights are confirmed upon enquiry.',
      hi: 'कंबल के साइज, बुनाई और वजन की जानकारी पूछताछ पर उपलब्ध कराई जाती है।',
    },
    whatsappPrefill: {
      en: 'Hello Diamond Fibre, please share details and current availability for your Blanket range.',
      hi: 'नमस्ते डायमंड फाइबर, कृपया अपनी कंबल रेंज और वर्तमान में उपलब्ध विकल्पों की जानकारी साझा करें।',
    },
  },
};
