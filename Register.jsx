import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const MOCK_OTP = "123456";

const COLLEGE_SUGGESTIONS = [
  "IIT Bombay","IIT Delhi","IIT Madras","NIT Trichy","Delhi University",
  "Anna University","BITS Pilani","VIT University","SRM University",
  "Manipal Institute of Technology","Christ University","RV College of Engineering",
  "PES University","KIIT University","Amrita University"
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    role: "student"
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".college-autocomplete")) {
        setShowCollegeSuggestions(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* 🎈 Celebration */
  const launchBalloons = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const playWelcomeSound = () => {
    const audio = new Audio("/sounds/balloon-pop.mp3");
    audio.play();
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain uppercase letter";
    if (!/[a-z]/.test(password)) return "Must contain lowercase letter";
    if (!/\d/.test(password)) return "Must contain number";
    if (!/[!@#$%^&*]/.test(password)) return "Must contain special character";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setError("");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const pwdError = validatePassword(formData.password);
    if (pwdError) return setError(pwdError);

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp !== MOCK_OTP) {
      setOtpError("Invalid OTP (use 123456)");
      return;
    }

    launchBalloons();
    playWelcomeSound();

    setTimeout(() => navigate("/login"), 1500);
  };

  const handleCollegeSearch = (value) => {
    setFormData(p => ({ ...p, college: value }));
    if (!value) return setShowCollegeSuggestions(false);

    setFilteredColleges(
      COLLEGE_SUGGESTIONS.filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowCollegeSuggestions(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold text-center mb-4">
          Register
        </h1>

        {error && (
          <p className="text-red-600 mb-3 text-sm">{error}</p>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            disabled={otpSent}
            className="w-full border p-2 rounded"
            required
          />

          <div className="relative college-autocomplete">
            <input
              placeholder="College"
              value={formData.college}
              onChange={(e) => handleCollegeSearch(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            {showCollegeSuggestions && (
              <div className="absolute w-full bg-white border mt-1 z-10">
                {filteredColleges.map(c => (
                  <div
                    key={c}
                    onClick={() => setFormData(p => ({ ...p, college: c }))}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <button
            disabled={otpSent}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {otpSent ? "OTP Sent" : "Register"}
          </button>
        </form>

        {otpSent && (
          <div className="mt-5 border-t pt-4">
            <h2 className="font-semibold mb-2">Verify Email</h2>

            <p className="text-sm mb-2">OTP: <b>123456</b></p>

            {otpError && (
              <p className="text-red-600 text-sm mb-2">{otpError}</p>
            )}

            <div className="flex gap-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
                className="flex-1 border p-2 rounded"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-green-600 text-white px-4 rounded"
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
