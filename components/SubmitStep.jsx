import { useState } from "react";
import { signOut } from "next-auth/react";
import { Stamp, Loader2, Download } from "lucide-react";
import { FIELD_GROUPS, ALL_FIELD_KEYS, loc } from "../lib/documentTypes";
import { useLang } from "./LangContext";

export default function SubmitStep({ form, source, photo, documents, onBack, onReset }) {
  const { t, lang } = useLang();
  const [saving, setSaving] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [error, setError] = useState("");

  const labelOf = (key) => {
    const f = FIELD_GROUPS.flatMap((g) => g.fields).find((fld) => fld.key === key);
    return f ? loc(f.label, lang) : key;
  };

  const confirmSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          fieldSource: source,
          photoData: photo?.photoData || null,
          documents,
          status: "submitted",
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(
          res.status === 413
            ? "Uploaded documents/photo खूप मोठे आहेत (एकूण 4MB पेक्षा जास्त). कमी size च्या files वापरून पुन्हा प्रयत्न करा."
            : "Server कडून अनपेक्षित response आला (status " + res.status + ")."
        );
      }
      if (!res.ok) throw new Error(data.error || "Save fail zale");
      setSubmittedId(data.id);
    } catch (e) {
      setError(e.message);
      if (e.message.includes("session expire")) {
        setTimeout(() => signOut({ callbackUrl: "/login" }), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (submittedId) {
    return (
      <div style={{ textAlign: "center", padding: "36px 10px" }}>
        <div
          className="stamp-anim"
          style={{
            width: 132, height: 132, margin: "0 auto 20px", borderRadius: "50%",
            border: "3px solid var(--rust)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--rust)", position: "relative",
          }}
        >
          <div style={{ position: "absolute", inset: 6, border: "1px solid var(--rust)", borderRadius: "50%" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Stamp size={26} />
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5 }}>VERIFIED</span>
          </div>
        </div>
        <div className="serif" style={{ fontSize: 17, fontWeight: 700 }}>{t("savedHeading")}</div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, maxWidth: 440, margin: "8px auto 0" }}>{t("savedSubtext")}</p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
          <a
            href={`/api/generate-pdf?id=${submittedId}`}
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Download size={15} /> {t("downloadPdfBtn")}
          </a>
          <button className="btn-secondary" onClick={onReset}>{t("newEntryBtn")}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="serif" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t("reviewHeading")}</div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>{t("reviewSubtext")}</p>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        {photo?.preview && (
          <img src={photo.preview} alt="passport" style={{ width: 84, height: 100, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
        )}
        <div className="panel" style={{ padding: "6px 16px", flex: 1 }}>
          {ALL_FIELD_KEYS.map((k, i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: i < ALL_FIELD_KEYS.length - 1 ? "1px solid #EEF0EE" : "none", fontSize: 13 }}>
              <span style={{ color: "var(--muted)", flex: "0 0 55%" }}>{labelOf(k)}</span>
              <span className="mono" style={{ fontWeight: 600, textAlign: "right", color: form[k] ? "var(--ink)" : "var(--rust)" }}>
                {form[k] || t("emptyValue")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <div style={{ color: "var(--rust)", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn-secondary" onClick={onBack}>{t("editBtn")}</button>
        <button
          className="btn-primary"
          style={{ flex: 1, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={confirmSubmit}
          disabled={saving}
        >
          {saving ? <><Loader2 size={15} className="spin" /> {t("savingText")}</> : t("confirmBtn")}
        </button>
      </div>
    </div>
  );
}
