export type Locale = 'en' | 'hi';

export interface PrivacySection {
  id: string;
  badge?: string;
  title: string;
  summary?: string;
  paragraphs: string[];
  subsections?: Array<{
    title: string;
    paragraphs?: string[];
    listItems?: string[];
    note?: string;
  }>;
  listItems?: string[];
  callout?: {
    type: 'info' | 'notice' | 'legal';
    title: string;
    text: string;
  };
}

export interface PrivacyPolicyData {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  jurisdictionLabel: string;
  jurisdictionValue: string;
  governingLawNotice: string;
  highlightsHeading: string;
  highlightsSubheading: string;
  highlights: Array<{
    title: string;
    description: string;
    icon: 'shield' | 'database' | 'message' | 'userCheck';
  }>;
  sections: PrivacySection[];
  contactBox: {
    heading: string;
    subheading: string;
    businessName: string;
    location: string;
    phoneLabel: string;
    phoneValue: string;
    emailLabel: string;
    emailValue: string;
    operatingHoursLabel: string;
    operatingHoursValue: string;
    responseNotice: string;
  };
  backToTopLabel: string;
  homeLinkLabel: string;
}

export const privacyPolicyContent: Record<Locale, PrivacyPolicyData> = {
  en: {
    badge: 'Transparency & Data Protection',
    title: 'Privacy Policy',
    subtitle:
      'How Diamond Fibre handles visitor inquiries, wholesale requests, website communications, and technical data in accordance with applicable Indian privacy laws.',
    lastUpdatedLabel: 'Last Updated',
    lastUpdatedDate: 'October 2026',
    jurisdictionLabel: 'Jurisdiction & Governing Law',
    jurisdictionValue: 'India (IT Act 2000 & DPDP Act 2023 Framework)',
    governingLawNotice:
      'This Privacy Policy describes Diamond Fibre’s actual data practices across website inquiries, direct communications, and analytics in Ratlam, Madhya Pradesh.',
    highlightsHeading: 'Key Privacy Highlights at a Glance',
    highlightsSubheading:
      'We believe in complete transparency. Here is a clear summary of how your information is handled.',
    highlights: [
      {
        title: 'Zero Customer PII Database on Web Server',
        description:
          'Our website server does not store an online database of customer records. Wholesale form submissions are transmitted directly to our sales inbox via encrypted API dispatch.',
        icon: 'database',
      },
      {
        title: 'Direct Enquiry Channels',
        description:
          'Enquiries are handled directly by our sales desk in Ratlam via WhatsApp, phone, or email. We never sell, rent, or trade your contact details with external marketers.',
        icon: 'message',
      },
      {
        title: 'Pseudonymous Usability Analytics',
        description:
          'We use Google Analytics and Microsoft Clarity strictly to gauge aggregate traffic and website usability. Personal names, phone numbers, and form entries are never sent to analytics.',
        icon: 'shield',
      },
      {
        title: 'User Access & Correction Rights',
        description:
          'Under Indian privacy laws, you have the right to request access, correction, or deletion of your enquiry records by contacting our Ratlam desk directly.',
        icon: 'userCheck',
      },
    ],
    sections: [
      {
        id: 'introduction',
        badge: 'Section 01',
        title: 'Introduction & Scope of Policy',
        paragraphs: [
          'Diamond Fibre (also referred to as Diamond Fibres, "we", "us", or "our") is a bedding manufacturer based in Ratlam, Madhya Pradesh, India. We operate our own manufacturing unit producing four core bedding lines: mattresses (gaddas), pillows, seasonal razais, and blankets.',
          'This Privacy Policy applies to the official website at https://diamondfibre.shop ("the Website") and governs how we collect, handle, process, and protect information submitted by individual customers, retailers, wholesalers, and institutional buyers.',
          'The Website currently operates on a direct enquiry and trade-quotation model. Online retail transactions and automated payment checkouts are planned for a subsequent phase and are not currently active on this platform. This policy explains our verified practices regarding enquiry communications, technical server operations, and compliance with the legal framework of India.',
        ],
      },
      {
        id: 'information-we-collect',
        badge: 'Section 02',
        title: 'Information We Collect',
        paragraphs: [
          'We believe in data minimization: we only collect information that is strictly necessary to answer your product enquiries, discuss wholesale specifications, confirm freight logistics, and maintain website reliability. We distinguish between information you provide to us directly and technical data processed automatically by website infrastructure.',
        ],
        subsections: [
          {
            title: 'A. Information Submitted Directly by Visitors',
            paragraphs: [
              'When you interact with Diamond Fibre through our website or direct communication channels, you may submit the following personal or commercial details:',
            ],
            listItems: [
              'B2B Wholesale & Reseller Enquiry Form: Full Name, optional Business or Shop Name, 10-digit Indian Mobile Number, Preferred Contact Method (WhatsApp or Voice Call), Selected Product Categories (mattresses, pillows, razais, blankets), optional Estimated Quantity range, Destination City and State (to evaluate transport connectivity), optional Additional Requirements/Notes, and optional Customer Email Address.',
              'WhatsApp Direct Conversations: When you click WhatsApp enquiry links or floating buttons on our website, you connect directly to our sales desk. We receive your WhatsApp phone number, display profile name, and any messages or specifications you share.',
              'Direct Phone Calls & Emails: If you call our verified sales number (+91 7974644185) or email us (diamondfibreandcotton@gmail.com), we receive your phone number, email address, and the contents of your message.',
            ],
          },
          {
            title: 'B. Technical & Analytics Information Processed Automatically',
            paragraphs: [
              'When you navigate the Website, our web hosting infrastructure and privacy-conscious analytics services automatically process certain non-personally identifiable technical information:',
            ],
            listItems: [
              'Hosting & Server Logs: Standard HTTP server request headers, including your IP address, browser type and version, operating system, referring URL, pages viewed on our site, and access timestamps. These logs are processed automatically for network defense, error diagnostic analysis, and DDoS mitigation.',
              'Google Analytics 4: Aggregated page visits, traffic sources, session duration, and device category. Analytics events transmit page URLs and document titles only; no customer PII or form payloads are ever passed to analytics.',
              'Microsoft Clarity: Pseudonymous behavioral heatmaps, click patterns, and scroll depth to help us understand layout clarity and improve mobile navigation.',
            ],
          },
          {
            title: 'C. Information We Do NOT Collect',
            paragraphs: [
              'To ensure absolute transparency, we explicitly state that Diamond Fibre does not collect, deal with, or possess any of the following on this website:',
            ],
            listItems: [
              'No Account Passwords or Logins: The Website does not have customer registration accounts or password-protected user portals.',
              'No Payment Card, Banking, or Financial Credentials: We do not process online credit card, debit card, net banking, or UPI checkout transactions on this website.',
              'No Sensitive Personal Data or Information (SPDI): We do not collect biometric records, physiological health data, passwords, or financial account details as defined under Rule 3 of the Information Technology (SPDI) Rules, 2011.',
            ],
          },
        ],
      },
      {
        id: 'how-we-use-information',
        badge: 'Section 03',
        title: 'How We Use Your Information',
        paragraphs: [
          'Every piece of information collected by Diamond Fibre is used strictly for legitimate, declared commercial and operational purposes:',
        ],
        listItems: [
          'Responding to Product & Retail Enquiries: Sharing available product options, fabric prints, dimensions (such as standard 3×6 ft, 4×6 ft, 6×6 ft gaddas), current manufacturing runs, and retail pricing.',
          'Processing B2B Wholesale Requests: Reviewing business requirements, assessing order volumes, verifying freight transport routes from Ratlam to your destination city, and providing wholesale quotations.',
          'Fulfilling Commercial Orders & Delivery Logistics: Coordinating production scheduling, order packaging, dispatch, and delivery updates with logistics partners.',
          'Customer Service & Communication: Following up on ongoing enquiries via your preferred communication channel (WhatsApp or voice call).',
          'Website Security & Performance: Monitoring server health, mitigating automated spam through honeypot validation, and ensuring smooth mobile responsiveness.',
        ],
        callout: {
          type: 'notice',
          title: 'Our Strict Commercial Promise',
          text: 'Diamond Fibre does not engage in unsolicited telemarketing, bulk SMS blasts, or third-party advertising campaigns. Your contact details are never sold, rented, or traded to data brokers or marketing agencies.',
        },
      },
      {
        id: 'sharing-and-third-party-services',
        badge: 'Section 04',
        title: 'Third-Party Services & External Platforms',
        paragraphs: [
          'To operate our website and communicate with customers, we work with trusted external service providers. We only share information with third parties where strictly necessary to provide our services:',
        ],
        subsections: [
          {
            title: '1. WhatsApp / Meta Platforms, Inc.',
            paragraphs: [
              'Our primary direct enquiry channel uses WhatsApp. When you click a WhatsApp button or link on https://diamondfibre.shop, you leave our website and transition to WhatsApp (operated by Meta Platforms, Inc.). That communication takes place over WhatsApp’s platform and is subject to WhatsApp’s own Terms of Service and Privacy Policy.',
            ],
          },
          {
            title: '2. Resend (Email Delivery Provider)',
            paragraphs: [
              'When you submit our B2B wholesale enquiry form, our web server transmits the structured form payload via Resend’s encrypted API directly to our internal sales inbox. Resend acts solely as a secure data transmission processor. Our server does not persist customer records in an online web database.',
            ],
          },
          {
            title: '3. Analytics Providers (Google LLC & Microsoft Corporation)',
            paragraphs: [
              'We use Google Analytics 4 (Google LLC) and Microsoft Clarity (Microsoft Corporation) to evaluate pseudonymous website traffic and usability. These providers process aggregate data in accordance with their respective commercial privacy policies. They do not receive customer names, phone numbers, or enquiry contents.',
            ],
          },
          {
            title: '4. Hosting & Infrastructure Providers',
            paragraphs: [
              'Our website is hosted on secure cloud infrastructure that processes standard HTTP web requests and maintains temporary server access logs for technical diagnostic and security purposes.',
            ],
          },
          {
            title: '5. Legal & Statutory Disclosures',
            paragraphs: [
              'We may disclose personal information only if required to do so by applicable Indian law, a valid judicial order, or a lawful directive from an authorized government or law-enforcement authority, or when reasonably necessary to protect the legal rights, property, or safety of Diamond Fibre, our employees, or the public.',
            ],
          },
        ],
      },
      {
        id: 'cookies-and-analytics',
        badge: 'Section 05',
        title: 'Cookies & Tracking Technologies',
        paragraphs: [
          'Cookies are small text files placed on your device by websites you visit. Diamond Fibre uses only essential and privacy-conscious analytics cookies:',
        ],
        listItems: [
          'Essential Operational Cookies: Minimal technical session cookies that may be utilized by our hosting infrastructure to ensure secure, resilient page delivery.',
          'Google Analytics 4 Cookies (_ga, _ga_*): Used to distinguish unique sessions and calculate aggregate visitor numbers, referral sources, and page popularity. These cookies do not identify you personally.',
          'Microsoft Clarity Cookies (_clck, _clsk, MUID): Used to record anonymous interaction signals such as click coordinates and scroll distance to identify design bottlenecks on mobile devices.',
        ],
        callout: {
          type: 'info',
          title: 'Managing Cookies in Your Browser',
          text: 'You have full control over cookies. You can configure your browser (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) to reject or delete cookies. Blocking analytics cookies will not restrict your access to any product information, photos, or WhatsApp contact options on our website.',
        },
        subsections: [
          {
            title: 'Absence of Behavioral Advertising Pixels',
            paragraphs: [
              'We do not deploy third-party advertising tracking pixels (such as the Meta/Facebook Pixel, Google Ads remarketing pixels, or third-party ad network tags) designed to track your browsing activity across other websites for targeted commercial advertising.',
            ],
          },
        ],
      },
      {
        id: 'data-storage-security-and-retention',
        badge: 'Section 06',
        title: 'Data Storage, Security & Retention Practices',
        paragraphs: [
          'We implement reasonable security practices and procedures in compliance with Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the principles of the Digital Personal Data Protection Act, 2023.',
        ],
        subsections: [
          {
            title: 'Security Measures',
            paragraphs: [
              'All traffic between your browser and our website is encrypted in transit using industry-standard Transport Layer Security (TLS/HTTPS). Form submissions are safeguarded against automated bot spam using honeypot detection, and our operational server logs are strictly configured to prevent recording customer personal data.',
              'While we implement commercially reasonable administrative and technical safeguards to protect your information, no method of electronic storage or transmission over the internet can be guaranteed as 100% invulnerable. We cannot promise absolute security.',
            ],
          },
          {
            title: 'Data Retention Policy',
            paragraphs: [
              'In accordance with our actual operational practice, Diamond Fibre does not retain customer personal information indefinitely or maintain an arbitrary online archive. We adhere to the following principles:',
            ],
            listItems: [
              'Enquiry Records: Correspondence received via WhatsApp, email, or wholesale form submissions is retained only for the duration necessary to address your product questions, negotiate wholesale terms, and support commercial order follow-ups.',
              'Commercial & Taxation Records: Where an enquiry results in an actual commercial transaction or invoice, necessary billing and dispatch records are retained in our offline accounting systems for the statutory period required under Indian taxation and commercial laws (such as GST regulations).',
              'Non-Persistence on Web Server: The website server does not store personal form submissions in a database. Once dispatched to our sales inbox, no duplicate online customer record is maintained on the web server.',
            ],
          },
        ],
      },
      {
        id: 'user-rights-and-privacy-requests',
        badge: 'Section 07',
        title: 'User Rights & Privacy Requests',
        paragraphs: [
          'Under applicable Indian data-protection regulations (primarily the Information Technology Act, 2000 and SPDI Rules 2011, as well as in voluntary alignment with the forthcoming Digital Personal Data Protection Act, 2023 framework), visitors and customers have specific rights regarding their personal data:',
        ],
        listItems: [
          'Right to Review & Access: You may request confirmation of whether we hold personal contact details regarding your enquiry and request a summary thereof.',
          'Right to Correction & Updating: If any personal contact or business information you submitted (such as phone number, business name, or delivery location) is inaccurate or outdated, you have the right to have it corrected.',
          'Right to Erasure & Deletion: You may request that we delete your enquiry contact records from our communication channels, subject to any statutory obligations requiring record retention (e.g. tax or accounting documentation for completed sales).',
          'Right to Grievance Redressal: You have the right to register concerns or grievances regarding our handling of your enquiry information.',
        ],
        subsections: [
          {
            title: 'How to Submit a Request',
            paragraphs: [
              'To exercise any of these rights, please contact our team using our verified business email (diamondfibreandcotton@gmail.com) or phone (+91 7974644185). Please include your name, contact phone number, and a brief description of your request. To protect your privacy, we may verify your identity before processing the request.',
              'We will review and respond to valid requests within a reasonable timeframe as prescribed under applicable Indian regulations.',
            ],
          },
        ],
      },
      {
        id: 'childrens-privacy',
        badge: 'Section 08',
        title: 'Children’s Privacy',
        paragraphs: [
          'Our website and bedding manufacturing business are directed exclusively to adult consumers, homeowners, retail shopkeepers, and wholesale commercial buyers. We do not knowingly market to, target, or collect personal information from children under the age of 18.',
          'If you are a parent or legal guardian and believe that your child has submitted personal details through our wholesale form or communication channels, please notify us immediately at diamondfibreandcotton@gmail.com. We will promptly investigate and erase such information from our records.',
        ],
      },
      {
        id: 'policy-updates',
        badge: 'Section 09',
        title: 'Changes to This Privacy Policy',
        paragraphs: [
          'Diamond Fibre may revise and update this Privacy Policy periodically to reflect changes in our manufacturing operations, updates to website capabilities (such as introducing direct e-commerce purchasing in a future phase), or changes in applicable Indian statutes and regulations.',
          'When revisions are made, the updated version will be published directly on this page with an updated "Last Updated" date at the top. We encourage visitors and wholesale buyers to review this policy periodically to stay informed about how we safeguard enquiry information.',
        ],
      },
      {
        id: 'contact-and-grievance',
        badge: 'Section 10',
        title: 'Verified Business Contact & Grievance Redressal',
        paragraphs: [
          'In compliance with Rule 5(9) of the Information Technology (SPDI) Rules, 2011, and in progressive alignment with the grievance redressal framework under the Digital Personal Data Protection Act, 2023, Diamond Fibre provides verified contact details for all privacy-related questions, data access requests, and grievance redressal:',
        ],
      },
    ],
    contactBox: {
      heading: 'Diamond Fibre Privacy & Grievance Desk',
      subheading:
        'For inquiries regarding this Privacy Policy, data access requests, or privacy concerns, connect with our team directly:',
      businessName: 'Diamond Fibre (Diamond Fibres)',
      location: 'Ratlam, Madhya Pradesh, India',
      phoneLabel: 'Phone & WhatsApp',
      phoneValue: '+91 7974644185',
      emailLabel: 'Official Email',
      emailValue: 'diamondfibreandcotton@gmail.com',
      operatingHoursLabel: 'Operating Hours',
      operatingHoursValue: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
      responseNotice:
        'All privacy and data-rights inquiries submitted to diamondfibreandcotton@gmail.com will be acknowledged and addressed within applicable statutory timelines.',
    },
    backToTopLabel: 'Back to Top',
    homeLinkLabel: 'Back to Home',
  },
  hi: {
    badge: 'पारदर्शिता एवं डेटा सुरक्षा',
    title: 'गोपनीयता नीति (Privacy Policy)',
    subtitle:
      'डायमंड फाइबर रतलाम (म.प्र.) द्वारा वेबसाइट आगंतुकों, थोक खरीदारों, व्हाट्सएप पूछताछ और तकनीकी डेटा के सुरक्षित व पारदर्शी प्रबंधन का विवरण।',
    lastUpdatedLabel: 'अंतिम अद्यतन (Last Updated)',
    lastUpdatedDate: 'अक्टूबर 2026',
    jurisdictionLabel: 'अधिकार क्षेत्र व कानून',
    jurisdictionValue: 'भारत (सूचना प्रौद्योगिकी अधिनियम 2000 व DPDP एक्ट 2023)',
    governingLawNotice:
      'यह गोपनीयता नीति रतलाम (मध्य प्रदेश) स्थित डायमंड फाइबर की वास्तविक व्यावसायिक कार्यप्रणाली, पूछताछ संचार और तकनीकी प्रक्रियाओं पर आधारित है।',
    highlightsHeading: 'मुख्य गोपनीयता बिंदु (संक्षेप में)',
    highlightsSubheading:
      'हम पूर्ण पारदर्शिता में विश्वास रखते हैं। यहां आपके व्यक्तिगत डेटा और पूछताछ विवरण के उपयोग का संक्षिप्त सार दिया गया है।',
    highlights: [
      {
        title: 'वेब सर्वर पर कोई PII डेटाबेस नहीं',
        description:
          'हमारी वेबसाइट के सर्वर पर ग्राहकों का कोई डेटाबेस सुरक्षित नहीं रखा जाता। थोक पूछताछ सीधे एन्क्रिप्टेड माध्यम से हमारे सेल्स इनबॉक्स में पहुंचती है।',
        icon: 'database',
      },
      {
        title: 'सीधा एवं सुरक्षित संपर्क माध्यम',
        description:
          'पूछताछ मुख्य रूप से व्हाट्सएप, फोन कॉल या ईमेल द्वारा हमारे रतलाम डेस्क द्वारा संभाली जाती है। हम आपकी जानकारी कभी किसी तीसरे पक्ष को नहीं बेचते।',
        icon: 'message',
      },
      {
        title: 'अनाम (Pseudonymous) एनालिटिक्स',
        description:
          'हम वेबसाइट की उपयोगिता जांचने के लिए गूगल एनालिटिक्स और माइक्रोसॉफ्ट क्लैरिटी का सीमित उपयोग करते हैं। इसमें कोई नाम या फोन नंबर नहीं भेजा जाता।',
        icon: 'shield',
      },
      {
        title: 'डेटा अधिकार व सुधार की सुविधा',
        description:
          'भारतीय डेटा संरक्षण नियमों के तहत आप अपनी पूछताछ रिकॉर्ड की जानकारी लेने, उसमें सुधार करने या उसे हटाने का अनुरोध कर सकते हैं।',
        icon: 'userCheck',
      },
    ],
    sections: [
      {
        id: 'introduction',
        badge: 'भाग 01',
        title: 'परिचय एवं नीति का दायरा (Introduction & Scope)',
        paragraphs: [
          'डायमंड फाइबर (Diamond Fibre / Diamond Fibres, "हम", "हमारी टीम") रतलाम, मध्य प्रदेश (भारत) में स्थित एक बेडिंग विनिर्माण इकाई है। हम चार मुख्य श्रेणियों में बेडिंग उत्पादों का प्रत्यक्ष निर्माण करते हैं: गद्दे (मैट्रेस / Gaddas), तकिए (Pillows), रज़ाइयां (Razais) और कंबल (Blankets)।',
          'यह गोपनीयता नीति हमारी आधिकारिक वेबसाइट https://diamondfibre.shop ("वेबसाइट") पर लागू होती है। इसका उद्देश्य व्यक्तिगत ग्राहकों, खुदरा दुकानदारों, थोक व्यापारियों और व्यावसायिक खरीदारों को यह स्पष्ट करना है कि उनकी पूछताछ व संपर्क विवरण का प्रबंधन किस प्रकार किया जाता है।',
          'वर्तमान में यह वेबसाइट सीधी पूछताछ और थोक कोटेशन मॉडल पर संचालित होती है। ऑनलाइन भुगतान व स्वचालित ई-कॉमर्स चेकआउट भविष्य के चरण के लिए प्रस्तावित है और वर्तमान में वेबसाइट पर सक्रिय नहीं है। यह नीति भारतीय कानूनी ढांचे के अनुरूप हमारे वास्तविक कार्यों को स्पष्ट करती है।',
        ],
      },
      {
        id: 'information-we-collect',
        badge: 'भाग 02',
        title: 'एकत्र की जाने वाली जानकारी (Information We Collect)',
        paragraphs: [
          'हम न्यूनतम डेटा संग्रह (Data Minimization) के सिद्धांत का पालन करते हैं। हम केवल वही जानकारी लेते हैं जो आपकी उत्पाद संबंधी पूछताछ का उत्तर देने, थोक आवश्यकताओं को समझने, ट्रांसपोर्ट कनेक्टिविटी जांचने और वेबसाइट संचालन के लिए अनिवार्य है।',
        ],
        subsections: [
          {
            title: 'क. आगंतुकों द्वारा सीधे प्रदान की जाने वाली जानकारी',
            paragraphs: [
              'जब आप वेबसाइट या हमारे सीधे संपर्क माध्यमों का उपयोग करते हैं, तो आप निम्नलिखित विवरण प्रदान कर सकते हैं:',
            ],
            listItems: [
              'थोक एवं पुनर्विक्रेता पूछताछ फॉर्म (Wholesale Form): पूरा नाम, व्यवसाय/दुकान का नाम (वैकल्पिक), 10-अंकों का भारतीय मोबाइल नंबर, पसंदीदा संपर्क माध्यम (व्हाट्सएप या फोन कॉल), चयनित उत्पाद श्रेणियां (गद्दे, तकिए, रज़ाइयां, कंबल), अनुमानित मात्रा, डिलीवरी शहर व राज्य (माल ढुलाई व ट्रांसपोर्ट पुष्टि हेतु), अतिरिक्त आवश्यकताएं/नोट्स, तथा वैकल्पिक ईमेल आईडी।',
              'व्हाट्सएप सीधा संवाद (WhatsApp Direct Enquiry): जब आप वेबसाइट पर दिए गए व्हाट्सएप बटन पर क्लिक करते हैं, तो आप सीधे हमारे सेल्स डेस्क से जुड़ते हैं। हमें आपका व्हाट्सएप नंबर, प्रोफाइल नाम और भेजे गए संदेश प्राप्त होते हैं।',
              'सीधा फोन कॉल और ईमेल: यदि आप हमारे नंबर (+91 7974644185) पर कॉल करते हैं या ईमेल (diamondfibreandcotton@gmail.com) भेजते हैं, तो आपका नंबर, ईमेल पता और संवाद विवरण प्राप्त होता है।',
            ],
          },
          {
            title: 'ख. तकनीकी एवं एनालिटिक्स डेटा (स्वचालित रूप से प्रोसेस)',
            paragraphs: [
              'जब आप वेबसाइट पर आते हैं, तो वेब होस्टिंग इंफ्रास्ट्रक्चर और प्राइवेसी-केंद्रित एनालिटिक्स टूल्स द्वारा कुछ गैर-व्यक्तिगत तकनीकी डेटा प्रोसेस होता है:',
            ],
            listItems: [
              'होस्टिंग व सर्वर लॉग्स: मानक HTTP सर्वर रिक्वेस्ट, जिसमें आईपी एड्रेस (IP Address), ब्राउज़र का प्रकार व वर्जन, ऑपरेटिंग सिस्टम, रेफरिंग यूआरएल, देखे गए पेज और समय दर्ज होता है। यह डेटा सर्वर सुरक्षा, डीडीओएस (DDoS) से बचाव और तकनीकी जांच के लिए आवश्यक है।',
              'गूगल एनालिटिक्स 4 (Google Analytics 4): कुल पेज व्यूज, ट्रैफिक स्रोत और डिवाइस प्रकार का समग्र डेटा। इसमें केवल पेज पाथ और शीर्षक भेजा जाता है; कोई ग्राहक नाम, फोन या फॉर्म डेटा कभी नहीं भेजा जाता।',
              'माइक्रोसॉफ्ट क्लैरिटी (Microsoft Clarity): अनाम क्लिक पैटर्न और स्क्रॉल डेप्थ, जिससे मोबाइल पर वेबसाइट के लेआउट और बटनों की सुगमता को बेहतर बनाया जा सके।',
            ],
          },
          {
            title: 'ग. जो जानकारी हम एकत्र नहीं करते (Explicit Exclusions)',
            paragraphs: [
              'पारदर्शिता बनाए रखने के लिए, हम स्पष्ट करते हैं कि डायमंड फाइबर इस वेबसाइट पर निम्नलिखित डेटा एकत्र या संसाधित नहीं करता:',
            ],
            listItems: [
              'कोई अकाउंट पासवर्ड या लॉगिन नहीं: वेबसाइट पर कोई यूजर रजिस्ट्रेशन या पासवर्ड-आधारित प्रोफाइल सिस्टम नहीं है।',
              'कोई पेमेंट कार्ड, बैंक विवरण या यूपीआई पिन नहीं: वेबसाइट पर कोई ऑनलाइन कार्ड पेमेंट या बैंकिंग गेटवे संचालित नहीं है।',
              'कोई संवेदनशील व्यक्तिगत डेटा (SPDI) नहीं: हम सूचना प्रौद्योगिकी (SPDI) नियम 2011 के तहत परिभाषित बायोमेट्रिक डेटा, पासवर्ड, स्वास्थ्य डेटा या बैंक खाते का विवरण एकत्र नहीं करते।',
            ],
          },
        ],
      },
      {
        id: 'how-we-use-information',
        badge: 'भाग 03',
        title: 'जानकारी का उपयोग (How We Use Information)',
        paragraphs: [
          'डायमंड फाइबर द्वारा प्राप्त सभी जानकारी का उपयोग केवल वैध, घोषित व्यावसायिक उद्देश्यों के लिए किया जाता है:',
        ],
        listItems: [
          'पूछताछ का उत्तर देना: उत्पाद विकल्प, वर्तमान उत्पादन बैच के कपड़े व प्रिंट, माप (जैसे 3×6 फीट, 4×6 फीट, 6×6 फीट गद्दे) और कीमतों की जानकारी साझा करना।',
          'थोक एवं रिटेल ऑर्डर्स का प्रबंधन: व्यापारी व खुदरा आवश्यकताओं की समीक्षा करना, ऑर्डर मात्रा का आकलन करना और रतलाम से आपके शहर तक ट्रांसपोर्ट व माल ढुलाई व्यवस्था सुनिश्चित करना।',
          'ग्राहक सेवा एवं संचार: आपके चुने हुए संपर्क माध्यम (व्हाट्सएप या फोन कॉल) पर बातचीत जारी रखना।',
          'वेबसाइट सुरक्षा एवं स्पैम रोकथाम: हनीपॉट सुरक्षा के माध्यम से बॉट स्पैम को रोकना और सर्वर की विश्वसनीयता बनाए रखना।',
        ],
        callout: {
          type: 'notice',
          title: 'हमारा स्पष्ट व्यावसायिक वादा',
          text: 'डायमंड फाइबर अवांछित कॉल्स, बल्क एसएमएस या अनचाहे विज्ञापनों में विश्वास नहीं करता। आपका संपर्क नंबर कभी किसी तीसरे पक्ष, डेटा ब्रोकर या मार्केटिंग एजेंसी को बेचा, किराए पर दिया या साझा नहीं किया जाता।',
        },
      },
      {
        id: 'sharing-and-third-party-services',
        badge: 'भाग 04',
        title: 'बाहरी सेवाएं एवं डेटा साझाकरण (Third-Party Services)',
        paragraphs: [
          'वेबसाइट संचालन और ग्राहक संवाद के लिए हम केवल विश्वसनीय तकनीकी प्रदाताओं का उपयोग करते हैं:',
        ],
        subsections: [
          {
            title: '1. व्हाट्सएप (WhatsApp / Meta Platforms, Inc.)',
            paragraphs: [
              'हमारा प्राथमिक संवाद चैनल व्हाट्सएप है। जब आप वेबसाइट पर व्हाट्सएप लिंक पर क्लिक करते हैं, तो आप डायमंड फाइबर की वेबसाइट से मेटा प्लेटफॉर्म्स के स्वामित्व वाले व्हाट्सएप पर चले जाते हैं। वह संवाद व्हाट्सएप की अपनी सेवा शर्तों और गोपनीयता नीति के अधीन होता है।',
            ],
          },
          {
            title: '2. रीसेंड (Resend - ईमेल ट्रांसमिशन सर्विस)',
            paragraphs: [
              'जब आप थोक पूछताछ फॉर्म सबमिट करते हैं, तो हमारा सर्वर उस डेटा को सुरक्षित रीसेंड (Resend) एपीआई के माध्यम से सीधे हमारे इनबॉक्स में भेजता है। वेबसाइट सर्वर पर कोई ऑनलाइन ग्राहक डेटाबेस नहीं बनाया जाता।',
            ],
          },
          {
            title: '3. एनालिटिक्स सेवाएं (Google LLC एवं Microsoft Corporation)',
            paragraphs: [
              'गूगल एनालिटिक्स 4 और माइक्रोसॉफ्ट क्लैरिटी केवल अनाम व समेकित उपयोग आंकड़ों को प्रोसेस करते हैं। उन्हें कोई व्यक्तिगत नाम या फोन नंबर नहीं दिया जाता।',
            ],
          },
          {
            title: '4. होस्टिंग व बुनियादी ढांचा',
            paragraphs: [
              'हमारी वेबसाइट सुरक्षित क्लाउड इंफ्रास्ट्रक्चर पर संचालित होती है, जो तकनीकी सुरक्षा और अनुरोध लॉग्स का स्वतः प्रबंधन करती है।',
            ],
          },
          {
            title: '5. कानूनी एवं वैधानिक प्रकटीकरण',
            paragraphs: [
              'हम व्यक्तिगत जानकारी केवल तभी प्रकट कर सकते हैं जब भारतीय कानून, न्यायालय के आदेश या किसी अधिकृत सरकारी प्राधिकारी के कानूनी निर्देश द्वारा ऐसा करना अनिवार्य हो।',
            ],
          },
        ],
      },
      {
        id: 'cookies-and-analytics',
        badge: 'भाग 05',
        title: 'कुकीज़ और ट्रैकिंग तकनीकें (Cookies & Tracking)',
        paragraphs: [
          'कुकीज़ छोटी टेक्स्ट फाइलें होती हैं जो आपके ब्राउज़र में सुरक्षित होती हैं। डायमंड फाइबर केवल आवश्यक और एनालिटिक्स कुकीज़ का उपयोग करता है:',
        ],
        listItems: [
          'आवश्यक तकनीकी कुकीज़: सुरक्षित पेज लोडिंग और नेटवर्क सुरक्षा के लिए अनिवार्य न्यूनतम कुकीज़।',
          'गूगल एनालिटिक्स कुकीज़ (_ga, _ga_*): आगंतुकों की कुल संख्या, रेफरल और पेज लोकप्रियता को समझने के लिए अनाम सत्र कुकीज़।',
          'माइक्रोसॉफ्ट क्लैरिटी कुकीज़ (_clck, _clsk, MUID): वेबसाइट की उपयोगिता और मोबाइल डिजाइन को बेहतर बनाने के लिए उपयोग होने वाली कुकीज़।',
        ],
        callout: {
          type: 'info',
          title: 'ब्राउज़र में कुकीज़ नियंत्रण',
          text: 'आप अपने ब्राउज़र (Google Chrome, Safari, Firefox, Edge) की सेटिंग्स में जाकर कभी भी कुकीज़ को ब्लॉक या डिलीट कर सकते हैं। कुकीज़ ब्लॉक करने पर भी आप हमारे उत्पादों की जानकारी देखने और व्हाट्सएप पर संपर्क करने में पूरी तरह सक्षम रहेंगे।',
        },
        subsections: [
          {
            title: 'रीटार्गेटिंग या विज्ञापन पिक्सेल का अभाव',
            paragraphs: [
              'हमारी वेबसाइट पर क्रॉस-साइट ट्रैकिंग करने वाले विज्ञापन पिक्सेल (जैसे Meta Pixel या Google Ads रीमार्केटिंग कोड) नहीं लगे हैं।',
            ],
          },
        ],
      },
      {
        id: 'data-storage-security-and-retention',
        badge: 'भाग 06',
        title: 'भंडारण, सुरक्षा और संरक्षण अवधि (Storage & Security)',
        paragraphs: [
          'हम सूचना प्रौद्योगिकी (उचित सुरक्षा पद्धतियां व संवेदनशील व्यक्तिगत डेटा) नियम, 2011 के नियम 8 तथा डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act) के तहत उचित सुरक्षा मानकों का पालन करते हैं।',
        ],
        subsections: [
          {
            title: 'सुरक्षा उपाय',
            paragraphs: [
              'आपकी ब्राउज़िंग और डेटा ट्रांसमिशन ट्रांसपोर्ट लेयर सिक्योरिटी (TLS/HTTPS) एन्क्रिप्शन द्वारा सुरक्षित रहता है। फॉर्म सबमिशन में बॉट स्पैम रोकने के लिए सुरक्षा उपाय किए गए हैं, और सर्वर लॉग्स में ग्राहक डेटा सुरक्षित रूप से दर्ज नहीं किया जाता।',
              'हालांकि हम व्यावसायिक रूप से उचित तकनीकी सुरक्षा उपाय अपनाते हैं, इंटरनेट पर डेटा ट्रांसमिशन या इलेक्ट्रॉनिक स्टोरेज 100% अभेद्य नहीं हो सकता; इसलिए पूर्ण या असीमित सुरक्षा की गारंटी नहीं दी जा सकती।',
            ],
          },
          {
            title: 'डेटा संरक्षण अवधि (Data Retention Policy)',
            paragraphs: [
              'डायमंड फाइबर अपनी वास्तविक कार्यप्रणाली के अनुसार ग्राहक डेटा को असीमित समय तक सुरक्षित नहीं रखता:',
            ],
            listItems: [
              'पूछताछ रिकॉर्ड: व्हाट्सएप, ईमेल या फॉर्म द्वारा प्राप्त पूछताछ केवल तब तक सुरक्षित रखी जाती है जब तक आपकी आवश्यकता का समाधान न हो जाए और ऑर्डर प्रक्रिया पूरी न हो जाए।',
              'व्यावसायिक एवं टैक्स रिकॉर्ड: यदि पूछताछ वास्तविक ऑर्डर और बिलिंग में परिवर्तित होती है, तो भारतीय जीएसटी और वाणिज्यिक कानूनों के तहत निर्धारित अवधि के लिए आवश्यक बिलिंग रिकॉर्ड हमारे ऑफलाइन खातों में सुरक्षित रखे जाते हैं।',
              'वेब सर्वर पर गैर-भंडारण: वेबसाइट सर्वर पर कोई अलग ग्राहक डेटाबेस नहीं रखा जाता।',
            ],
          },
        ],
      },
      {
        id: 'user-rights-and-privacy-requests',
        badge: 'भाग 07',
        title: 'उपयोगकर्ता अधिकार एवं अनुरोध (User Rights)',
        paragraphs: [
          'लागू भारतीय डेटा नियमों (मुख्यतः सूचना प्रौद्योगिकी अधिनियम 2000 व SPDI नियम 2011, तथा आगामी डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के सिद्धांतों के अनुरूप) वेबसाइट उपयोगकर्ताओं को अपने व्यक्तिगत डेटा के संबंध में निम्नलिखित अधिकार व विकल्प प्राप्त हैं:',
        ],
        listItems: [
          'जानकारी व समीक्षा का अधिकार: आप यह जानने का अनुरोध कर सकते हैं कि आपकी पूछताछ के संबंध में क्या संपर्क विवरण दर्ज है।',
          'सुधार व अद्यतन का अधिकार: यदि आपका नाम, फोन नंबर या व्यावसायिक पता बदल गया है या गलत दर्ज है, तो आप उसमें सुधार का अनुरोध कर सकते हैं।',
          'डेटा मिटाने का अधिकार (Right to Erasure): आप हमारे संचार चैनलों से अपने पूछताछ रिकॉर्ड को हटाने का अनुरोध कर सकते हैं (कानूनी टैक्स या बिलिंग रिकॉर्ड को छोड़कर)।',
          'शिकायत निवारण का अधिकार: आप अपने डेटा से संबंधित किसी भी चिंता या शिकायत के निवारण के लिए हमसे संपर्क कर सकते हैं।',
        ],
        subsections: [
          {
            title: 'अनुरोध कैसे भेजें',
            paragraphs: [
              'इन अधिकारों का उपयोग करने के लिए आप हमारे आधिकारिक ईमेल (diamondfibreandcotton@gmail.com) पर संदेश भेज सकते हैं या +91 7974644185 पर संपर्क कर सकते हैं। सत्यापन के पश्चात आपके अनुरोध पर नियमानुसार उचित समय सीमा के भीतर कार्रवाई की जाएगी।',
            ],
          },
        ],
      },
      {
        id: 'childrens-privacy',
        badge: 'भाग 08',
        title: 'बच्चों की गोपनीयता (Children’s Privacy)',
        paragraphs: [
          'हमारी वेबसाइट और बेडिंग उत्पाद वयस्क उपभोक्ताओं, गृहस्वामियों, दुकानदारों और थोक व्यापारियों के लिए हैं। हम 18 वर्ष से कम आयु के बच्चों से जानबूझकर कोई व्यक्तिगत जानकारी एकत्र नहीं करते।',
          'यदि किसी अभिभावक को यह ज्ञात होता है कि उनके अवयस्क बच्चे ने फॉर्म के माध्यम से कोई विवरण भेजा है, तो कृपया हमें diamondfibreandcotton@gmail.com पर सूचित करें। हम तुरंत उस जानकारी को अपने रिकॉर्ड से हटा देंगे।',
        ],
      },
      {
        id: 'policy-updates',
        badge: 'भाग 09',
        title: 'गोपनीयता नीति में संशोधन (Policy Updates)',
        paragraphs: [
          'डायमंड फाइबर समय-समय पर अपनी विनिर्माण प्रक्रियाओं, वेबसाइट सुविधाओं (जैसे भविष्य में सीधे ऑनलाइन ऑर्डर शुरू होने पर) या भारतीय कानूनी नियमों के अनुसार इस नीति में संशोधन कर सकता है।',
          'कोई भी संशोधन होने पर अद्यतन नीति इस पेज पर नई तिथि के साथ प्रकाशित की जाएगी। हम आगंतुकों को समय-समय पर इस पेज को देखने की सलाह देते हैं।',
        ],
      },
      {
        id: 'contact-and-grievance',
        badge: 'भाग 10',
        title: 'सत्यापित संपर्क एवं शिकायत निवारण (Contact & Grievance)',
        paragraphs: [
          'सूचना प्रौद्योगिकी (SPDI) नियम 2011 के नियम 5(9) के अनुपालन में, तथा डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act) के आगामी शिकायत निवारण सिद्धांतों के अनुरूप, गोपनीयता संबंधी प्रश्नों, डेटा सुधार अनुरोधों या शिकायत निवारण के लिए डायमंड फाइबर के आधिकारिक संपर्क विवरण निम्नलिखित हैं:',
        ],
      },
    ],
    contactBox: {
      heading: 'डायमंड फाइबर प्राइवेसी एवं शिकायत निवारण डेस्क',
      subheading:
        'इस गोपनीयता नीति, डेटा सुधार अनुरोधों या किसी अन्य प्रश्न के लिए सीधे हमारी रतलाम टीम से संपर्क करें:',
      businessName: 'डायमंड फाइबर (Diamond Fibres)',
      location: 'रतलाम, मध्य प्रदेश, भारत',
      phoneLabel: 'फोन व व्हाट्सएप',
      phoneValue: '+91 7974644185',
      emailLabel: 'आधिकारिक ईमेल',
      emailValue: 'diamondfibreandcotton@gmail.com',
      operatingHoursLabel: 'कार्य समय',
      operatingHoursValue: 'सोमवार से शनिवार: प्रातः 10:00 से सायं 7:00 बजे (IST)',
      responseNotice:
        'diamondfibreandcotton@gmail.com पर प्राप्त सभी गोपनीयता संबंधी अनुरोधों का भारतीय कानूनों के तहत निर्धारित समय सीमा में समाधान किया जाएगा।',
    },
    backToTopLabel: 'ऊपर जाएँ',
    homeLinkLabel: 'होम पेज पर जाएँ',
  },
};
