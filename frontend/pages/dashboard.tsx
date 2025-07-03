"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@components/dialog"
import { Input } from "@components/input"
import { Button } from "@components/button"
import {router} from "next/client";

type Project = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "projects"

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const searchParams = useSearchParams();
  const circuitId = searchParams.get("id"); // Getting id of the scheme from the URl of the page

  const [, setCircuit] = useState(null)

  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);


  // Загрузить token из localStorage
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (storedToken) {
      setToken(storedToken)
      const parsed = parseJwt(storedToken)
      setUserId(parsed?.userId ?? null)
    }
  }, [])

  useEffect(() => {
    if (!token || !circuitId) return;

    const HOST = window.location.host;
    fetch(`http://${HOST}:8052/api/circuits/${circuitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => setCircuit(data))
        .catch(console.error);
  }, [token, circuitId]);



  // Загрузка проектов
  useEffect(() => {
    const loadProjects = async () => {
      if (!token) return
      try {
        const HOST = window.location.host;
        const res = await fetch(`http://${HOST}:8052/api/circuits`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data: Project[] = await res.json()
        setProjects(data)
      } catch (err) {
        console.error("Failed to load from backend", err)
        setProjects([])
      }
    }

    loadProjects()
  }, [token])


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const handleCreateProject = async () => {
    if (!newTitle.trim()) return;

    try {
      const HOST = window.location.host;

      const res = await fetch(`http://${HOST}:8052/api/circuits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          userId,
        }),
      });

      const resultText = await res.text();
      console.log("Scheme creating, answer from the server:", resultText);

      if (!res.ok) throw new Error("Error while creating project");

      const newProject: Project = JSON.parse(resultText);

      setProjects((prev) => [newProject, ...prev]);
      setNewTitle("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not save the project to server...");
    }
  };


  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Dashboard of the User</BreadcrumbLink>
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
                  {/* grid icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                  </svg>
                </button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                      + New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleCreateProject()
                      }}
                    >
                      <Input
                          placeholder="Project title"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <DialogFooter className="mt-4">
                        <Button onClick={handleCreateProject}>Create</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative mb-6">
              <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            {filteredProjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No projects found</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer">
                  {filteredProjects.map((proj) => (
                      <div key={proj.id}
                           onClick={() => router.push(`/playground?id=${proj.id}`)}
                           className="border rounded-lg p-4 hover:shadow transition">
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
