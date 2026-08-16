import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { ScanLine } from "lucide-react";

export default function SignIn({ providers }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  return (
    <>
      <Head>
        <title>Login — गणना प्रपत्र Auto-Fill Assistant</title>
      </Head>
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: "#FF9933" }} />
        <div style={{ flex: 1, background: "#F4F6F5" }} />
        <div style={{ flex: 1, background: "#138808" }} />
      </div>
      <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="panel" style={{ padding: "40px 36px", maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: "50%", background: "var(--navy)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
            }}
          >
            <ScanLine size={24} />
          </div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            गणना प्रपत्र — Auto-Fill Assistant
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 26 }}>
            पुढे जाण्यासाठी लॉगिन करा — तुमची माहिती फक्त तुम्हालाच दिसते.
          </p>

          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
              >
                {provider.name} ने लॉगिन करा
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}
