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

export default function Page() {
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
              <button className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700">
                + New
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <input
                type="text"
                placeholder="Search 2 projects..."
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Untitled */}
            <div className="border rounded-lg p-4 hover:shadow transition">
              <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                <span className="text-sm text-gray-400">Empty</span>
              </div>
              <div className="mt-2">
                <p className="font-medium text-sm">Untitled</p>
                <p className="text-xs text-gray-500">Created 3 minutes ago · Edited 4 minutes ago</p>
              </div>
            </div>

            {/* Card 2 - Circuit #2 */}
            <div className="border rounded-lg p-4 hover:shadow transition">
              <div className="aspect-[4/3] bg-gradient-to-r from-cyan-400 to-purple-400 rounded-md flex items-center justify-center overflow-hidden">
                <img
                    src="/path"
                    alt="Circuit preview"
                    className="h-3/4"
                />
              </div>
              <div className="mt-2">
                <p className="font-medium text-sm">Circuit #2</p>
                <p className="text-xs text-gray-500">Created 4 months ago · Edited 4 months ago</p>
              </div>
            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
