import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NoonMealsPage() {
  let logs: any[] = [];
  try {
    logs = await prisma.noonMealLog.findMany({ orderBy: { logDate: "desc" }, take: 30 });
  } catch { }

  const totalServed = logs.reduce((s, l) => s + l.headcountServed, 0);
  const totalRice   = logs.reduce((s, l) => s + l.riceUsedKg, 0);
  const totalDal    = logs.reduce((s, l) => s + l.dalUsedKg, 0);
  const avgHeadcount = logs.length ? Math.round(totalServed / logs.length) : 0;

  return (
    <div>
      <div className="topbar">
        <h1>Noon Meals Records</h1>
        <Link href="/noon-meals/new" className="btn btn-primary">+ Record Today's Meal</Link>
      </div>
      <div className="page-body">
        <div className="stats-row">
          <div className="stat-box">
            <div className="label">Total Days Logged</div>
            <div className="value">{logs.length}</div>
          </div>
          <div className="stat-box">
            <div className="label">Avg Daily Headcount</div>
            <div className="value">{avgHeadcount}</div>
          </div>
          <div className="stat-box">
            <div className="label">Total Rice Used</div>
            <div className="value">{totalRice.toFixed(1)} kg</div>
          </div>
          <div className="stat-box">
            <div className="label">Total Dal Used</div>
            <div className="value">{totalDal.toFixed(1)} kg</div>
          </div>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Headcount</th><th>Rice (kg)</th><th>Dal (kg)</th>
                <th>Vegetables (kg)</th><th>Oil (L)</th><th>Eggs</th><th>Cook</th><th>Quality</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No meal records. <Link href="/noon-meals/new">Record today's meal →</Link>
                </td></tr>
              ) : logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{new Date(l.logDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontWeight: 700 }}>{l.headcountServed}</td>
                  <td>{l.riceUsedKg}</td>
                  <td>{l.dalUsedKg}</td>
                  <td>{l.vegetablesUsedKg}</td>
                  <td>{l.oilUsedLiters}</td>
                  <td>{l.eggCount > 0 ? l.eggCount : "—"}</td>
                  <td style={{ fontSize: 12 }}>{l.cookInCharge}</td>
                  <td>
                    <span className={`badge ${l.qualityCheckPassed ? "badge-green" : "badge-red"}`}>
                      {l.qualityCheckPassed ? "Passed" : "Failed"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "#64748b", maxWidth: 200 }}>{l.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
