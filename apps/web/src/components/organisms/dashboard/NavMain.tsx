"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { MailIcon } from "lucide-react"
import Link from "next/link"

function isNavItemActive(pathname: string, url: string) {
  if (pathname === url) return true
  return url.split("/").length > 2 && pathname.startsWith(`${url}/`)
}

export function NavMain({
  items,
  actionButton,
  inboxUrl
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  actionButton?: {
    title: string
    url: string
    icon: React.ReactNode
  }
  inboxUrl?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {actionButton && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                render={<Link href={actionButton.url} />}
                tooltip={actionButton.title}
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                {actionButton.icon}
                <span>{actionButton.title}</span>
              </SidebarMenuButton>
              {inboxUrl && (
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0"
                  variant="outline"
                  title="Kotak Masuk"
                >
                  <Link href={inboxUrl}>
                    <MailIcon />
                    <span className="sr-only">Kotak Masuk</span>
                  </Link>
                </Button>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            const active = isNavItemActive(pathname, item.url)
            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                tooltip={item.title}
                isActive={active}
                className={cn(
                  active &&
                    "data-active:bg-surface-soft data-active:text-white data-active:font-semibold hover:bg-surface-soft hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
