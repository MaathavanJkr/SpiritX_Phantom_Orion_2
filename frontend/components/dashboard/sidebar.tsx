"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, Users, BarChart2, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Team Players", href: "/dashboard/team" },
    { icon: BarChart2, label: "Statistics", href: "/dashboard/statistics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <Sidebar collapsible="none" className="w-64 shrink-0">
      <SidebarHeader className="flex items-center justify-center py-4">
        <h1 className="text-xl font-bold">Team Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

