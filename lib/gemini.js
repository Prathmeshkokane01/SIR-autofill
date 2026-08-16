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
- fatherName / fatherEpic ही वडिलांच्या/पालकांच्या कागदपत्रावरून घे (voter cha document नाही).
- motherName / motherEpic आईच्या कागदपत्रावरून घे.
- spouseName / spouseEpic जोडीदाराच्या कागदपत्रावरून घे.
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

  const parts = [...files.map(fileToInlinePart), { text: EXTRACTION_PROMPT }];

  const result = await model.generateContent(parts);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Gemini cha response valid JSON navhta: " + cleaned.slice(0, 200));
  }
}
