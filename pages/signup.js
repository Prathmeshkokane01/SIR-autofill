import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { UserPlus, Loader2 } from "lucide-react";
import { useLang } from "../components/LangContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import PasswordInput from "../components/PasswordInput";

export default function Signup() {
  const { t } = useLang();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup fail zala");

      const signinRes = await signIn("credentials", { redirect: false, email, password });
      if (signinRes?.error) throw new Error(t("invalidLoginError"));
      router.push("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign Up — गणना प्रपत्र</title></Head>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", height: 4 }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#F4F6F5" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>
        <div style={{ background: "var(--navy)", padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
          <LanguageSwitcher />
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <form onSubmit={handleSubmit} className="panel" style={{ padding: 28, width: 360, maxWidth: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <UserPlus size={20} color="var(--navy)" />
              <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{t("signupHeading")}</div>
            </div>

            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>{t("nameLabel")}</label>
            <input className="sir-input" required value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 14 }} />

            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>{t("emailLabel")}</label>
            <input className="sir-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 14 }} />

            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>{t("passwordLabel")}</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} style={{ marginBottom: 14 }} />

            {error && <div style={{ color: "var(--rust)", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <Loader2 size={15} className="spin" /> : t("signupBtn")}
            </button>

            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>
              {t("haveAccountText")}
              <Link href="/login" style={{ color: "var(--navy)", fontWeight: 600, textDecoration: "none" }}>{t("loginLink")}</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
