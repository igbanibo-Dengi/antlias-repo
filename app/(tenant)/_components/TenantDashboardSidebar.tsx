"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  CreditCard,
  FileText,
  Grid,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/tenant",
    icon: LayoutDashboard,
  },
  {
    title: "Wallet",
    href: "/tenant/wallet",
    icon: Wallet,
  },
  {
    title: "Stations",
    href: "/tenant/stations",
    icon: Grid,
  },
  {
    title: "Transactions",
    href: "/tenant/transactions",
    icon: BarChart2,
  },
  {
    title: "Expense",
    href: "/tenant/expense",
    icon: ShoppingCart,
  },
  {
    title: "Fuel Inventory",
    href: "/tenant/fuel-inventory",
    icon: FileText,
  },
  {
    title: "Employees",
    href: "/tenant/employees",
    icon: Users,
  },
  {
    title: "Pay Salary",
    href: "/tenant/pay-salary",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/tenant/settings",
    icon: Settings,
  },
];

export function TenantDashboardSidebar() {
  const pathname = usePathname();

  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar className="border-r bg-red-400" collapsible="icon">
      <SidebarHeader className="p-0 bg-white">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold whitespace-nowrap"
          >
            <Image
              src="/icons/antlias-logo.svg"
              alt="Ant-lias Logo"
              width={24}
              height={24}
              priority
            />
            <p
              className={`text-2xl font-semibold transition-all duration-200 ease-in-out ${open ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              Ant-lía
            </p>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 bg-white">
        <SidebarMenu>
          {navItems.map((item) => (

            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/tenant' ? pathname === '/tenant' : pathname === item.href || pathname.startsWith(item.href)}
                className={cn(
                  "h-10 gap-3 pl-4 pr-2 font-medium text-muted-foreground hover:text-white hover:bg-primary/40 data-[active=true]:bg-primary data-[active=true]:text-white",
                  // pathname === item.href && "bg-primary text-white hover:bg-blue-700 hover:text-white",
                )}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
