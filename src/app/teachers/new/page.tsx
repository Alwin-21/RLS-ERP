"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    teacherCode: "", fullName: "", email: "", phone: "",
    qualification: "", designation: "Graduate Teacher",
    assignedSubject: "Mathematics", classTeacherFor: "",
    basicSalary: "35000", joiningDate: new Date().toISOString().split("T")[0],
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/teachers");
    router.refresh();
  }

  return (
    <div>
      <div className="topbar">
        <h1>Add New Teacher</h1>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 640 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teacher Code</label>
                <input className="form-input" placeholder="TCH001" value={form.teacherCode} onChange={(e) => set("teacherCode", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Dr. K. Arumugam" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input className="form-input" placeholder="M.Sc., B.Ed." value={form.qualification} onChange={(e) => set("qualification", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <select className="form-input" value={form.designation} onChange={(e) => set("designation", e.target.value)}>
                  <option>Headmaster / Sr. Teacher</option>
                  <option>Post Graduate Teacher</option>
                  <option>Graduate Teacher</option>
                  <option>Secondary Grade Teacher</option>
                  <option>Physical Director</option>
                  <option>Librarian</option>
                  <option>Lab Assistant</option>
                  <option>Craft & Art Teacher</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Subject</label>
                <select className="form-input" value={form.assignedSubject} onChange={(e) => set("assignedSubject", e.target.value)}>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>Tamil</option>
                  <option>English</option>
                  <option>Social Studies</option>
                  <option>Computer Studies</option>
                  <option>Physical Education</option>
                  <option>Library Science</option>
                  <option>Arts &amp; Craft</option>
                  <option>Science Practical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class Teacher For (optional)</label>
                <input className="form-input" placeholder="e.g. 8-A" value={form.classTeacherFor} onChange={(e) => set("classTeacherFor", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Basic Salary (₹)</label>
                <input className="form-input" type="number" value={form.basicSalary} onChange={(e) => set("basicSalary", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input className="form-input" type="date" value={form.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} required />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Teacher"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
