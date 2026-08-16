import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { ALL_FIELD_KEYS } from "./documentTypes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const EXTRACTION_PROMPT = `तू एक Indian government ID document extractor आहेस.
वर दिलेल्या document(s) मध्ये Voter ID / EPIC card, Aadhaar card, किंवा इतर सहाय्यक कागदपत्रे असू शकतात —
कधी कधी एकाच व्यक्तीचे, कधी कुटुंबातील वेगवेगळ्या सदस्यांचे (स्वतः, वडील, आई, जोडीदार).

प्रत्येक कागदपत्रावर कोणाचे नाव/relation आहे हे ओळखून खालील JSON भर.
मूल्य सापडले नाही तर तो key रिकामा string "" ठेव. फक्त valid JSON परत कर — कोणतेही markdown fences, प्रस्तावना किंवा स्पष्टीकरण लिहू नकोस.

JSON keys:
${ALL_FIELD_KEYS.join(", ")}

नियम:
- dob नेहमी DD/MM/YYYY format मध्ये दे.
- प्रत्येक image च्या आधी "Document type: <docType>" असा text label दिलेला आहे — तो वाचून तो image नक्की कोणाचा आहे ते ओळख.
- docType "father_voter_id" असेल तर त्यावरचे नाव fatherName मध्ये आणि EPIC क्रमांक fatherEpic मध्ये टाक.
- docType "mother_voter_id" असेल तर त्यावरचे नाव motherName मध्ये आणि EPIC motherEpic मध्ये टाक.
- docType "spouse_voter_id" असेल तर त्यावरचे नाव spouseName मध्ये आणि EPIC spouseEpic मध्ये टाक.
- docType "paternal_grandfather_aadhaar" असेल तर त्यावरचे नाव paternalGrandfatherName मध्ये टाक.
- docType "paternal_grandmother_aadhaar" असेल तर त्यावरचे नाव paternalGrandmotherName मध्ये टाक.
- docType "maternal_grandfather_aadhaar" असेल तर त्यावरचे नाव maternalGrandfatherName मध्ये टाक.
- docType "maternal_grandmother_aadhaar" असेल तर त्यावरचे नाव maternalGrandmotherName मध्ये टाक.
- docType "combined_pdf" असेल तर संपूर्ण PDF मध्ये सर्व व्यक्तींची कागदपत्रे शोधून वरील प्रमाणेच relation ओळखून योग्य key मध्ये भर.
- mobileNumber कोणत्याही ID document वर सहसा नसतो — तो रिकामा ठेव.`;

function fileToInlinePart(file) {
  const bytes = fs.readFileSync(file.filePath);
  const base64 = bytes.toString("base64");
  return {
    inlineData: {
      data: base64,
      mimeType: file.mimeType || "image/jpeg",
    },
  };
}

/**
 * files: [{ filePath, mimeType, docType }]
 * Returns parsed field object, e.g. { voterName: "...", epicNumber: "...", ... }
 */
export async function extractFieldsFromDocuments(files) {
  if (!files || files.length === 0) return {};

  const parts = [
    ...files.flatMap((f) => [{ text: `Document type: ${f.docType}` }, fileToInlinePart(f)]),
    { text: EXTRACTION_PROMPT },
  ];

  const result = await model.generateContent(parts);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Gemini cha response valid JSON navhta: " + cleaned.slice(0, 200));
  }
}
