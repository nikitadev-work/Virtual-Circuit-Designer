import { AppSidebar } from "../src/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@components/breadcrumb"
import { Separator } from "@components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@components/sidebar"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"

type Project = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "projects"

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Загружаем проекты из localStorage при старте
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setProjects(JSON.parse(raw))
      } catch {
        setProjects([])
      }
    }
    setLoading(false)
  }, [])

  // Сохраняем проекты в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const handleNew = async () => {
    const title = window.prompt("Enter a project title:")
    if (!title) return

    const now = new Date().toISOString()
    const newProject: Project = {
      id: uuid(),
      title,
      createdAt: now,
      updatedAt: now,
    }

    setProjects((prev) => [newProject, ...prev])
  }

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Dashboard of the User
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-black">All projects</h1>
              <div className="flex items-center gap-2">
                <button className="rounded-md p-2 hover:bg-muted">
                  <span className="sr-only">Grid view</span>
                  {/* grid */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                  </svg>
                </button>
                <button
                    onClick={handleNew}
                    className="cursor-pointer rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700"
                >
                  + New
                </button>
              </div>
            </div>

            <div className="relative mb-6">
              <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            {loading ? (
                <p>Loading…</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((proj) => (
                      <div key={proj.id} className="border rounded-lg p-4 hover:shadow transition">
                        <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                          <span className="text-sm text-gray-400">Empty</span>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium text-sm">{proj.title}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(proj.createdAt).toLocaleString()} · Edited {new Date(proj.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}
