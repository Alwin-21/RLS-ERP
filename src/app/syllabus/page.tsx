import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SyllabusPage() {
  let items: any[] = [];
  try {
    items = await prisma.syllabusUpload.findMany({
      orderBy: [{ standard: "asc" }, { subjectName: "asc" }],
    });
  } catch { }

  return (
    <div>
      <div className="topbar">
        <h1>Syllabus Upload &amp; Progress</h1>
        <Link href="/syllabus/new" className="btn btn-primary">+ Upload Syllabus</Link>
      </div>
      <div className="page-body">
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Std</th><th>Subject</th><th>Term</th><th>Title</th>
                <th>Chapters Done / Total</th><th>Progress</th><th>Updated</th><th>File</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No syllabus uploaded. <Link href="/syllabus/new">Upload first syllabus →</Link>
                </td></tr>
              ) : items.map((s) => {
                const pct = Math.round((s.completedChapters / s.totalChapters) * 100);
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.standard}</td>
                    <td>{s.subjectName}</td>
                    <td><span className="badge badge-blue">{s.term}</span></td>
                    <td style={{ maxWidth: 200, fontSize: 12 }}>{s.title}</td>
                    <td>{s.completedChapters} / {s.totalChapters}</td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "#16a34a" : "#4f46e5" }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(s.updatedAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      {s.fileUrl
                        ? <a href={s.fileUrl} className="btn btn-secondary btn-sm">Download</a>
                        : <span style={{ color: "#94a3b8", fontSize: 12 }}>No file</span>
                      }
                    </td>
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
