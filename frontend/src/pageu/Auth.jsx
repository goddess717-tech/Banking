import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const MOCK_USER = {
    email: "cindykazamedium@gmail.com",
    password: "Chadislate2018!",
  };

  const handleLogin = () => {
    setError("");

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      navigate("/dashboard");
    } else {
      setError("Incorrect email or password");
    }
  };

  return (
    <>
      {/* Logo */}


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
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d4a] bg-transparent"
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
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d4a] bg-transparent"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-[#0f2d4a] text-white py-3 text-sm font-semibold tracking-wide hover:bg-[#123a5c] transition"
          >
            Sign in
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
