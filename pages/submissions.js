import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Search, Trash2, Download, Loader2, FileText } from "lucide-react";
import Header from "../components/Header";
import { useLang } from "../components/LangContext";

export default function Submissions() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useLang();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/submissions")
        .then((r) => r.json())
        .then((d) => setList(d.submissions || []))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (s.voterName || "").toLowerCase().includes(q) || (s.epicNumber || "").toLowerCase().includes(q);
    });
  }, [list, query, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm(t("deleteConfirmText"))) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete fail zale");
      setList((l) => l.filter((s) => s.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (status !== "authenticated") {
    return <div style={{ padding: 30, color: "var(--muted)", fontSize: 13 }}>Loading...</div>;
  }

  return (
    <>
      <Head><title>{t("submissionsHeading")} — गणना प्रपत्र</title></Head>
      <Header step={0} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{t("submissionsHeading")}</div>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{filtered.length} {t("totalCountSuffix")}</div>
        </div>

        {/* Search + filter row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search size={15} color="var(--muted)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              className="sir-input"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "all", label: t("filterAll") },
              { key: "draft", label: t("filterDraft") },
              { key: "submitted", label: t("filterSubmitted") },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={statusFilter === f.key ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: 12.5, padding: "8px 14px" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ color: "var(--rust)", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading...</div>}
        {!loading && list.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>{t("noSubmissionsText")}</div>}
        {!loading && list.length > 0 && filtered.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>{t("noMatchText")}</div>}

        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((s) => (
            <div key={s.id} className="panel" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
              {s.photoData ? (
                <img src={s.photoData} alt="" style={{ width: 46, height: 56, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 46, height: 56, borderRadius: 4, background: "#F0F2F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={18} color="var(--muted)" />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13.5, marginBottom: 4 }}>
                  <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.voterName || "(नाव नाही)"}</strong>
                  <span className="mono" style={{ color: "var(--muted)", fontSize: 11, flexShrink: 0 }}>{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  EPIC: {s.epicNumber || "—"} · DOB: {s.dob || "—"} ·{" "}
                  <span style={{ color: s.status === "submitted" ? "var(--green)" : "var(--rust)", fontWeight: 600 }}>{s.status}</span>
                  {" · "}Documents: {s.documents?.length || 0}
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <a
                  href={`/api/generate-pdf?id=${s.id}`}
                  title={t("downloadPdfLink")}
                  style={{ background: "var(--navy)", color: "#fff", borderRadius: 6, padding: 8, display: "flex" }}
                >
                  <Download size={15} />
                </a>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  title={t("deleteBtn")}
                  style={{ background: "var(--rust-bg)", color: "var(--rust)", border: "none", borderRadius: 6, padding: 8, cursor: "pointer", display: "flex" }}
                >
                  {deletingId === s.id ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
