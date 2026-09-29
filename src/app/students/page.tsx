import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ std?: string; div?: string }>;
}) {
  const { std = "8", div = "A" } = await searchParams;
  let students: any[] = [];

  try {
    students = await prisma.student.findMany({
      where: { standard: std, division: div },
      orderBy: { rollNo: "asc" },
    });
  } catch { }

  const standards = ["6", "7", "8", "9", "10"];
  const divisions = ["A", "B"];

  return (
    <div>
      <div className="topbar">
        <h1>Student Register – Std {std} '{div}'</h1>
        <Link href={`/students/new?std=${std}&div=${div}`} className="btn btn-primary">+ Add Student</Link>
      </div>
      <div className="page-body">
        {/* Class Selector */}
        <div className="filter-bar">
          <span className="filter-label">Standard:</span>
          {standards.map((s) => (
            <Link key={s} href={`/students?std=${s}&div=${div}`}
              className={`btn btn-sm ${std === s ? "btn-primary" : "btn-secondary"}`}>
              Std {s}
            </Link>
          ))}
          <span className="filter-label" style={{ marginLeft: 12 }}>Division:</span>
          {divisions.map((d) => (
            <Link key={d} href={`/students?std=${std}&div=${d}`}
              className={`btn btn-sm ${div === d ? "btn-primary" : "btn-secondary"}`}>
              {d}
            </Link>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>
            {students.length} student{students.length !== 1 ? "s" : ""} in Std {std}-{div}
          </span>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Roll No</th><th>Student Name</th><th>Gender</th><th>Date of Birth</th>
                <th>Parent Name</th><th>Parent Phone</th><th>Address</th><th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No students in Std {std}-{div}. <Link href={`/students/new?std=${std}&div=${div}`}>Add a student →</Link>
                </td></tr>
              ) : students.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.rollNo}</td>
                  <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                  <td>{s.gender}</td>
                  <td>{new Date(s.dob).toLocaleDateString("en-IN")}</td>
                  <td>{s.parentName}</td>
                  <td>{s.parentPhone}</td>
                  <td style={{ fontSize: 12 }}>{s.address || "—"}</td>
                  <td>
                    <Link href={`/marks?studentId=${s.id}`} className="btn btn-secondary btn-sm">
                      View Marks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
