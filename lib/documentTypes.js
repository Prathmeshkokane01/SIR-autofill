// Central list of document types the user can upload, shown in the UI
// and used to tell the AI what each image/PDF is when extracting fields.
// Each label/hint has mr/hi/en variants — use localize(item, lang) to read.

export const DOCUMENT_TYPES = [
  {
    key: "self_voter_id",
    required: true,
    label: { mr: "स्वतःचे जुने Voter ID / EPIC कार्ड", hi: "स्वयं का पुराना Voter ID / EPIC कार्ड", en: "Your Old Voter ID / EPIC Card" },
    hint: {
      mr: "मागील मतदार यादीतील EPIC क्रमांक व नाव यासाठी आवश्यक.",
      hi: "पिछली मतदाता सूची के EPIC नंबर और नाम के लिए आवश्यक.",
      en: "Needed for your EPIC number and name from the previous voter list.",
    },
  },
  {
    key: "aadhaar",
    required: false,
    label: { mr: "आधार कार्ड (ऐच्छिक)", hi: "आधार कार्ड (वैकल्पिक)", en: "Aadhaar Card (optional)" },
    hint: {
      mr: "जन्मतारीख (DOB) व ओळख पडताळणीसाठी उपयुक्त.",
      hi: "जन्मतिथि (DOB) और पहचान सत्यापन के लिए उपयोगी.",
      en: "Useful for date of birth and identity verification.",
    },
  },
  {
    key: "father_voter_id",
    required: false,
    label: { mr: "वडिलांचे / पालकांचे जुने Voter ID", hi: "पिता / अभिभावक का पुराना Voter ID", en: "Father's / Guardian's Old Voter ID" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — वडिलांचे नाव व EPIC क्रमांक भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — पिता का नाम व EPIC नंबर भरने के लिए.",
      en: "Upload if available — fills father's name and EPIC number.",
    },
  },
  {
    key: "mother_voter_id",
    required: false,
    label: { mr: "आईचे जुने Voter ID", hi: "माता का पुराना Voter ID", en: "Mother's Old Voter ID" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — आईचे नाव व EPIC क्रमांक भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — माता का नाम व EPIC नंबर भरने के लिए.",
      en: "Upload if available — fills mother's name and EPIC number.",
    },
  },
  {
    key: "spouse_voter_id",
    required: false,
    label: { mr: "पती/पत्नीचे जुने Voter ID (लागू असल्यास)", hi: "पति/पत्नी का पुराना Voter ID (लागू हो तो)", en: "Spouse's Old Voter ID (if applicable)" },
    hint: {
      mr: "विवाहित असल्यास व माहिती उपलब्ध असल्यास अपलोड करा.",
      hi: "विवाहित हों और जानकारी उपलब्ध हो तो अपलोड करें.",
      en: "Upload if married and the information is available.",
    },
  },
  {
    key: "paternal_grandfather_aadhaar",
    required: false,
    label: { mr: "वडिलांच्या वडिलांचे आधार कार्ड (आजोबा)", hi: "पिता के पिता का आधार कार्ड (दादा)", en: "Paternal Grandfather's Aadhaar Card" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — वडिलांच्या वडिलांचे नाव भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — पिता के पिता का नाम भरने के लिए.",
      en: "Upload if available — fills paternal grandfather's name.",
    },
  },
  {
    key: "paternal_grandmother_aadhaar",
    required: false,
    label: { mr: "वडिलांच्या आईचे आधार कार्ड (आजी)", hi: "पिता की माता का आधार कार्ड (दादी)", en: "Paternal Grandmother's Aadhaar Card" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — वडिलांच्या आईचे नाव भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — पिता की माता का नाम भरने के लिए.",
      en: "Upload if available — fills paternal grandmother's name.",
    },
  },
  {
    key: "maternal_grandfather_aadhaar",
    required: false,
    label: { mr: "आईच्या वडिलांचे आधार कार्ड (आजोबा)", hi: "माता के पिता का आधार कार्ड (नाना)", en: "Maternal Grandfather's Aadhaar Card" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — आईच्या वडिलांचे नाव भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — माता के पिता का नाम भरने के लिए.",
      en: "Upload if available — fills maternal grandfather's name.",
    },
  },
  {
    key: "maternal_grandmother_aadhaar",
    required: false,
    label: { mr: "आईच्या आईचे आधार कार्ड (आजी)", hi: "माता की माता का आधार कार्ड (नानी)", en: "Maternal Grandmother's Aadhaar Card" },
    hint: {
      mr: "उपलब्ध असल्यास अपलोड करा — आईच्या आईचे नाव भरण्यासाठी.",
      hi: "उपलब्ध हो तो अपलोड करें — माता की माता का नाम भरने के लिए.",
      en: "Upload if available — fills maternal grandmother's name.",
    },
  },
  {
    key: "other_supporting",
    required: false,
    label: { mr: "इतर सहाय्यक कागदपत्र", hi: "अन्य सहायक दस्तावेज़", en: "Other Supporting Document" },
    hint: {
      mr: "जुने EPIC उपलब्ध नसल्यास: जन्म दाखला, पासपोर्ट, शाळा सोडल्याचा दाखला, रहिवासी दाखला इ.",
      hi: "पुराना EPIC उपलब्ध न हो तो: जन्म प्रमाणपत्र, पासपोर्ट, स्कूल छोड़ने का प्रमाणपत्र, निवास प्रमाणपत्र आदि.",
      en: "If old EPIC isn't available: birth certificate, passport, school leaving certificate, residence proof, etc.",
    },
  },
];

// Alternate bulk mode: one combined PDF containing all documents together.
export const COMBINED_PDF_TYPE = {
  key: "combined_pdf",
  label: { mr: "सर्व कागदपत्रे एकत्र (PDF)", hi: "सभी दस्तावेज़ एक साथ (PDF)", en: "All Documents Combined (PDF)" },
  hint: {
    mr: "एकाच PDF मध्ये सर्व कागदपत्रे स्कॅन केलेली असतील तर हा पर्याय वापरा — AI संपूर्ण PDF मधून माहिती शोधेल.",
    hi: "एक ही PDF में सभी दस्तावेज़ स्कैन किए हैं तो यह विकल्प चुनें — AI पूरी PDF में से जानकारी ढूंढ लेगा.",
    en: "Use this if all documents are scanned into a single PDF — AI will find the information across the whole file.",
  },
};

export const FIELD_GROUPS = [
  {
    title: { mr: "मतदार ओळख", hi: "मतदाता पहचान", en: "Voter Identity" },
    fields: [
      { key: "voterName", label: { mr: "मतदाराचे नाव", hi: "मतदाता का नाम", en: "Voter Name" } },
      { key: "epicNumber", label: { mr: "मतदार ओळखपत्र क्रमांक (EPIC)", hi: "मतदाता पहचान पत्र नंबर (EPIC)", en: "EPIC / Voter ID Number" } },
      { key: "dob", label: { mr: "जन्म तारीख (DD/MM/YYYY)", hi: "जन्म तिथि (DD/MM/YYYY)", en: "Date of Birth (DD/MM/YYYY)" } },
      { key: "aadhaarNumber", label: { mr: "आधार क्रमांक (ऐच्छिक)", hi: "आधार नंबर (वैकल्पिक)", en: "Aadhaar Number (optional)" } },
      { key: "mobileNumber", label: { mr: "मोबाइल क्रमांक", hi: "मोबाइल नंबर", en: "Mobile Number" }, manual: true },
    ],
  },
  {
    title: { mr: "पत्ता व मतदारसंघ", hi: "पता व निर्वाचन क्षेत्र", en: "Address & Constituency" },
    fields: [
      { key: "address", label: { mr: "पत्ता", hi: "पता", en: "Address" } },
      { key: "district", label: { mr: "जिल्हा", hi: "ज़िला", en: "District" } },
      { key: "state", label: { mr: "राज्य", hi: "राज्य", en: "State" } },
      { key: "assemblyConstituency", label: { mr: "विधानसभा मतदारसंघ", hi: "विधानसभा निर्वाचन क्षेत्र", en: "Assembly Constituency" } },
      { key: "partNumber", label: { mr: "भाग क्रमांक", hi: "भाग संख्या", en: "Part Number" } },
    ],
  },
  {
    title: { mr: "कौटुंबिक तपशील", hi: "पारिवारिक विवरण", en: "Family Details" },
    fields: [
      { key: "fatherName", label: { mr: "वडिलांचे/पालकांचे नाव", hi: "पिता/अभिभावक का नाम", en: "Father's / Guardian's Name" } },
      { key: "fatherEpic", label: { mr: "वडिलांचा EPIC क्रमांक", hi: "पिता का EPIC नंबर", en: "Father's EPIC Number" } },
      { key: "motherName", label: { mr: "आईचे नाव", hi: "माता का नाम", en: "Mother's Name" } },
      { key: "motherEpic", label: { mr: "आईचा EPIC क्रमांक", hi: "माता का EPIC नंबर", en: "Mother's EPIC Number" } },
      { key: "spouseName", label: { mr: "पती/पत्नीचे नाव", hi: "पति/पत्नी का नाम", en: "Spouse's Name" } },
      { key: "spouseEpic", label: { mr: "पती/पत्नीचा EPIC क्रमांक", hi: "पति/पत्नी का EPIC नंबर", en: "Spouse's EPIC Number" } },
    ],
  },
  {
    title: { mr: "आजी-आजोबांचे तपशील", hi: "दादा-दादी का विवरण", en: "Grandparents' Details" },
    fields: [
      { key: "paternalGrandfatherName", label: { mr: "वडिलांच्या वडिलांचे नाव (आजोबा)", hi: "पिता के पिता का नाम (दादा)", en: "Father's Father's Name (Grandfather)" } },
      { key: "paternalGrandmotherName", label: { mr: "वडिलांच्या आईचे नाव (आजी)", hi: "पिता की माता का नाम (दादी)", en: "Father's Mother's Name (Grandmother)" } },
      { key: "maternalGrandfatherName", label: { mr: "आईच्या वडिलांचे नाव (आजोबा)", hi: "माता के पिता का नाम (नाना)", en: "Mother's Father's Name (Grandfather)" } },
      { key: "maternalGrandmotherName", label: { mr: "आईच्या आईचे नाव (आजी)", hi: "माता की माता का नाम (नानी)", en: "Mother's Mother's Name (Grandmother)" } },
    ],
  },
];

export const ALL_FIELD_KEYS = FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.key));

// Helper: read a {mr, hi, en} object in the current language, falling back to English.
export function loc(obj, lang) {
  if (!obj) return "";
  return obj[lang] || obj.en || "";
}
