import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CircleUserRoundIcon, BellIcon, LogOutIcon } from "lucide-react"
import { useApp } from "@/context/AppContext"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface NavUserMenuProps {
  user: { name: string; email: string }
  accountUrl?: string
  side: "bottom" | "right"
}

export function NavUserMenu({ user, accountUrl, side }: NavUserMenuProps) {
  const { setCurrentUser } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/auth")
  }

  return (
    <DropdownMenuContent
      className="min-w-56"
      side={side}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8">
              <AvatarFallback className="rounded-lg">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {accountUrl && (
          <DropdownMenuItem onClick={() => router.push(accountUrl)}>
            <CircleUserRoundIcon />
            Akun
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <BellIcon />
          Notifikasi
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOutIcon />
        Keluar
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

export { initials }
