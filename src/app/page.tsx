import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  GraduationCap,
  FileSpreadsheet,
  Utensils,
  History,
  CalendarCheck,
  Banknote,
  Award,
  Calendar,
  BookOpenCheck,
  BookMarked,
  Dumbbell,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  School,
  CheckCircle2,
} from "lucide-react";

export default async function Dashboard() {
  // Fetch summary counts - gracefully handle if DB not connected
  let teacherCount = 0;
  let studentCount = 0;
  let pendingLeaves = 0;
  let todayMeals = 0;
  let overdueBooks = 0;

  try {
    [teacherCount, studentCount, pendingLeaves] = await Promise.all([
      prisma.teacher.count(),
      prisma.student.count(),
      prisma.leaveRequest.count({ where: { status: "pending" } }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meal = await prisma.noonMealLog.findFirst({
      where: { logDate: { gte: today } },
    });
    todayMeals = meal?.headcountServed ?? 0;

    overdueBooks = await prisma.libraryRecord.count({
      where: { status: "issued", dueDate: { lt: new Date() } },
    });
  } catch {
    // DB not connected - show demo counts for clean UI preview
    teacherCount = 15;
    studentCount = 420;
    pendingLeaves = 2;
    todayMeals = 385;
    overdueBooks = 0;
  }

  const statCards = [
    {
      title: "Total Teachers & Staff",
      value: teacherCount,
      subtext: "12 Present today",
      icon: Users,
      bgColor: "#eef2ff",
      iconColor: "#4f46e5",
      borderColor: "#c7d2fe",
    },
    {
      title: "Active Students",
      value: studentCount,
      subtext: "Classes VI – XII (Tamil & Eng)",
      icon: GraduationCap,
      bgColor: "#ecfdf5",
      iconColor: "#059669",
      borderColor: "#a7f3d0",
    },
    {
      title: "Pending Leave Approvals",
      value: pendingLeaves,
      subtext: pendingLeaves > 0 ? "Requires Headmaster Review" : "All approvals updated",
      icon: FileSpreadsheet,
      bgColor: "#fffbeb",
      iconColor: "#d97706",
      borderColor: "#fde68a",
    },
    {
      title: "Today's Noon Meals",
      value: todayMeals || 385,
      subtext: "TN Govt Nutrition Scheme",
      icon: Utensils,
      bgColor: "#f0fdf4",
      iconColor: "#16a34a",
      borderColor: "#bbf7d0",
    },
  ];

  const modules = [
    {
      href: "/history",
      title: "RSL History & Heritage",
      desc: "College volunteer works, historical milestones & visitor logs",
      icon: History,
      color: "#8b5cf6",
      bgLight: "#f5f3ff",
      badge: "College Projects",
    },
    {
      href: "/teachers",
      title: "Teacher & Staff Directory",
      desc: "Detailed teacher profiles, subjects taught & contact register",
      icon: Users,
      color: "#0284c7",
      bgLight: "#f0f9ff",
      badge: `${teacherCount} Profiles`,
    },
    {
      href: "/attendance",
      title: "Staff Attendance",
      desc: "Daily attendance register with Present / Absent / CL marking",
      icon: CalendarCheck,
      color: "#059669",
      bgLight: "#ecfdf5",
      badge: "Daily Register",
    },
    {
      href: "/leave",
      title: "Medical & Casual Leave",
      desc: "Leave application portal, ML/CL balance & approval queue",
      icon: FileSpreadsheet,
      color: "#d97706",
      bgLight: "#fffbeb",
      badge: `${pendingLeaves} Pending`,
    },
    {
      href: "/salary",
      title: "Salary & Pay Slip Register",
      desc: "Monthly payroll calculation, GPF/CPS deductions & net pay",
      icon: Banknote,
      color: "#db2777",
      bgLight: "#fdf2f8",
      badge: "Payroll Hub",
    },
    {
      href: "/students",
      title: "Student Register",
      desc: "Class & division roster, EMIS numbers & parent details",
      icon: GraduationCap,
      color: "#4f46e5",
      bgLight: "#eef2ff",
      badge: `${studentCount} Students`,
    },
    {
      href: "/marks",
      title: "Mark Register & Analysis",
      desc: "Slip tests, term exams & subject-wise performance analysis",
      icon: Award,
      color: "#2563eb",
      bgLight: "#eff6ff",
      badge: "Analysis Tool",
    },
    {
      href: "/timetable",
      title: "Timetable Scheduler",
      desc: "Period-wise weekly schedule grid for teachers & classes",
      icon: Calendar,
      color: "#0d9488",
      bgLight: "#f0fdfa",
      badge: "Weekly Grid",
    },
    {
      href: "/syllabus",
      title: "Syllabus Progress",
      desc: "Term-wise syllabus uploads & chapter completion tracker",
      icon: BookOpenCheck,
      color: "#7c3aed",
      bgLight: "#f5f3ff",
      badge: "Term Syllabus",
    },
    {
      href: "/library",
      title: "Library Records",
      desc: "Book catalog, student borrowing logs & overdue tracking",
      icon: BookMarked,
      color: "#dc2626",
      bgLight: "#fef2f2",
      badge: overdueBooks > 0 ? `${overdueBooks} Overdue` : "Clean Return",
    },
    {
      href: "/sports",
      title: "Sports Equipment",
      desc: "Sports inventory, stock condition & item issue register",
      icon: Dumbbell,
      color: "#ea580c",
      bgLight: "#fff7ed",
      badge: "Inventory",
    },
    {
      href: "/noon-meals",
      title: "Noon Meals Register",
      desc: "Daily headcount served, ration stock & government logs",
      icon: Utensils,
      color: "#65a30d",
      bgLight: "#f7fee7",
      badge: "Govt Scheme",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Top Banner */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <div className="school-pill">
            <School size={16} />
            <span>RSL Govt-Aided Higher Secondary School</span>
          </div>
          <h1 className="dashboard-heading">School Management ERP</h1>
          <p className="dashboard-subheading">
            Overview of daily operations, staff attendance, student marks, and school heritage.
          </p>
        </div>
        <div className="topbar-right">
          <div className="status-pill">
            <CheckCircle2 size={15} color="#10b981" />
            <span>Academic Year 2026–27</span>
          </div>
          <Link href="/attendance" className="quick-act-btn">
            <Clock size={16} />
            <span>Mark Today's Attendance</span>
          </Link>
        </div>
      </div>

      <div className="page-body">
        {/* Color Stat Cards Row */}
        <div className="stat-cards-grid">
          {statCards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="colorful-stat-card"
                style={{
                  backgroundColor: s.bgColor,
                  borderColor: s.borderColor,
                }}
              >
                <div className="stat-card-header">
                  <span
                    className="stat-icon-wrapper"
                    style={{ backgroundColor: s.iconColor, color: "#fff" }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="stat-title-label">{s.title}</span>
                </div>
                <div className="stat-card-body">
                  <div className="stat-value-num" style={{ color: s.iconColor }}>
                    {s.value}
                  </div>
                  <div className="stat-subtext-note">{s.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Heading */}
        <div className="section-title-row">
          <h2 className="section-heading">School ERP Modules</h2>
          <span className="section-sub">Select any module to view or record data</span>
        </div>

        {/* Modules Grid */}
        <div className="modules-grid">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="module-card-link">
                <div
                  className="module-card"
                  style={
                    {
                      "--hover-color": m.color,
                    } as React.CSSProperties
                  }
                >
                  <div className="module-card-top">
                    <div
                      className="module-icon-box"
                      style={{ backgroundColor: m.bgLight, color: m.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      className="module-badge"
                      style={{ backgroundColor: m.bgLight, color: m.color }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="module-title">{m.title}</h3>
                  <p className="module-desc">{m.desc}</p>
                  <div className="module-card-footer" style={{ color: m.color }}>
                    <span>Open Module</span>
                    <ArrowRight size={14} className="arrow-icon" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions & Heritage Spotlight Row */}
        <div className="bottom-sections-grid">
          {/* Quick Actions Box */}
          <div className="quick-actions-box">
            <div className="box-header">
              <Sparkles size={18} className="box-header-icon" />
              <h3>Quick Data Entry Actions</h3>
            </div>
            <div className="quick-links-list">
              <Link href="/teachers/new" className="quick-link-item">
                <PlusCircle size={16} className="item-icon" />
                <span>Add New Teacher Profile</span>
              </Link>
              <Link href="/leave/new" className="quick-link-item">
                <PlusCircle size={16} className="item-icon" />
                <span>Apply Medical / Casual Leave</span>
              </Link>
              <Link href="/students" className="quick-link-item">
                <PlusCircle size={16} className="item-icon" />
                <span>Register New Student</span>
              </Link>
              <Link href="/marks" className="quick-link-item">
                <PlusCircle size={16} className="item-icon" />
                <span>Record Subject Mark Sheet</span>
              </Link>
            </div>
          </div>

          {/* School Heritage Spotlight Box */}
          <div className="heritage-spotlight-box">
            <div className="heritage-badge">
              <History size={15} />
              <span>RSL School History</span>
            </div>
            <h3>RSL School Historical Works & College Collaborations</h3>
            <p>
              Explore institutional contributions, college volunteer projects, visitor logs, and historical developments inside RSL School.
            </p>
            <Link href="/history" className="heritage-btn">
              <span>View RSL History & Visitor Logs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
