import * as React from "react"
import { jwtDecode } from 'jwt-decode'
import {
  Frame,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
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
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Circuit 1",
      url: "/playground",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar?: string
  } | null>(null)


  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<{ name: string; email: string }>(token)
        setUser({
          name: decoded.name,
          email: decoded.email,
          avatar: "/avatars/shadcn.jpg"
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <div className="px-4 py-2 text-xs text-muted-foreground">Loading user...</div>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
