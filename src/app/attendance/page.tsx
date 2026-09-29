import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AttendancePage() {
  let teachers: any[] = [];
  let records: any[] = [];
  const today = new Date();
  today.setHours(0,0,0,0);

  try {
    teachers = await prisma.teacher.findMany({ where: { isActive: true }, orderBy: { teacherCode: "asc" } });
    records  = await prisma.staffAttendance.findMany({
      where: { attendanceDate: { gte: today } },
      include: { teacher: { select: { fullName: true, teacherCode: true } } },
    });
  } catch { }

  const markedIds = new Set(records.map((r: any) => r.teacherId));

  return (
    <div>
      <div className="topbar">
        <h1>Staff Attendance – {today.toLocaleDateString("en-IN", { dateStyle: "full" })}</h1>
        <Link href="/attendance/mark" className="btn btn-primary">Mark Today's Attendance</Link>
      </div>
      <div className="page-body">
        {records.length > 0 && (
          <div className="card">
            <div className="card-title">Today's Attendance Summary</div>
            <table>
              <thead>
                <tr>
                  <th>Code</th><th>Teacher Name</th><th>Status</th><th>Check-in Time</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.teacher.teacherCode}</td>
                    <td style={{ fontWeight: 600 }}>{r.teacher.fullName}</td>
                    <td>
                      <span className={`badge ${
                        r.status === "present" ? "badge-green" :
                        r.status === "late" ? "badge-yellow" :
                        r.status === "on_leave" ? "badge-blue" : "badge-red"
                      }`}>{r.status}</span>
                    </td>
                    <td>{r.checkInTime || "—"}</td>
                    <td>{r.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card">
          <div className="card-title">All Staff – Attendance Status</div>
          <table>
            <thead>
              <tr><th>Code</th><th>Teacher Name</th><th>Today's Status</th></tr>
            </thead>
            <tbody>
              {teachers.map((t: any) => (
                <tr key={t.id}>
                  <td>{t.teacherCode}</td>
                  <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                  <td>
                    {markedIds.has(t.id)
                      ? <span className="badge badge-green">Marked</span>
                      : <span className="badge badge-yellow">Not Marked</span>
                    }
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Add teachers first from the <Link href="/teachers">Teacher directory</Link>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
