"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  FileText,
  Users,
  Building2,
  Shield,
  TrendingUp,
  Settings,
  Database,
  Bell,
  Globe,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  UserPlus,
  AlertCircle
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard"
    },
    {
      name: "Bills",
      href: "/dashboard/bills",
      icon: FileText,
      current: pathname.startsWith("/dashboard/bills")
    },
    {
      name: "Legislators",
      href: "/dashboard/legislators",
      icon: Users,
      current: pathname.startsWith("/dashboard/legislators")
    },
    {
      name: "Clients",
      href: "/dashboard/clients",
      icon: Building2,
      current: pathname.startsWith("/dashboard/clients")
    },
    {
      name: "Contacts",
      href: "/dashboard/contacts",
      icon: UserPlus,
      current: pathname.startsWith("/dashboard/contacts")
    },
    {
      name: "Compliance",
      href: "/dashboard/compliance",
      icon: Shield,
      current: pathname.startsWith("/dashboard/compliance")
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/dashboard/analytics")
    },
    {
      name: "Alerts",
      href: "/dashboard/alerts",
      icon: Bell,
      current: pathname.startsWith("/dashboard/alerts")
    }
  ];

  const tools = [
    {
      name: "Data Sync",
      href: "/dashboard/admin",
      icon: Database,
      current: pathname.startsWith("/dashboard/admin")
    },
    {
      name: "Sources",
      href: "/dashboard/sources",
      icon: Globe,
      current: pathname.startsWith("/dashboard/sources")
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname.startsWith("/dashboard/settings")
    }
  ];

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">
                <span className="text-slate-400">LITTLE</span>
                <span className="text-white">BIRD</span>
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Tools Section */}
        <div className="px-3 py-4">
          {!collapsed && (
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tools
            </div>
          )}
          <nav className="space-y-1">
            {tools.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-800">
          {!collapsed && (
            <div className="text-xs text-slate-400 text-center">
              Little Bird v1.0
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
