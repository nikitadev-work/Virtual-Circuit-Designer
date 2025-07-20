import * as React from "react"
import { jwtDecode } from 'jwt-decode'
import {
  Settings2,
  SquareTerminal,
} from "lucide-react"


import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@components/sidebar"


// This is sample data.
const data = {
  user: {
    name: "User",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar?: string
    id: string
  } | null>(null)


  React.useEffect(() => {
    const token = localStorage.getItem('token')
    console.log("Токен из localStorage:", token) // Логи
    if (token) {
      try {
        const decoded = jwtDecode<{ user_name: string; user_email: string; user_id: string }>(token)
        console.log("Decoded токена:", decoded) // Логи
        setUser({
          name: decoded.user_name,
          email: decoded.user_email,
          avatar: "/avatars/shadcn.jpg",
          id: decoded.user_id
        })
      } catch (err) {
        console.error("Ошибка при декодировании токена", err)
      }
    }
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <div className="px-4 py-2 text-xs text-muted-foreground">Loading user...</div>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
