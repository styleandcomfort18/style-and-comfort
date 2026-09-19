"use client";
import { useState } from "react";

// PLACEHOLDER — not yet wired to real authentication.
// Once Supabase is connected (see README), this becomes real login,
// and only you (not visitors) will be able to reach /admin/dashboard.

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        />
        <button className="w-full bg-brand-primary text-white font-semibold py-3 rounded-card">
          Log in
        </button>
        <p className="text-xs text-center text-brand-text/50">
          Not yet connected to real accounts — see README "Admin & database" section.
        </p>
      </div>
    </div>
  );
}
