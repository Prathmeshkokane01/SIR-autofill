import { useEffect, useState } from "react";
import Head from "next/head";

export default function Submissions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => setList(d.submissions || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Saved Submissions</title></Head>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 20px" }}>
        <div className="serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--navy)" }}>
          Database मधील Submissions
        </div>
        {loading && <div>Loading...</div>}
        {!loading && list.length === 0 && <div style={{ color: "var(--muted)" }}>अजून काहीही submit झालेले नाही.</div>}
        <div style={{ display: "grid", gap: 12 }}>
          {list.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <strong>{s.voterName || "(नाव नाही)"}</strong>
                <span className="mono" style={{ color: "var(--muted)", fontSize: 11.5 }}>{new Date(s.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                EPIC: {s.epicNumber || "—"} · DOB: {s.dob || "—"} · Status: {s.status} · Documents: {s.documents?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
