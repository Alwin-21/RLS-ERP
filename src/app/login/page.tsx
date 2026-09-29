"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  School,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "teacher" | "student">("admin");
  const [username, setUsername] = useState("admin.rsl");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: "admin" | "teacher" | "student") => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setUsername("admin.rsl");
      setPassword("password123");
    } else if (selectedRole === "teacher") {
      setUsername("kousalya.maths");
      setPassword("teacher123");
    } else {
      setUsername("std.10a.101");
      setPassword("student123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Store mock user info in localStorage
      localStorage.setItem("rsl_user", JSON.stringify({ username, role }));
      router.push("/");
    }, 600);
  };

  return (
    <div className="login-container">
      {/* Background Decor */}
      <div className="login-bg-decor decor-1" />
      <div className="login-bg-decor decor-2" />

      <div className="login-card-wrapper">
        {/* Left Side Info Panel */}
        <div className="login-info-panel">
          <div className="school-emblem">
            <School size={36} color="#ffffff" />
          </div>
          <div className="school-header-text">
            <h2>RSL Govt-Aided School</h2>
            <p className="school-loc">Tamil Nadu · School Code: 3302010</p>
          </div>

          <div className="info-divider" />

          <p className="info-desc">
            Welcome to the official Management & Information Portal of RSL School. Manage attendance, marks, payroll, timetables, and heritage records.
          </p>

          <div className="feature-highlights">
            <div className="feature-item">
              <CheckCircle2 size={18} className="feat-icon" />
              <span>Real-time Staff & Student Attendance</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={18} className="feat-icon" />
              <span>Subject Mark Analysis & Slip Tests</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={18} className="feat-icon" />
              <span>Noon Meal Scheme & Library Audit</span>
            </div>
          </div>

          <div className="info-footer-badge">
            <Award size={16} />
            <span>Govt-Aided Excellence in Education</span>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="login-form-panel">
          <div className="form-header">
            <h3>Sign in to your account</h3>
            <p>Select your portal role to continue</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${role === "admin" ? "active" : ""}`}
              onClick={() => handleRoleSelect("admin")}
            >
              <ShieldCheck size={16} />
              <span>Principal / Admin</span>
            </button>
            <button
              type="button"
              className={`role-tab ${role === "teacher" ? "active" : ""}`}
              onClick={() => handleRoleSelect("teacher")}
            >
              <User size={16} />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              className={`role-tab ${role === "student" ? "active" : ""}`}
              onClick={() => handleRoleSelect("student")}
            >
              <BookOpen size={16} />
              <span>Student / Parent</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                {role === "admin" ? "Admin User ID / Username" : role === "teacher" ? "Teacher Staff Code / Email" : "Student Roll No / EMIS ID"}
              </label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your login ID"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-actions-row">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember login session</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contact RSL Admin Office to reset credentials."); }} className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="demo-fill-box">
            <span className="demo-title">Quick Demo Login:</span>
            <div className="demo-btns">
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleRoleSelect("admin")}
              >
                Admin (HM)
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleRoleSelect("teacher")}
              >
                Teacher (Maths)
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleRoleSelect("student")}
              >
                Student (Std 10)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
