export const LANGUAGES = [
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
  { code: "en", label: "English" },
];

// Every UI string lives here, keyed by id, with mr/hi/en variants.
export const STRINGS = {
  appTitle: { mr: "गणना प्रपत्र — Auto-Fill Assistant", hi: "गणना प्रपत्र — Auto-Fill Assistant", en: "Enumeration Form — Auto-Fill Assistant" },
  appSubtitle: {
    mr: "SIR गणना प्रपत्र · फोटो + कागदपत्रे → Extract → पडताळणी → Submit",
    hi: "SIR गणना प्रपत्र · फोटो + दस्तावेज़ → Extract → सत्यापन → Submit",
    en: "SIR Enumeration Form · Photo + Documents → Extract → Verify → Submit",
  },
  stepPhoto: { mr: "फोटो", hi: "फोटो", en: "Photo" },
  stepDocs: { mr: "कागदपत्रे", hi: "दस्तावेज़", en: "Documents" },
  stepVerify: { mr: "पडताळणी", hi: "सत्यापन", en: "Verify" },
  stepSubmit: { mr: "सबमिट", hi: "सबमिट", en: "Submit" },

  photoHeading: { mr: "पासपोर्ट साईज फोटो अपलोड करा", hi: "पासपोर्ट साइज़ फोटो अपलोड करें", en: "Upload a Passport-Size Photo" },
  photoSubtext: {
    mr: "फॉर्मवर लावण्यासाठी अलीकडील, स्पष्ट पासपोर्ट-साईज फोटो निवडा (पांढरी/हलकी background उत्तम).",
    hi: "फॉर्म पर लगाने के लिए हाल का, स्पष्ट पासपोर्ट-साइज़ फोटो चुनें (सफ़ेद/हल्की background बेहतर).",
    en: "Choose a recent, clear passport-size photo for the form (a plain/light background works best).",
  },
  photoChoose: { mr: "फोटो निवडा", hi: "फोटो चुनें", en: "Choose Photo" },
  photoGuide1: { mr: "चेहरा स्पष्ट व समोरून दिसणारा असावा", hi: "चेहरा स्पष्ट और सामने से दिखने वाला होना चाहिए", en: "Face should be clear and front-facing" },
  photoGuide2: { mr: "अलीकडील (6 महिन्यांच्या आतील) फोटो वापरा", hi: "हाल का (6 महीने के भीतर का) फोटो इस्तेमाल करें", en: "Use a recent photo (within 6 months)" },
  photoGuide3: { mr: "JPG किंवा PNG फॉरमॅट, 5MB पेक्षा कमी", hi: "JPG या PNG फॉर्मेट, 5MB से कम", en: "JPG or PNG format, under 5MB" },
  photoErrorType: { mr: "कृपया JPG/PNG फोटो निवडा.", hi: "कृपया JPG/PNG फोटो चुनें.", en: "Please choose a JPG/PNG photo." },
  skipBtn: { mr: "फोटो नंतर लावा — Skip", hi: "फोटो बाद में लगाएं — Skip", en: "Add Photo Later — Skip" },
  nextDocsBtn: { mr: "पुढे — Documents Upload", hi: "आगे — Documents Upload", en: "Next — Upload Documents" },

  docHeading: { mr: "कागदपत्रे अपलोड करा", hi: "दस्तावेज़ अपलोड करें", en: "Upload Documents" },
  docSubtext: {
    mr: "एक-एक करून प्रत्येक document त्याच्या प्रकारासह अपलोड करा, किंवा सर्व एकत्र स्कॅन केलेली एक PDF अपलोड करा.",
    hi: "एक-एक करके हर document उसके प्रकार के साथ अपलोड करें, या सभी एक साथ स्कैन की हुई एक PDF अपलोड करें.",
    en: "Upload each document one by one with its type, or upload a single PDF with everything scanned together.",
  },
  modeIndividual: { mr: "एक-एक Document (JPG/PNG/PDF)", hi: "एक-एक Document (JPG/PNG/PDF)", en: "One by One (JPG/PNG/PDF)" },
  modeCombined: { mr: "सर्व एकत्र (एक PDF)", hi: "सभी एक साथ (एक PDF)", en: "All Combined (One PDF)" },
  docListHeading: { mr: "कोणकोणती कागदपत्रे अपलोड करायची आहेत", hi: "कौन-कौन से दस्तावेज़ अपलोड करने हैं", en: "Which Documents to Upload" },
  chooseFileBtn: { mr: "File निवडा", hi: "File चुनें", en: "Choose File" },
  choosePdfBtn: { mr: "PDF निवडा", hi: "PDF चुनें", en: "Choose PDF" },
  fileTypeError: { mr: "फक्त JPG, PNG किंवा PDF file allowed आहे.", hi: "केवल JPG, PNG या PDF file allowed है.", en: "Only JPG, PNG, or PDF files are allowed." },
  extractBtn: { mr: "माहिती Extract करा", hi: "जानकारी Extract करें", en: "Extract Information" },
  extractingText: { mr: "Documents वाचत आहे...", hi: "Documents पढ़े जा रहे हैं...", en: "Reading documents..." },
  needAtLeastOne: { mr: "आधी किमान एक document upload करा.", hi: "पहले कम से कम एक document upload करें.", en: "Please upload at least one document first." },

  verifyHeading: { mr: "तपशील तपासा — Verify Details", hi: "विवरण जांचें — Verify Details", en: "Verify Details" },
  verifySubtext: {
    mr: "हिरवी border = documents मधून auto-extract झालेले — एकदा पडताळून बघा. रिकामे field manually भरा.",
    hi: "हरी border = documents से auto-extract हुए — एक बार जांच लें. खाली field manually भरें.",
    en: "Green border = auto-extracted from documents — please verify once. Fill any empty fields manually.",
  },
  filledCountSuffix: { mr: "भरले", hi: "भरे गए", en: "filled" },
  backDocsBtn: { mr: "← आणखी Document जोडा", hi: "← और Document जोड़ें", en: "← Add More Documents" },
  nextReviewBtn: { mr: "पुढे जा — Review & Submit", hi: "आगे — Review & Submit", en: "Next — Review & Submit" },
  manualPlaceholder: { mr: "manually भरा", hi: "manually भरें", en: "enter manually" },

  reviewHeading: { mr: "अंतिम तपासणी — Final Review", hi: "अंतिम जांच — Final Review", en: "Final Review" },
  reviewSubtext: { mr: "Submit करण्यापूर्वी संपूर्ण माहिती एकदा वाचा.", hi: "Submit करने से पहले पूरी जानकारी एक बार पढ़ें.", en: "Please read through everything before submitting." },
  emptyValue: { mr: "रिकामे", hi: "खाली", en: "Empty" },
  editBtn: { mr: "← संपादन करा", hi: "← संपादित करें", en: "← Edit" },
  confirmBtn: { mr: "माहिती निश्चित करा — Confirm & Save", hi: "जानकारी पक्की करें — Confirm & Save", en: "Confirm & Save" },
  savingText: { mr: "Save करत आहे...", hi: "Save किया जा रहा है...", en: "Saving..." },
  savedHeading: { mr: "माहिती Database मध्ये Save झाली", hi: "जानकारी Database में Save हो गई", en: "Saved to Database" },
  savedSubtext: {
    mr: "Submission record तयार झाला. actual ECI/SIR पोर्टलवर सबमिट करण्यापूर्वी माहिती अधिकृत फॉर्मशी पुन्हा जुळवून घ्या.",
    hi: "Submission record तैयार हो गया. असली ECI/SIR पोर्टल पर सबमिट करने से पहले जानकारी को आधिकारिक फॉर्म से फिर मिला लें.",
    en: "Your submission record has been created. Please re-verify against the official form before submitting on the actual ECI/SIR portal.",
  },
  downloadPdfBtn: { mr: "PDF डाउनलोड करा", hi: "PDF डाउनलोड करें", en: "Download PDF" },
  newEntryBtn: { mr: "नवीन Entry सुरू करा", hi: "नई Entry शुरू करें", en: "Start New Entry" },

  langLabel: { mr: "भाषा", hi: "भाषा", en: "Language" },
};

export function t(key, lang) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
