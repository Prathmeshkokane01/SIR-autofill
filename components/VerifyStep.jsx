import { CheckCircle2, Pencil, ChevronRight } from "lucide-react";
import { FIELD_GROUPS, ALL_FIELD_KEYS, loc } from "../lib/documentTypes";
import { useLang } from "./LangContext";

export default function VerifyStep({ form, setForm, source, setSource, onBack, onNext }) {
  const { t, lang } = useLang();

  const updateField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSource((s) => ({ ...s, [key]: "manual" }));
  };

  const filledCount = ALL_FIELD_KEYS.filter((k) => form[k] && form[k].trim()).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div className="serif" style={{ fontSize: 16, fontWeight: 700 }}>{t("verifyHeading")}</div>
        <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{filledCount}/{ALL_FIELD_KEYS.length} {t("filledCountSuffix")}</div>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>{t("verifySubtext")}</p>

      {FIELD_GROUPS.map((group) => (
        <div key={loc(group.title, lang)} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 9 }}>
            {loc(group.title, lang)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {group.fields.map((f) => (
              <div key={f.key} style={{ gridColumn: f.key === "address" ? "1 / -1" : "auto" }}>
                <label style={{ fontSize: 11.5, color: "#3E4A44", display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  {loc(f.label, lang)}
                  {source[f.key] === "auto" && <CheckCircle2 size={11} color="var(--green)" />}
                  {!source[f.key] && !form[f.key] && <Pencil size={11} color="#9AAAA1" />}
                </label>
                <input
                  className={`sir-input ${source[f.key] === "auto" ? "auto-filled" : ""}`}
                  value={form[f.key] || ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  placeholder={f.manual ? t("manualPlaceholder") : "—"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-secondary" onClick={onBack}>{t("backDocsBtn")}</button>
        <button className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={onNext}>
          {t("nextReviewBtn")} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
