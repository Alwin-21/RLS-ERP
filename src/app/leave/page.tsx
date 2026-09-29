import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LeavePage() {
  let leaves: any[] = [];
  try {
    leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { teacher: { select: { fullName: true, teacherCode: true } } },
    });
  } catch { }

  const pending  = leaves.filter((l) => l.status === "pending");
  const approved = leaves.filter((l) => l.status === "approved");
  const rejected = leaves.filter((l) => l.status === "rejected");

  return (
    <div>
      <div className="topbar">
        <h1>Medical &amp; Casual Leave</h1>
        <Link href="/leave/new" className="btn btn-primary">+ Apply Leave</Link>
      </div>
      <div className="page-body">
        <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-box">
            <div className="label">Pending</div>
            <div className="value" style={{ color: "#ca8a04" }}>{pending.length}</div>
          </div>
          <div className="stat-box">
            <div className="label">Approved</div>
            <div className="value" style={{ color: "#16a34a" }}>{approved.length}</div>
          </div>
          <div className="stat-box">
            <div className="label">Rejected</div>
            <div className="value" style={{ color: "#dc2626" }}>{rejected.length}</div>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="card">
            <div className="card-title">⏳ Pending Approval ({pending.length})</div>
            <LeaveTable rows={pending} showActions />
          </div>
        )}

        <div className="card">
          <div className="card-title">All Leave Requests</div>
          <LeaveTable rows={leaves} showActions={false} />
        </div>
      </div>
    </div>
  );
}

function LeaveTable({ rows, showActions }: { rows: any[]; showActions: boolean }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Teacher</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={8} style={{ textAlign: "center", color: "#94a3b8" }}>No records</td></tr>
        ) : rows.map((l) => (
          <tr key={l.id}>
            <td style={{ fontWeight: 600 }}>{l.teacher?.fullName || l.teacherName}</td>
            <td><span className={`badge ${l.leaveType === "medical" ? "badge-red" : "badge-blue"}`}>{l.leaveType}</span></td>
            <td>{new Date(l.startDate).toLocaleDateString("en-IN")}</td>
            <td>{new Date(l.endDate).toLocaleDateString("en-IN")}</td>
            <td>{l.totalDays}</td>
            <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
            <td><span className={`badge ${l.status === "approved" ? "badge-green" : l.status === "rejected" ? "badge-red" : "badge-yellow"}`}>{l.status}</span></td>
            {showActions && (
              <td style={{ display: "flex", gap: 4 }}>
                <form action={`/api/leave/${l.id}/approve`} method="POST">
                  <button type="submit" className="btn btn-success btn-sm">Approve</button>
                </form>
                <form action={`/api/leave/${l.id}/reject`} method="POST">
                  <button type="submit" className="btn btn-danger btn-sm">Reject</button>
                </form>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
