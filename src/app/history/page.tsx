import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HistoryPage() {
  let works: any[] = [];
  let visitors: any[] = [];
  try {
    [works, visitors] = await Promise.all([
      prisma.historicalWork.findMany({ orderBy: { year: "desc" } }),
      prisma.visitorLog.findMany({ orderBy: { visitDate: "desc" } }),
    ]);
  } catch { }

  return (
    <div>
      <div className="topbar">
        <h1>RSL History &amp; Heritage</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/history/work/new" className="btn btn-secondary">+ Add Work</Link>
          <Link href="/history/visitor/new" className="btn btn-primary">+ Record Visitor</Link>
        </div>
      </div>
      <div className="page-body">
        {/* School Info Banner */}
        <div className="card" style={{ background: "#f8fafc", borderLeft: "4px solid #4f46e5" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>RSL Government-Aided School</div>
          <div style={{ fontSize: 13, color: "#374151" }}>
            Established: 1974 &nbsp;|&nbsp; School Code: 3302010 &nbsp;|&nbsp; Type: Govt-Aided &nbsp;|&nbsp; Board: Tamil Nadu State Board &nbsp;|&nbsp; Classes: Std 6–10
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            History is important. This page archives all institutional contributions, college collaboration works, and visitor records at RSL School.
          </div>
        </div>

        {/* Works by colleges */}
        <div className="card">
          <div className="toolbar">
            <div className="card-title" style={{ margin: 0, border: 0 }}>
              Institutional Works &amp; College Collaborations ({works.length})
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Year</th><th>Title</th><th>Type</th><th>Institution</th><th>Description</th><th>Link</th>
              </tr>
            </thead>
            <tbody>
              {works.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No works recorded. <Link href="/history/work/new">Add the first one →</Link>
                </td></tr>
              ) : works.map((w) => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 700 }}>{w.year}</td>
                  <td style={{ fontWeight: 600 }}>{w.title}</td>
                  <td><span className="badge badge-blue">{w.contributorType}</span></td>
                  <td>{w.institutionName}</td>
                  <td style={{ fontSize: 12, color: "#64748b", maxWidth: 240 }}>{w.description}</td>
                  <td>
                    {w.projectUrl
                      ? <a href={w.projectUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View →</a>
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visitor Logbook */}
        <div className="card">
          <div className="card-title">Visitor &amp; College Volunteer Logbook ({visitors.length})</div>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Visitor Name</th><th>Organization</th><th>Purpose</th><th>Phone</th><th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No visitors recorded. <Link href="/history/visitor/new">Record first visitor →</Link>
                </td></tr>
              ) : visitors.map((v) => (
                <tr key={v.id}>
                  <td>{new Date(v.visitDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontWeight: 600 }}>{v.visitorName}</td>
                  <td>{v.organization}</td>
                  <td>{v.purpose}</td>
                  <td style={{ fontSize: 12 }}>{v.contactNumber}</td>
                  <td style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>{v.feedback || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
