import { createContext, useContext, useState } from "react";
import { t as translate } from "../lib/i18n";

const LangContext = createContext({ lang: "mr", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("mr");
  const t = (key) => translate(key, lang);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
