import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const COLLEGE_SUGGESTIONS = [
  "IIT Bombay","IIT Delhi","IIT Madras","NIT Trichy","Delhi University",
  "Anna University","BITS Pilani","VIT University","SRM University",
  "Manipal Institute of Technology","Christ University","RV College of Engineering",
  "PES University","KIIT University","Amrita University"
];

const Register = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".college-autocomplete")) {
        setShowCollegeSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      if (data.requiresVerification) {
        setOtpSent(true);
        setInfoMessage(data.message || "OTP sent to your email");
        if (data.debugOtp && import.meta.env.MODE === "development") {
          setDevOtp(data.debugOtp);
        }
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      navigate("/login");
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow">
        <h1 className="text-2xl font-bold text-center mb-5">Create Account</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" onChange={handleInputChange} required className="w-full border p-3 rounded" />
          <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full border p-3 rounded" disabled={otpSent} />

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
                  <div key={c} onClick={() => setFormData(p => ({ ...p, college: c }))} className="p-2 cursor-pointer hover:bg-blue-100">
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required className="w-full border p-3 rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} required className="w-full border p-3 rounded" />

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
            <h2 className="text-lg font-semibold mb-1">Verify Email</h2>
            <p className="text-sm text-gray-600 mb-3">Enter the 6-digit OTP sent to <span className="font-medium">{formData.email}</span> to verify your email and complete signup.</p>
            <p className="text-green-700 mb-2">{infoMessage}</p>
            {devOtp && import.meta.env.MODE === "development" && (
              <p className="text-xs text-gray-500 mb-2">Dev OTP: {devOtp}</p>
            )}
            {otpError && <p className="text-red-600 mb-3">{otpError}</p>}
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor="otp-input">OTP Code</label>
              <input
                id="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="flex-1 border p-3 rounded"
                inputMode="numeric"
                pattern="\\d{6}"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-blue-600 text-white px-4 py-3 rounded"
                disabled={otpLoading || !otp || otp.length !== 6}
              >
                {otpLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
            <button
              onClick={handleResendOtp}
              className="mt-3 text-blue-600 font-semibold"
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        )}

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
