import { useRef, useState } from "react";
import { ImagePlus, ChevronRight, AlertCircle } from "lucide-react";
import { useLang } from "./LangContext";

export default function PhotoUploadStep({ photo, setPhoto, onNext }) {
  const { t } = useLang();
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handlePick = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("photoErrorType"));
      return;
    }
    setError("");
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  return (
    <div>
      <div className="serif" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
        {t("photoHeading")}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>{t("photoSubtext")}</p>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 140, height: 170, borderRadius: 8,
            border: photo ? "1.5px solid var(--border)" : "2px dashed #9AAAA1",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", flexShrink: 0,
          }}
        >
          {photo ? (
            <img src={photo.preview} alt="passport" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ textAlign: "center", color: "var(--muted)" }}>
              <ImagePlus size={22} />
              <div style={{ fontSize: 11, marginTop: 6 }}>{t("photoChoose")}</div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePick(e.target.files[0])}
          />
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <ul style={{ fontSize: 12.5, color: "var(--muted)", paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
            <li>{t("photoGuide1")}</li>
            <li>{t("photoGuide2")}</li>
            <li>{t("photoGuide3")}</li>
          </ul>
          {error && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--rust)", fontSize: 12.5, marginTop: 8 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-secondary" onClick={onNext}>{t("skipBtn")}</button>
        <button className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={onNext}>
          {t("nextDocsBtn")} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
