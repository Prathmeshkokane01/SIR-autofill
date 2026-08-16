import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Submissions() {
  const { status } = useSession();
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (status !== "authenticated") {
    return <div style={{ padding: 30, color: "var(--muted)", fontSize: 13 }}>Loading...</div>;
  }

  return (
    <>
      <Head><title>Saved Submissions</title></Head>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 20px" }}>
        <div className="serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--navy)" }}>
          तुमचे Submissions
        </div>
        {loading && <div>Loading...</div>}
        {!loading && list.length === 0 && <div style={{ color: "var(--muted)" }}>अजून काहीही submit झालेले नाही.</div>}
        <div style={{ display: "grid", gap: 12 }}>
          {list.map((s) => (
            <div key={s.id} className="panel" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <strong>{s.voterName || "(नाव नाही)"}</strong>
                <span className="mono" style={{ color: "var(--muted)", fontSize: 11.5 }}>{new Date(s.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                EPIC: {s.epicNumber || "—"} · DOB: {s.dob || "—"} · Status: {s.status} · Documents: {s.documents?.length || 0}
              </div>
              <a href={`/api/generate-pdf?id=${s.id}`} style={{ fontSize: 12, color: "var(--navy)", fontWeight: 600 }}>
                PDF डाउनलोड करा →
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
