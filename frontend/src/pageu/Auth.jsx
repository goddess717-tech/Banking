import { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- MOCK DATA ---------------- */

const MOCK_USER = {
  email: "cindykazamedium@gmail.com",
  password: "Chadislate2018!",
  phone: "+1 415 889 4421",
  emailOtp: "246810",
  phoneOtp: "135790",
};

/* ---------------- HELPERS ---------------- */

const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  return `${name[0]}****@${domain}`;
};

const maskPhone = (phone) =>
  phone.replace(/\d(?=\d{4})/g, "•");

/* ---------------- COMPONENT ---------------- */

export default function Login() {
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [step, setStep] = useState("LOGIN");
  const [status, setStatus] = useState("IDLE"); // IDLE | LOADING | VERIFYING | SUCCESS
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const inputsRef = useRef([]);

  /* ---------------- OTP INPUT HANDLING ---------------- */

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length !== 6) return;

    const next = pasted.split("").slice(0, 6);
    setOtp(next);

    setTimeout(() => {
      inputsRef.current[5]?.focus();
    }, 0);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };


  const otpValue = otp.join("");

  /* ---------------- LOGIN ---------------- */

  const handleLogin = () => {

    setError("");
    setStatus("LOADING");

    setTimeout(() => {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        setStep("EMAIL_OTP");
        setStatus("LOADING");
      } else {
        setError("Incorrect email or password");
        setStatus("IDLE");
      }
    }, 2500);

  };

  /* ---------------- EMAIL OTP ---------------- */

  useEffect(() => {
    if (step === "EMAIL_OTP") {
      setTimeout(() => setStatus("IDLE"), 2000);
    }
  }, [step]);

  const verifyEmailOtp = () => {
    setError("");
    setStatus("VERIFYING");

    setTimeout(() => {
      if (otpValue === MOCK_USER.emailOtp) {
        setStatus("SUCCESS");
        setTimeout(() => {
          setOtp(Array(6).fill(""));
          setStep("PHONE_OTP");
          setStatus("LOADING");
        }, 1500);
      } else {
        setError("Invalid or expired code");
        setStatus("IDLE");
      }
    }, 2000);
  };

  /* ---------------- PHONE OTP ---------------- */

  useEffect(() => {
    if (step === "PHONE_OTP") {
      setTimeout(() => setStatus("IDLE"), 2000);
    }
  }, [step]);

  const verifyPhoneOtp = () => {
    setError("");
    setStatus("VERIFYING");

    setTimeout(() => {
      if (otpValue === MOCK_USER.phoneOtp) {
        navigate("/dashboard");
      } else {
        setError("Authentication failed");
        setStatus("IDLE");
      }
    }, 2000);
  };

  useEffect(() => {
    if (step !== "LOGIN") {
      setTimeout(() => inputsRef.current[0]?.focus(), 300);
    }
  }, [step]);

  useEffect(() => {
    if (step === "EMAIL_OTP" || step === "PHONE_OTP") {
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleResend = () => {
    if (resendCooldown > 0) return;

    setOtp(Array(6).fill(""));
    setStatus("LOADING");

    setTimeout(() => {
      setStatus("IDLE");
      setResendCooldown(30);
    }, 2000);
  };



  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1f33] to-[#081726] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-6">
          <img src="/logo.png" className="h-10 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Secure Banking Authentication
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* LOGIN */}
        {step === "LOGIN" && (
          <>
            <Field label="Email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
        <a href="#" className="w-full flex items-center justify-end -mt-1 text-blue-500 mb-3 text-xs">Forget password?</a>
            <PrimaryButton loading={status === "LOADING"} onClick={handleLogin}>
              Signing in
            </PrimaryButton>
          </>
        )}

        {/* EMAIL OTP */}
        {step === "EMAIL_OTP" && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              We sent a verification code to{" "}
              <strong>{maskEmail(MOCK_USER.email)}</strong>
            </p>

            <OtpInput
              otp={otp}
              onChange={handleOtpChange}
              onPaste={handleOtpPaste}
              onKeyDown={handleOtpKeyDown}
              ref={inputsRef}
            />

            <div className="text-center text-xs text-gray-500 mb-4">
              {resendCooldown > 0 ? (
                <>Resend available in {resendCooldown}s</>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-[#0f2d4a] font-medium hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>

            <StatusText status={status} success="Email verified successfully" />

            <PrimaryButton onClick={verifyEmailOtp} loading={status !== "IDLE"}>
              Verify Email
            </PrimaryButton>
          </>
        )}

        {/* PHONE OTP */}
        {step === "PHONE_OTP" && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the code sent to{" "}
              <strong>{maskPhone(MOCK_USER.phone)}</strong>
            </p>

            <OtpInput
              otp={otp}
              onChange={handleOtpChange}
              onPaste={handleOtpPaste}
              onKeyDown={handleOtpKeyDown}
              ref={inputsRef}
            />

            <div className="text-center text-xs text-gray-500 mb-4">
              {resendCooldown > 0 ? (
                <>Resend available in {resendCooldown}s</>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-[#0f2d4a] font-medium hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>

            <StatusText status={status} success="Device authenticated" />

            <PrimaryButton onClick={verifyPhoneOtp} loading={status !== "IDLE"}>
              Confirm & Continue
            </PrimaryButton>
          </>
        )}
         <a href="#" className="w-full flex items-center justify-center text-blue-500 mt-3 underline">Create account</a>
        <footer className="mt-6 text-center text-xs text-gray-400">
          © 2026 New Apex Bank
        </footer>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0f2d4a] bg-transparent"
      />
    </div>
  );
}

const OtpInput = forwardRef(
  ({ otp, onChange, onPaste, onKeyDown }, ref) => {
    return (
      <div className="flex justify-between gap-2 mb-5">
        {otp.map((v, i) => (
          <input
            key={i}
            ref={(el) => (ref.current[i] = el)}
            value={v}
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[#0f2d4a] bg-transparent"
          />
        ))}
      </div>
    );
  }
);






function PrimaryButton({ children, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-[#0f2d4a] text-white py-3 rounded-lg font-semibold mt-2 disabled:opacity-70"
    >
      {loading ? "Processing…" : children}
    </button>
  );
}

function StatusText({ status, success }) {
  if (status === "LOADING") return <p className="text-xs text-gray-500 mb-3">Sending code…</p>;
  if (status === "VERIFYING") return <p className="text-xs text-gray-500 mb-3">Verifying…</p>;
  if (status === "SUCCESS") return <p className="text-xs text-green-600 mb-3">✔ {success}</p>;
  return null;
}
