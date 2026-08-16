import { useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../components/Header";
import PhotoUploadStep from "../components/PhotoUploadStep";
import DocumentUploadStep from "../components/DocumentUploadStep";
import VerifyStep from "../components/VerifyStep";
import SubmitStep from "../components/SubmitStep";
import { ALL_FIELD_KEYS } from "../lib/documentTypes";

function emptyForm() {
  const o = {};
  ALL_FIELD_KEYS.forEach((k) => (o[k] = ""));
  return o;
}

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null); // { file, preview, photoData }
  const [docs, setDocs] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]); // [{ docType, fileName, mimeType, base64 }]
  const [form, setForm] = useState(emptyForm());
  const [source, setSource] = useState({});

  // Upload the passport photo to the backend when moving past step 1
  const goToDocuments = async () => {
    if (photo?.file && !photo.photoData) {
      try {
        const fd = new FormData();
        fd.append("photo", photo.file);
        const res = await fetch("/api/upload-photo", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok) setPhoto((p) => ({ ...p, photoData: data.photoData }));
      } catch (e) {
        // non-fatal — user can still proceed without a saved photo
      }
    }
    setStep(2);
  };

  const handleExtracted = (extracted, documents) => {
    setForm((prev) => {
      const next = { ...prev };
      const src = { ...source };
      ALL_FIELD_KEYS.forEach((k) => {
        if (extracted[k] && String(extracted[k]).trim()) {
          next[k] = extracted[k];
          src[k] = "auto";
        }
      });
      setSource(src);
      return next;
    });
    setSavedDocuments(documents || []);
    setStep(3);
  };

  const resetAll = () => {
    setStep(1);
    setPhoto(null);
    setDocs([]);
    setSavedDocuments([]);
    setForm(emptyForm());
    setSource({});
  };

  return (
    <>
      <Head>
        <title>गणना प्रपत्र — Auto-Fill Assistant</title>
      </Head>
      {status === "loading" || status === "unauthenticated" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--muted)", fontSize: 13 }}>
          Loading...
        </div>
      ) : (
        <>
          <Header step={step} />
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px 60px" }}>
            {step === 1 && <PhotoUploadStep photo={photo} setPhoto={setPhoto} onNext={goToDocuments} />}
            {step === 2 && (
              <DocumentUploadStep
                docs={docs}
                setDocs={setDocs}
                onExtracted={handleExtracted}
                extracting={extracting}
                setExtracting={setExtracting}
              />
            )}
            {step === 3 && (
              <VerifyStep form={form} setForm={setForm} source={source} setSource={setSource} onBack={() => setStep(2)} onNext={() => setStep(4)} />
            )}
            {step === 4 && (
              <SubmitStep form={form} source={source} photo={photo} documents={savedDocuments} onBack={() => setStep(3)} onReset={resetAll} />
            )}
          </div>
        </>
      )}
    </>
  );
}
