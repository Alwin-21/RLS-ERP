"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewLeavePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    teacherId: "", leaveType: "medical", startDate: "", endDate: "", totalDays: "1", reason: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/leave");
    router.refresh();
  }

  return (
    <div>
      <div className="topbar"><h1>Apply Leave Request</h1></div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 520 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Teacher ID (get from Teacher directory)</label>
              <input className="form-input" value={form.teacherId} onChange={(e) => set("teacherId", e.target.value)} placeholder="UUID from /api/teachers" required />
            </div>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="form-input" value={form.leaveType} onChange={(e) => set("leaveType", e.target.value)}>
                <option value="medical">Medical Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="special">Special Leave</option>
              </select>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Total Days</label>
              <input className="form-input" type="number" min="1" value={form.totalDays} onChange={(e) => set("totalDays", e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Leave</label>
              <textarea className="form-input" rows={3} value={form.reason} onChange={(e) => set("reason", e.target.value)} required />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit Leave Request"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
