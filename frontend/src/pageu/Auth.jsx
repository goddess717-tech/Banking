import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const MOCK_USER = {
    email: "cindykazamedium@gmail.com",
    password: "Chadislate2018!",
  };

  const handleLogin = () => {
    if (loading) return;

    setError("");
    setLoading(true);

    // Simulate real authentication delay
    setTimeout(() => {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        navigate("/dashboard");
      } else {
        setError("Incorrect email or password");
        setLoading(false);
      }
    }, 3000); // ⏱️ 3 seconds
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1f33] via-[#0f2d4a] to-[#081726]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="New Apex Bank"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Secure Banking Access
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d4a] disabled:opacity-60  bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d4a] disabled:opacity-60 bg-transparent"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full rounded-lg py-3 text-sm font-semibold tracking-wide transition
              ${loading
                ? "bg-[#0f2d4a]/80 cursor-not-allowed"
                : "bg-[#0f2d4a] hover:bg-[#123a5c]"
              }
              text-white flex items-center justify-center gap-3`}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: "3px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-400">
            © 2026 New Apex Bank. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
