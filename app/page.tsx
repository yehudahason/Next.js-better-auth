"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🔐 Session
  const { data: session, isPending } = authClient.useSession();

  // ✅ Fix hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚫 Prevent hydration mismatch
  if (!mounted) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      let res;

      if (mode === "signup") {
        res = await authClient.signUp.email({
          email,
          password,
          name,
        });
      } else {
        res = await authClient.signIn.email({
          email,
          password,
        });
      }

      if (res?.error) {
        throw new Error(res.error.message);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || `${mode} failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  // ⏳ Loading state (after mount only)
  if (isPending) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // 🔐 Logged in view
  if (session) {
    return (
      <div className="max-w-md mx-auto mt-10 space-y-4 text-center">
        <h2 className="text-xl font-bold">You are logged in</h2>
        <p>{session.user.email}</p>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-500 text-white p-2"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  // 🔓 Auth form
  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      {/* Toggle */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode("signup")}
          className={mode === "signup" ? "font-bold" : ""}
        >
          Sign Up
        </button>
        <button
          onClick={() => setMode("login")}
          className={mode === "login" ? "font-bold" : ""}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">
            {mode === "signup" ? "Account created!" : "Logged in successfully!"}
          </p>
        )}

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2"
        >
          {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Login"}
        </button>
      </form>
    </div>
  );
}
