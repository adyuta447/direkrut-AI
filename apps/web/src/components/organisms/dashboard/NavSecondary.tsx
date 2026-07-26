"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useDashboard } from "@/context/DashboardContext"
import { cn } from "@/lib/utils"

function isNavItemActive(pathname: string, url: string) {
  if (pathname === url) return true
  return url.split("/").length > 2 && pathname.startsWith(`${url}/`)
}

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url?: string
    icon: React.ReactNode
    /** Buka command palette alih-alih navigasi. */
    search?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setSearchOpen } = useDashboard()
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.search ? (
                <SidebarMenuButton onClick={() => setSearchOpen(true)}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  render={<Link href={item.url ?? "/"} />}
                  isActive={isNavItemActive(pathname, item.url ?? "/")}
                  className={cn(
                    isNavItemActive(pathname, item.url ?? "/") &&
                      "data-active:bg-surface-soft data-active:text-white data-active:font-semibold hover:bg-surface-soft hover:text-white"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
