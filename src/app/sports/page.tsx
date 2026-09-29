import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SportsPage() {
  let items: any[] = [];
  try {
    items = await prisma.sportsInventory.findMany({ orderBy: { itemCode: "asc" } });
  } catch { }

  return (
    <div>
      <div className="topbar">
        <h1>Sports Equipment Inventory</h1>
        <Link href="/sports/new" className="btn btn-primary">+ Add Equipment</Link>
      </div>
      <div className="page-body">
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Item Code</th><th>Equipment Name</th><th>Category</th>
                <th>Total Qty</th><th>Available</th><th>Damaged</th><th>Condition</th><th>Last Inspection</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No equipment recorded. <Link href="/sports/new">Add equipment →</Link>
                </td></tr>
              ) : items.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 600 }}>{i.itemCode}</td>
                  <td>{i.itemName}</td>
                  <td><span className="badge badge-gray">{i.category}</span></td>
                  <td style={{ fontWeight: 700 }}>{i.totalQuantity}</td>
                  <td style={{ color: "#16a34a", fontWeight: 600 }}>{i.availableQuantity}</td>
                  <td style={{ color: i.damagedQuantity > 0 ? "#dc2626" : "#374151" }}>{i.damagedQuantity}</td>
                  <td>
                    <span className={`badge ${
                      i.condition === "good" ? "badge-green" :
                      i.condition === "fair" ? "badge-yellow" : "badge-red"
                    }`}>{i.condition}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(i.lastInspected).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
