"use client"

import {useEffect, useState} from "react"
//import { useSearchParams } from "next/navigation";
import {AppSidebar} from "../src/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@components/breadcrumb"
import {Separator} from "@components/separator"
import {
    SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
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
import {Input} from "@components/input"
import {Button} from "@components/button"
import {useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@components/dropdown-menu";
import {ChevronsUpDown, Edit2, Trash} from "lucide-react";

// SVG patterns for pixel-art backgrounds
const PIXEL_ART_PATTERNS = [
  // 1
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%23fff'/><rect x='8' y='8' width='16' height='16' fill='%230099FF'/><rect x='40' y='24' width='16' height='16' fill='%2363CBFF'/><rect x='72' y='40' width='16' height='16' fill='%231C3BD5'/></svg>`,
  // 2
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%230099FF'/><rect x='16' y='16' width='16' height='16' fill='%23fff'/><rect x='64' y='32' width='16' height='16' fill='%2363CBFF'/></svg>`,
  // 3
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%2363CBFF'/><rect x='0' y='0' width='32' height='32' fill='%23fff'/><rect x='64' y='40' width='32' height='32' fill='%230099FF'/></svg>`,
  // 4
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%23fff'/><rect x='24' y='24' width='48' height='24' fill='%230099FF'/><rect x='40' y='8' width='16' height='16' fill='%2363CBFF'/></svg>`,
  // 5
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%231C3BD5'/><rect x='8' y='8' width='24' height='24' fill='%23fff'/><rect x='56' y='40' width='32' height='24' fill='%230099FF'/></svg>`,
  // 6
  `data:image/svg+xml;utf8,<svg width='96' height='72' xmlns='http://www.w3.org/2000/svg'><rect width='96' height='72' fill='%23fff'/><rect x='0' y='56' width='96' height='16' fill='%230099FF'/><rect x='0' y='0' width='96' height='8' fill='%2363CBFF'/></svg>`,
];

// --- PIXEL ART GENERATOR ---
function stringToSeed(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function generatePixelArtSVG(seed: string): string {
  const size = 8; // 8x8 blocks
  const block = 12;
  const colors = [
    '#0099FF', // blue
    '#63CBFF', // light blue
    '#1C3BD5', // dark blue
    '#fff',    // white
    'transparent',
  ];
  let s = stringToSeed(seed);
  let svg = `<svg width='${size * block}' height='${size * block}' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%23fff'/>`;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size / 2; x++) {
      s = (s * 9301 + 49297) % 233280;
      const color = colors[s % colors.length];
      if (color !== 'transparent') {
        svg += `<rect x='${x * block}' y='${y * block}' width='${block}' height='${block}' fill='${color}'/>`;
        // mirror horizontally
        svg += `<rect x='${(size - 1 - x) * block}' y='${y * block}' width='${block}' height='${block}' fill='${color}'/>`;
      }
    }
  }
  svg += `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type Project = {
    id: string
    circuit_name: string
    createdAt: string
    updatedAt: string
}

const getStorageKey = (userId: string | null) => `projects-${userId ?? "guest"}`

declare global {
    interface Window {
        savedCircuitId?: string | null;
    }
}

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [newTitle, setNewTitle] = useState("")
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [backendCircuits, setBackendCircuits] = useState<Project[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null)
    const allProjects = [
        ...backendCircuits,
        ...projects.filter(localProj =>
            !backendCircuits.some(backendProj => backendProj.id === localProj.id)
        )
    ];
    const filteredProjects = allProjects.filter((project) =>
        project.circuit_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const router = useRouter();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [initialized, setInitialized] = useState(false)

    function parseJwt(token: string): { user_id: string } | null {
        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch {
            return null
        }
    }

    // Инициализация: получаем токен и userId
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            const parsed = parseJwt(storedToken);
            setUserId(parsed?.user_id ?? null);
        }
        setInitialized(true)
    }, []);

    // GET projects from backend
    useEffect(() => {
        if (!userId || !token) return;

        const HOST = window.location.hostname;
        fetch(`http://${HOST}:8052/api/circuits`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Данные с сервера:', data);  // <- вот сюда добавь
                const parsed = data.map((circuit: Project) => ({
                    id: circuit.id,
                    circuit_name: circuit.circuit_name || "Untitled",
                    createdAt: circuit.createdAt,
                    updatedAt: circuit.updatedAt,
                }));
                setBackendCircuits(parsed);
            })
            .catch(console.error);
    }, [userId, token]);







    const handleDeleteProject = async (projectId: string) => {
        if (!userId || !token) return;

        const HOST = window.location.hostname;

        try {
            // Удаляем с бэкенда
            const res = await fetch(`http://${HOST}:8052/api/circuits/${projectId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Ошибка при удалении проекта с сервера:", errorText);
                alert("Не удалось удалить проект: " + errorText);
                return;
            }

            // Удаляем из локального состояния
            setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
            setBackendCircuits((prev) => prev.filter((proj) => proj.id !== projectId));

            // Также удаляем из localStorage
            const key = getStorageKey(userId);
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                const updated = parsed.filter((proj: Project) => proj.id !== projectId);
                localStorage.setItem(key, JSON.stringify(updated));
            }

        } catch (e) {
            console.error("Ошибка при удалении проекта:", e);
            alert("Произошла ошибка при удалении проекта.");
        }
    };
    const handleCreateProject = async () => {
        if (!newTitle.trim() || !userId || !token) return;

        console.log("Creating project with title:", newTitle, "userId:", userId);

        const now = new Date().toISOString();
        const HOST = window.location.hostname;

        // 1. создаём «пустую» схему на сервере и сразу получаем numeric id
        const payload = {
            user_id: Number(userId),
            circuit_name: newTitle.trim(),
            circuit_description: [],        // пока пусто
            circuit_inputs: [],
            circuit_coordinates: []
        };

        const res = await fetch(`http://${HOST}:8052/api/circuits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert(await res.text());        // или ваша обработка ошибок
            return;
        }

        const { circuit_id: id } = await res.json();  // ← тут уже число
        localStorage.setItem('savedCircuitId', String(id));
        window.savedCircuitId = String(id); // на всякий случай

        const newProject: Project = {
            id: String(id),
            circuit_name: newTitle.trim(),
            createdAt: now,
            updatedAt: now
        };

        // 3. сохраняем локально, очищаем форму
        setProjects(prev => [...prev, newProject]);
        setNewTitle("");
        setOpen(false);                   // закрыть диалог

        console.log("project при генерации ссылки:", id);
    };


    if (!initialized) return <p>Loading...</p>
    if (!userId) return <p className="text-red-600">Not logged in</p>
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
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
                            <button
                                className="rounded-md p-2 hover:bg-muted"
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                            >
                                {viewMode === "grid" ? (
                                    // grid icon
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                                         viewBox="0 0 24 24">
                                        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                                         viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"/>
                                    </svg>
                                )}
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
                                            <Button type="submit"
                                                    disabled={!newTitle.trim() || !userId || !initialized}>Create</Button>
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
                        <div
                            className={viewMode === "grid"
                                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer"
                                : "flex flex-col gap-4 cursor-pointer"}
                        >
                            {filteredProjects.map((proj) => (
                                <div
                                    key={proj.id}
                                    onClick={() => router.push(`/playground?projectId=${proj.id}&title=${encodeURIComponent(proj.circuit_name)}`)}
                                    className={
                                        viewMode === "grid"
                                            ? "border rounded-lg p-4 hover:shadow transition"
                                            : "flex items-center justify-between border rounded-lg p-4 hover:shadow transition"
                                    }
                                >
                                    {viewMode === "grid" ? (
                                        <>
                                            <div
                                                className="aspect-[4/3] rounded-md flex items-center justify-center relative overflow-hidden group shadow-sm bg-white">
                                                <img
                                                    src="/Icons/Logos/wallpaper.png"
                                                    alt="Project wallpaper background"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition group-hover:scale-105 duration-300"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-extrabold text-white drop-shadow-lg text-center select-none max-w-[90%] truncate whitespace-nowrap overflow-hidden">
                                                        {proj.circuit_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 w-full">
                                                <p className="font-medium text-sm pt-3">{proj.circuit_name}</p>
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-xs text-gray-500">
                                                        Created 20 July ·
                                                        Edited 20 July
                                                    </p>
                                                    <div className="cursor-pointer">
                                                        <SidebarMenu>
                                                            <SidebarMenuItem>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <SidebarMenuButton
                                                                            size="lg"
                                                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                                                        >
                                                                            <ChevronsUpDown className="ml-auto size-4"/>
                                                                        </SidebarMenuButton>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent
                                                                        className="min-w-56 rounded-lg"
                                                                        align="end"
                                                                        sideOffset={4}
                                                                    >
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteProject(proj.id);
                                                                            }}
                                                                        >
                                                                            <Trash/>
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </SidebarMenuItem>
                                                        </SidebarMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col">
                                                <p className="font-medium text-base">{proj.circuit_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Created 20 July ·
                                                    Edited 20 July
                                                </p>
                                            </div>
                                            <div className="cursor-pointer">
                                                <SidebarMenu>
                                                    <SidebarMenuItem>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <SidebarMenuButton
                                                                    size="lg"
                                                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                                                >
                                                                    <ChevronsUpDown className="ml-auto size-4"/>
                                                                </SidebarMenuButton>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                className="min-w-56 rounded-lg"
                                                                align="end"
                                                                sideOffset={4}
                                                            >
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteProject(proj.id);
                                                                    }}
                                                                >
                                                                    <Trash/>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </SidebarMenuItem>
                                                </SidebarMenu>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
