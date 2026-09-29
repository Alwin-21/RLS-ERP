import { prisma } from "@/lib/prisma";
import Link from "next/link";

const demoTeachers = [
  {
    id: "1",
    teacherCode: "T-101",
    fullName: "S. Kousalya",
    designation: "PG Assistant",
    assignedSubject: "Mathematics",
    classTeacherFor: "Std 10-A",
    phone: "+91 98401 23456",
    joiningDate: "2015-06-01",
    isActive: true,
  },
  {
    id: "2",
    teacherCode: "T-102",
    fullName: "M. Ramanathan",
    designation: "PG Assistant",
    assignedSubject: "Physics",
    classTeacherFor: "Std 12-B",
    phone: "+91 98402 34567",
    joiningDate: "2012-08-15",
    isActive: true,
  },
  {
    id: "3",
    teacherCode: "T-103",
    fullName: "P. Meenakshi",
    designation: "BT Assistant",
    assignedSubject: "Tamil",
    classTeacherFor: "Std 9-A",
    phone: "+91 98403 45678",
    joiningDate: "2018-06-10",
    isActive: true,
  },
  {
    id: "4",
    teacherCode: "T-104",
    fullName: "K. Vijaykumar",
    designation: "BT Assistant",
    assignedSubject: "English",
    classTeacherFor: "Std 8-C",
    phone: "+91 98404 56789",
    joiningDate: "2019-07-20",
    isActive: true,
  },
  {
    id: "5",
    teacherCode: "T-105",
    fullName: "A. Selvi",
    designation: "Physical Education Director",
    assignedSubject: "Sports / PET",
    classTeacherFor: "—",
    phone: "+91 98405 67890",
    joiningDate: "2016-09-01",
    isActive: true,
  },
];

export default async function TeachersPage() {
  let teachers: any[] = [];
  try {
    teachers = await prisma.teacher.findMany({ orderBy: { teacherCode: "asc" } });
  } catch {}

  const displayList = teachers.length > 0 ? teachers : demoTeachers;

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Teacher & Staff Directory</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Manage RSL School teaching staff, subject assignments & class teachers
          </p>
        </div>
        <Link href="/teachers/new" className="btn btn-primary">
          + Add New Teacher
        </Link>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>All Registered Staff ({displayList.length})</span>
            {teachers.length === 0 && (
              <span className="badge badge-amber">Showing Demo Data (Connect PostgreSQL to persist)</span>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Full Name</th>
                <th>Designation</th>
                <th>Assigned Subject</th>
                <th>Class Teacher</th>
                <th>Contact Phone</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="badge badge-blue">{t.teacherCode}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{t.fullName}</td>
                  <td>{t.designation}</td>
                  <td>
                    <span className="badge badge-purple" style={{ background: "#f3e8ff", color: "#6b21a8" }}>
                      {t.assignedSubject}
                    </span>
                  </td>
                  <td>{t.classTeacherFor || "—"}</td>
                  <td>{t.phone}</td>
                  <td>{new Date(t.joiningDate).toLocaleDateString("en-IN")}</td>
                  <td>
                    <span className={`badge ${t.isActive ? "badge-emerald" : "badge-rose"}`}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
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
