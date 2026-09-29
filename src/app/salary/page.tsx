import { prisma } from "@/lib/prisma";

export default async function SalaryPage() {
  let teachers: any[] = [];
  try {
    teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { teacherCode: "asc" },
    });
  } catch { }

  const totalPayroll = teachers.reduce((s, t) => s + (t.basicSalary - t.pfDeduction + t.allowances), 0);

  return (
    <div>
      <div className="topbar">
        <h1>Teacher Salary Records</h1>
        <span style={{ fontSize: 13, color: "#64748b" }}>
          Total Monthly Payroll: ₹{totalPayroll.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="page-body">
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Teacher Name</th>
                <th>Designation</th>
                <th>Basic Salary</th>
                <th>PF Deduction (12%)</th>
                <th>Allowances</th>
                <th>Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>No teachers found</td></tr>
              ) : teachers.map((t) => {
                const net = t.basicSalary - t.pfDeduction + t.allowances;
                return (
                  <tr key={t.id}>
                    <td>{t.teacherCode}</td>
                    <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{t.designation}</td>
                    <td>₹{t.basicSalary.toLocaleString("en-IN")}</td>
                    <td style={{ color: "#dc2626" }}>-₹{t.pfDeduction.toLocaleString("en-IN")}</td>
                    <td style={{ color: "#16a34a" }}>+₹{t.allowances.toLocaleString("en-IN")}</td>
                    <td style={{ fontWeight: 700 }}>₹{net.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
            {teachers.length > 0 && (
              <tfoot>
                <tr style={{ background: "#f8fafc" }}>
                  <td colSpan={6} style={{ fontWeight: 700, textAlign: "right", padding: "10px 12px" }}>Total Monthly Payroll</td>
                  <td style={{ fontWeight: 700, padding: "10px 12px" }}>₹{totalPayroll.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
