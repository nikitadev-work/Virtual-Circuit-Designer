import * as React from "react"
import {
  
  
  
  
  Frame,
<<<<<<< HEAD
  GalleryVerticalEnd,
  
  PieChart,
=======
  // Map,
>>>>>>> 0394ec58 (Dashboard editing)
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/sidebar"


const data = {
  user: {
    name: "User",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "VCD",
      logo: ".../public/Logo.svg",
    }
  ],
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
  } | null>(null)

  React.useEffect(() => {
    const fetchUser = async() => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Not authorized")

        const data = await res.json()
        setUser({
          name: data.name,
          email: data.email,
        })
      } catch (error) {
        console.error("Failed to fetch user", error)
      }
    }

    fetchUser()
  }, [])


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
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
