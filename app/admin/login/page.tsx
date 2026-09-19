"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-display font-bold text-xl text-brand-dark mb-6 text-center">
        Store Admin
      </h1>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && <p className="text-brand-accent text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-brand-primary text-white font-semibold py-3 rounded-card disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-xs text-center text-brand-text/50">
          Your admin account is created once in Supabase — see README
          "Creating your admin login."
        </p>
      </div>
    </div>
  );
}
