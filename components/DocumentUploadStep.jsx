import { useRef, useState } from "react";
import { Upload, FileText, X, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { DOCUMENT_TYPES, COMBINED_PDF_TYPE, loc } from "../lib/documentTypes";
import { useLang } from "./LangContext";

export default function DocumentUploadStep({ docs, setDocs, onExtracted, extracting, setExtracting }) {
  const { t, lang } = useLang();
  const [mode, setMode] = useState("individual"); // "individual" | "combined"
  const [pendingType, setPendingType] = useState(DOCUMENT_TYPES[0].key);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const isAllowed = (file) => file.type.startsWith("image/") || file.type === "application/pdf";

  const addFiles = (fileList, forcedType) => {
    const files = Array.from(fileList).filter(isAllowed);
    if (files.length === 0) {
      setError(t("fileTypeError"));
      return;
    }
    setError("");
    const withMeta = files.map((f) => ({
      file: f,
      docType: forcedType || pendingType,
      name: f.name,
      isPdf: f.type === "application/pdf",
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setDocs((d) => [...d, ...withMeta]);
  };

  const removeDoc = (idx) => setDocs((d) => d.filter((_, i) => i !== idx));

  const extractAll = async () => {
    if (docs.length === 0) {
      setError(t("needAtLeastOne"));
      return;
    }
    setError("");
    setExtracting(true);
    try {
      const formData = new FormData();
      docs.forEach((d) => {
        formData.append("files", d.file);
        formData.append("docTypes", d.docType);
      });

      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction fail zala");

      onExtracted(data.extracted, data.documents);
    } catch (e) {
      setError(e.message);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div>
      <div className="serif" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t("docHeading")}</div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>{t("docSubtext")}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("individual")} className={mode === "individual" ? "btn-primary" : "btn-secondary"} style={{ fontSize: 12.5, padding: "8px 14px" }}>
          {t("modeIndividual")}
        </button>
        <button onClick={() => setMode("combined")} className={mode === "combined" ? "btn-primary" : "btn-secondary"} style={{ fontSize: 12.5, padding: "8px 14px" }}>
          {t("modeCombined")}
        </button>
      </div>

      {mode === "individual" && (
        <div className="panel" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>
            {t("docListHeading")}
          </div>
          {DOCUMENT_TYPES.map((doc) => (
            <div key={doc.key} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", borderBottom: "1px solid #F0F2F0", fontSize: 12.5 }}>
              <div>
                <span style={{ fontWeight: 600 }}>{loc(doc.label, lang)}</span>
                {doc.required && <span style={{ color: "var(--rust)", marginLeft: 5, fontSize: 11 }}>*</span>}
                <div style={{ color: "var(--muted)", fontSize: 11.5, marginTop: 1 }}>{loc(doc.hint, lang)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {mode === "individual" && (
          <select className="sir-input" style={{ width: "auto", flex: "1 1 260px" }} value={pendingType} onChange={(e) => setPendingType(e.target.value)}>
            {DOCUMENT_TYPES.map((doc) => (
              <option key={doc.key} value={doc.key}>{loc(doc.label, lang)}</option>
            ))}
          </select>
        )}
        <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 7 }} onClick={() => inputRef.current?.click()}>
          <Upload size={15} /> {mode === "combined" ? t("choosePdfBtn") : t("chooseFileBtn")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={mode === "combined" ? "application/pdf" : "image/*,application/pdf"}
          multiple={mode === "individual"}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files, mode === "combined" ? COMBINED_PDF_TYPE.key : undefined)}
        />
      </div>

      {error && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--rust)", fontSize: 12.5, marginBottom: 12 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {docs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {docs.map((d, i) => {
            const typeInfo = [...DOCUMENT_TYPES, COMBINED_PDF_TYPE].find((tp) => tp.key === d.docType);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 4, background: "#F0F2F0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {d.preview ? <img src={d.preview} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FileText size={16} color="var(--navy)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{typeInfo ? loc(typeInfo.label, lang) : ""}</div>
                </div>
                <button onClick={() => removeDoc(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={extractAll} disabled={extracting || docs.length === 0} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {extracting ? (
          <><Loader2 size={16} className="spin" /> {t("extractingText")}</>
        ) : (
          <>{t("extractBtn")} <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  );
}
