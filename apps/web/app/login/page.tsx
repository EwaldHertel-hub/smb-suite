"use client";

import { useState } from "react";
import { useLoginMutation } from "@/store/slices/authApi";
import { useDispatch } from "react-redux";
import { setTokens } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await login({ email, password }).unwrap();
    dispatch(
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      })
    );
    router.push("/");
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Login</h1>
      <form className="grid" style={{ gap: 10 }} onSubmit={submit}>
        <label className="label">E-Mail</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="label">Passwort</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div
            className="card"
            style={{ borderColor: "#b94a4a", color: "#ffbdbd" }}
          >
            Login fehlgeschlagen
          </div>
        )}
        <button className="btn primary" disabled={isLoading}>
          {isLoading ? "..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
