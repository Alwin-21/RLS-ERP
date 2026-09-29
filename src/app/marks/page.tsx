import { prisma } from "@/lib/prisma";
import Link from "next/link";

const subjects = ["Mathematics", "Science", "Tamil", "English", "Social Studies"];
const examTypes = ["Slip Test 1", "Slip Test 2", "Mid-Term Exam", "Annual Exam"];

const demoMarks = [
  {
    id: "m1",
    student: { rollNo: "101", fullName: "R. Vignesh" },
    subjectName: "Mathematics",
    examType: "Slip Test 1",
    marksObtained: 23,
    maxMarks: 25,
    examDate: "2026-09-10",
    remarks: "Excellent problem solving",
  },
  {
    id: "m2",
    student: { rollNo: "102", fullName: "S. Priya" },
    subjectName: "Mathematics",
    examType: "Slip Test 1",
    marksObtained: 25,
    maxMarks: 25,
    examDate: "2026-09-10",
    remarks: "Full Marks!",
  },
  {
    id: "m3",
    student: { rollNo: "103", fullName: "K. Karthik" },
    subjectName: "Science",
    examType: "Slip Test 1",
    marksObtained: 20,
    maxMarks: 25,
    examDate: "2026-09-11",
    remarks: "Good diagram work",
  },
  {
    id: "m4",
    student: { rollNo: "104", fullName: "M. Anitha" },
    subjectName: "Tamil",
    examType: "Slip Test 1",
    marksObtained: 24,
    maxMarks: 25,
    examDate: "2026-09-08",
    remarks: "Great handwriting & grammar",
  },
  {
    id: "m5",
    student: { rollNo: "105", fullName: "V. Surya" },
    subjectName: "English",
    examType: "Slip Test 1",
    marksObtained: 19,
    maxMarks: 25,
    examDate: "2026-09-09",
    remarks: "Needs practice in vocabulary",
  },
];

export default async function MarksPage({
  searchParams,
}: {
  searchParams: Promise<{ std?: string; div?: string; subject?: string; exam?: string; studentId?: string }>;
}) {
  const { std = "8", div = "A", subject = "", exam = "", studentId = "" } = await searchParams;
  let dbMarks: any[] = [];

  try {
    dbMarks = await prisma.markRegister.findMany({
      where: {
        student: { standard: std, division: div },
        ...(subject ? { subjectName: subject } : {}),
        ...(exam ? { examType: exam } : {}),
        ...(studentId ? { studentId } : {}),
      },
      include: { student: { select: { fullName: true, rollNo: true } } },
      orderBy: [{ examDate: "desc" }, { student: { rollNo: "asc" } }],
    });
  } catch {}

  const displayMarks = dbMarks.length > 0 ? dbMarks : demoMarks;

  // Calculate subject averages for all marks in this class
  const subjectStats: Record<string, { total: number; count: number }> = {};
  for (const m of displayMarks) {
    if (!subjectStats[m.subjectName]) subjectStats[m.subjectName] = { total: 0, count: 0 };
    subjectStats[m.subjectName].total += (m.marksObtained / m.maxMarks) * 100;
    subjectStats[m.subjectName].count += 1;
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Mark Register – Std {std}-{div}</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Record slip test scores, term marks & analyze subject-wise class performance
          </p>
        </div>
        <Link href={`/marks/new?std=${std}&div=${div}`} className="btn btn-primary">
          + Record New Marks
        </Link>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="filter-bar" style={{ flexWrap: "wrap", gap: 8 }}>
          <span className="filter-label">Standard:</span>
          {["6", "7", "8", "9", "10"].map((s) => (
            <Link
              key={s}
              href={`/marks?std=${s}&div=${div}`}
              className={`btn btn-sm ${std === s ? "btn-primary" : "btn-secondary"}`}
            >
              Std {s}
            </Link>
          ))}
          <span className="filter-label" style={{ marginLeft: 12 }}>Section:</span>
          {["A", "B"].map((d) => (
            <Link
              key={d}
              href={`/marks?std=${std}&div=${d}`}
              className={`btn btn-sm ${div === d ? "btn-primary" : "btn-secondary"}`}
            >
              {d}
            </Link>
          ))}
        </div>

        {/* Subject-wise averages */}
        {Object.keys(subjectStats).length > 0 && (
          <div className="card">
            <div className="card-title">Subject-wise Performance Analysis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat( auto-fit, minmax(180px, 1fr) )", gap: 16 }}>
              {Object.entries(subjectStats).map(([subj, stat]) => {
                const avg = stat.total / stat.count;
                const barColor = avg >= 80 ? "#10b981" : avg >= 65 ? "#3b82f6" : "#f59e0b";
                return (
                  <div key={subj} style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>{subj}</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${avg}%`, backgroundColor: barColor }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, color: barColor }}>
                      {avg.toFixed(1)}% Avg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Slip Test & Exam Register</span>
            {dbMarks.length === 0 && (
              <span className="badge badge-amber">Demo Data Preview</span>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Score</th>
                <th>Max Marks</th>
                <th>Percentage</th>
                <th>Exam Date</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {displayMarks.map((m) => {
                const pct = ((m.marksObtained / m.maxMarks) * 100).toFixed(1);
                const grade = Number(pct) >= 90 ? "A+" : Number(pct) >= 75 ? "A" : Number(pct) >= 60 ? "B" : Number(pct) >= 50 ? "C" : "D";
                return (
                  <tr key={m.id}>
                    <td><span className="badge badge-gray">{m.student?.rollNo}</span></td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{m.student?.fullName}</td>
                    <td><span className="badge badge-blue">{m.subjectName}</span></td>
                    <td><span className="badge badge-gray">{m.examType}</span></td>
                    <td style={{ fontWeight: 800, color: "#0f172a" }}>{m.marksObtained}</td>
                    <td>{m.maxMarks}</td>
                    <td>
                      <span className={`badge ${Number(pct) >= 75 ? "badge-emerald" : Number(pct) >= 50 ? "badge-amber" : "badge-rose"}`}>
                        {pct}% ({grade})
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(m.examDate).toLocaleDateString("en-IN")}</td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{m.remarks || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
