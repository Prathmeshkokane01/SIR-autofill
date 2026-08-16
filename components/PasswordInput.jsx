import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ value, onChange, minLength, style }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative", ...style }}>
      <input
        className="sir-input"
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        value={value}
        onChange={onChange}
        style={{ paddingRight: 38 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
          display: "flex", padding: 4,
        }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
