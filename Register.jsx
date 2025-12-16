import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { API_BASE_URL } from "../config/api";

const COLLEGE_SUGGESTIONS = [
  "IIT Bombay","IIT Delhi","IIT Madras","NIT Trichy","Delhi University",
  "Anna University","BITS Pilani","VIT University","SRM University",
  "Manipal Institute of Technology","Christ University","RV College of Engineering",
  "PES University","KIIT University","Amrita University"
];

const Register = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    role: "student"
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".college-autocomplete")) {
        setShowCollegeSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- HELPERS ---------------- */
  const launchBalloons = () => {
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ff4d4d", "#4da6ff", "#66ff66", "#ffcc00"]
    });
  };

  const playWelcomeSound = () => {
    const audio = new Audio("/sounds/welcome.mp3");
    audio.play();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain uppercase letter";
    if (!/[a-z]/.test(password)) return "Must contain lowercase letter";
    if (!/\d/.test(password)) return "Must contain number";
    if (!/[!@#$%^&*]/.test(password)) return "Must contain special character";
    return "";
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setError(pwdError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          role: formData.role
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setOtpSent(true);
      setInfoMessage(data.message || "OTP sent to your email");

      if (data.debugOtp && import.meta.env.MODE === "development") {
        setDevOtp(data.debugOtp);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      /* 🎉 WELCOME EFFECTS */
      launchBalloons();
      playWelcomeSound();

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to resend OTP");

      setInfoMessage(data.message || "OTP resent");
      if (data.debugOtp && import.meta.env.MODE === "development") {
        setDevOtp(data.debugOtp);
      }
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- COLLEGE SEARCH ---------------- */
  const handleCollegeSearch = (value) => {
    setFormData((p) => ({ ...p, college: value }));
    if (!value) return setShowCollegeSuggestions(false);

    setFilteredColleges(
      COLLEGE_SUGGESTIONS.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowCollegeSuggestions(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow">

        <h1 className="text-2xl font-bold text-center mb-5">
          Create Account
        </h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" required onChange={handleInputChange} className="w-full border p-3 rounded" />
          <input name="email" type="email" placeholder="Email" required disabled={otpSent} onChange={handleInputChange} className="w-full border p-3 rounded" />

          <div className="relative college-autocomplete">
            <input
              placeholder="College"
              value={formData.college}
              onChange={(e) => handleCollegeSearch(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
            {showCollegeSuggestions && (
              <div className="absolute w-full bg-white border rounded mt-1 z-10">
                {filteredColleges.map((c) => (
                  <div
                    key={c}
                    onClick={() => setFormData(p => ({ ...p, college: c }))}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} className="w-full border p-3 rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} className="w-full border p-3 rounded" />

          <select name="role" onChange={handleInputChange} className="w-full border p-3 rounded">
            <option value="student">Student</option>
            <option value="college_admin">College Admin</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-3 rounded" disabled={loading || otpSent}>
            {otpSent ? "OTP Sent" : loading ? "Creating..." : "Create Account & Send OTP"}
          </button>
        </form>

        {otpSent && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-1">
              Verify Email
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Enter OTP sent to <strong>{formData.email}</strong>
            </p>

            <p className="text-green-700 mb-2">{infoMessage}</p>

            {devOtp && import.meta.env.MODE === "development" && (
              <p className="text-xs text-gray-500 mb-2">Dev OTP: {devOtp}</p>
            )}

            {otpError && <p className="text-red-600 mb-3">{otpError}</p>}

            <div className="flex gap-3">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="6-digit OTP"
                className="flex-1 border p-3 rounded"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length !== 6}
                className="bg-blue-600 text-white px-4 py-3 rounded"
              >
                {otpLoading ? "Verifying..." : "Verify"}
              </button>
            </div>

            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="mt-3 text-blue-600 font-semibold"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;
