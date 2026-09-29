import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LibraryPage() {
  let books: any[] = [];
  const today = new Date();

  try {
    books = await prisma.libraryRecord.findMany({
      orderBy: { accessionNo: "asc" },
      include: { borrower: { select: { fullName: true, rollNo: true, standard: true, division: true } } },
    });
  } catch { }

  const available = books.filter((b) => b.status === "available").length;
  const issued    = books.filter((b) => b.status === "issued").length;
  const overdue   = books.filter((b) => b.status === "issued" && b.dueDate && new Date(b.dueDate) < today).length;

  return (
    <div>
      <div className="topbar">
        <h1>Library Records</h1>
        <Link href="/library/new" className="btn btn-primary">+ Catalog Book</Link>
      </div>
      <div className="page-body">
        <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-box"><div className="label">Available Books</div><div className="value" style={{ color: "#16a34a" }}>{available}</div></div>
          <div className="stat-box"><div className="label">Issued Books</div><div className="value" style={{ color: "#ca8a04" }}>{issued}</div></div>
          <div className="stat-box"><div className="label">Overdue Returns</div><div className="value" style={{ color: "#dc2626" }}>{overdue}</div></div>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Accession No</th><th>Title</th><th>Author</th><th>Category</th>
                <th>Status</th><th>Borrower</th><th>Due Date</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  No books cataloged. <Link href="/library/new">Add first book →</Link>
                </td></tr>
              ) : books.map((b) => {
                const isOverdue = b.status === "issued" && b.dueDate && new Date(b.dueDate) < today;
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.accessionNo}</td>
                    <td>{b.bookTitle}</td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{b.author}</td>
                    <td><span className="badge badge-gray">{b.category}</span></td>
                    <td>
                      {isOverdue
                        ? <span className="badge badge-red">⚠ Overdue</span>
                        : <span className={`badge ${b.status === "available" ? "badge-green" : "badge-yellow"}`}>{b.status}</span>
                      }
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {b.borrower ? `${b.borrower.fullName} (${b.borrower.standard}-${b.borrower.division})` : "—"}
                    </td>
                    <td style={{ fontSize: 12, color: isOverdue ? "#dc2626" : "#374151" }}>
                      {b.dueDate ? new Date(b.dueDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td>
                      {b.status === "available"
                        ? <Link href={`/library/${b.id}/issue`} className="btn btn-secondary btn-sm">Issue</Link>
                        : <form action={`/api/library/${b.id}/return`} method="POST">
                            <button className="btn btn-success btn-sm">Return</button>
                          </form>
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
