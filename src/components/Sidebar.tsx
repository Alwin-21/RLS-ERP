"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  Banknote,
  GraduationCap,
  Award,
  Calendar,
  BookOpenCheck,
  BookMarked,
  Dumbbell,
  Utensils,
  LogOut,
  School,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "#3b82f6" },
  { href: "/history", label: "RSL History & Heritage", icon: History, color: "#8b5cf6" },
  { href: "/teachers", label: "Teacher & Staff Directory", icon: Users, color: "#06b6d4" },
  { href: "/attendance", label: "Staff Attendance", icon: CalendarCheck, color: "#10b981" },
  { href: "/leave", label: "Medical / Casual Leave", icon: FileSpreadsheet, color: "#f59e0b" },
  { href: "/salary", label: "Salary Records", icon: Banknote, color: "#ec4899" },
  { href: "/students", label: "Student Register", icon: GraduationCap, color: "#6366f1" },
  { href: "/marks", label: "Mark Register & Analysis", icon: Award, color: "#3b82f6" },
  { href: "/timetable", label: "Timetable Scheduler", icon: Calendar, color: "#14b8a6" },
  { href: "/syllabus", label: "Syllabus Upload", icon: BookOpenCheck, color: "#8b5cf6" },
  { href: "/library", label: "Library Records", icon: BookMarked, color: "#ef4444" },
  { href: "/sports", label: "Sports Inventory", icon: Dumbbell, color: "#f97316" },
  { href: "/noon-meals", label: "Noon Meals Records", icon: Utensils, color: "#84cc16" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* School Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <School className="w-6 h-6 text-white" />
        </div>
        <div className="brand-info">
          <h2>RSL School ERP</h2>
          <p>Govt-Aided · Tamil Nadu</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span
                className="nav-icon-badge"
                style={{
                  backgroundColor: isActive ? item.color : "rgba(255,255,255,0.08)",
                  color: isActive ? "#ffffff" : item.color,
                }}
              >
                <Icon size={16} />
              </span>
              <span className="nav-label">{item.label}</span>
              {isActive && <ChevronRight size={14} className="active-arrow" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">HM</div>
          <div className="user-meta">
            <span className="user-name">RSL Admin</span>
            <span className="user-role">Headmaster / Principal</span>
          </div>
        </div>
        <Link href="/login" className="logout-btn" title="Sign Out">
          <LogOut size={16} />
        </Link>
      </div>
    </aside>
  );
}
