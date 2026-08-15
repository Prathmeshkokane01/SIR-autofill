import { LANGUAGES } from "../lib/i18n";
import { useLang } from "./LangContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.12)", padding: 3, borderRadius: 8 }}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          style={{
            border: "none",
            borderRadius: 6,
            padding: "5px 11px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: lang === l.code ? "#fff" : "transparent",
            color: lang === l.code ? "var(--navy)" : "#F4F6F5",
            transition: "all 0.15s",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
