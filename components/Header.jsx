import { ScanLine, CheckCircle2 } from "lucide-react";
import { useLang } from "./LangContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ step }) {
  const { t } = useLang();
  const STEPS = [
    { n: 1, key: "stepPhoto" },
    { n: 2, key: "stepDocs" },
    { n: 3, key: "stepVerify" },
    { n: 4, key: "stepSubmit" },
  ];

  return (
    <div>
      {/* Signature tricolor strip — a quiet nod to the subject, not the state emblem */}
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: "#FF9933" }} />
        <div style={{ flex: 1, background: "#F4F6F5" }} />
        <div style={{ flex: 1, background: "#138808" }} />
      </div>

      <div style={{ background: "var(--navy)", color: "#F4F6F5", padding: "20px 24px 22px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "2px solid #F4F6F5", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, position: "relative",
                }}
              >
                <ScanLine size={17} />
              </div>
              <div>
                <div className="serif" style={{ fontSize: 19, fontWeight: 700, letterSpacing: 0.2 }}>
                  {t("appTitle")}
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 1 }}>
                  {t("appSubtitle")}
                </div>
              </div>
            </div>
            <LanguageSwitcher />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      background: step >= s.n ? "#F4F6F5" : "transparent",
                      color: step >= s.n ? "var(--navy)" : "#F4F6F5",
                      border: "1.5px solid #F4F6F5",
                      transition: "background 0.2s",
                    }}
                  >
                    {step > s.n ? <CheckCircle2 size={14} /> : s.n}
                  </div>
                  <span style={{ fontSize: 12.5, opacity: step >= s.n ? 1 : 0.6 }}>{t(s.key)}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: "#F4F6F550" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
