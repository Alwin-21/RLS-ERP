import { prisma } from "@/lib/prisma";

export default async function TimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ std?: string; div?: string }>;
}) {
  const { std = "8", div = "A" } = await searchParams;
  let slots: any[] = [];

  try {
    slots = await prisma.timetable.findMany({
      where: { standard: std, division: div },
      include: { teacher: { select: { fullName: true } } },
      orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
    });
  } catch { }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { no: 1, time: "9:00–9:45" },
    { no: 2, time: "9:45–10:30" },
    { no: 3, time: "10:45–11:30" },
    { no: 4, time: "11:30–12:15" },
    { no: 5, time: "1:00–1:45" },
    { no: 6, time: "1:45–2:30" },
    { no: 7, time: "2:40–3:25" },
    { no: 8, time: "3:25–4:10" },
  ];

  const grid: Record<string, Record<number, any>> = {};
  for (const s of slots) {
    if (!grid[s.dayOfWeek]) grid[s.dayOfWeek] = {};
    grid[s.dayOfWeek][s.periodNumber] = s;
  }

  return (
    <div>
      <div className="topbar">
        <h1>Timetable – Std {std}-{div}</h1>
      </div>
      <div className="page-body">
        <div className="filter-bar">
          {["6","7","8","9","10"].map((s) => (
            <a key={s} href={`/timetable?std=${s}&div=${div}`}
              className={`btn btn-sm ${std === s ? "btn-primary" : "btn-secondary"}`}>Std {s}</a>
          ))}
          {["A","B"].map((d) => (
            <a key={d} href={`/timetable?std=${std}&div=${d}`}
              className={`btn btn-sm ${div === d ? "btn-primary" : "btn-secondary"}`}>{d}</a>
          ))}
        </div>

        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Day</th>
                {periods.map((p) => (
                  <th key={p.no} style={{ textAlign: "center", minWidth: 90 }}>
                    P{p.no}<br />
                    <span style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8" }}>{p.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td style={{ fontWeight: 700, color: "#1e293b", background: "#f8fafc" }}>{day}</td>
                  {periods.map((p) => {
                    const slot = grid[day]?.[p.no];
                    return (
                      <td key={p.no} style={{ textAlign: "center", fontSize: 12 }}>
                        {slot ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{slot.subjectName}</div>
                            {slot.teacher && (
                              <div style={{ color: "#64748b", fontSize: 11 }}>{slot.teacher.fullName.split(" ").slice(-1)[0]}</div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#e2e8f0" }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {slots.length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>
              No timetable configured for Std {std}-{div}. Add via the database or API.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
