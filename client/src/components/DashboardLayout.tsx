import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { Clapperboard, Library, LogOut, PanelLeft, PlaySquare } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [{ icon: Library, label: "Episodes", path: "/admin" }, { icon: PlaySquare, label: "Public show page", path: "/show" }];
const SIDEBAR_WIDTH_KEY = "studio-sidebar-width";
const DEFAULT_WIDTH = 264;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => { const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY); return saved ? parseInt(saved, 10) : DEFAULT_WIDTH; });
  const { loading, user } = useAuth();
  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <div className="grid min-h-screen place-items-center bg-[#080808] p-6 text-white"><div className="w-full max-w-sm text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#e50914]"><Clapperboard className="h-5 w-5" /></span><h1 className="mt-5 font-display text-3xl font-bold tracking-[-.05em]">Sign in to Studio</h1><p className="mt-3 text-sm leading-6 text-white/55">Owner authentication is required before content can be managed.</p><Button onClick={() => startLogin()} size="lg" className="mt-6 w-full bg-[#e50914] font-bold hover:bg-[#f6121d]">Sign in</Button></div></div>;
  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();
  useEffect(() => { if (isCollapsed) setIsResizing(false); }, [isCollapsed]);
  useEffect(() => { const handleMouseMove = (event: MouseEvent) => { if (!isResizing) return; const left = sidebarRef.current?.getBoundingClientRect().left ?? 0; const width = event.clientX - left; if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width); }; const handleMouseUp = () => setIsResizing(false); if (isResizing) { document.addEventListener("mousemove", handleMouseMove); document.addEventListener("mouseup", handleMouseUp); document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; } return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; }; }, [isResizing, setSidebarWidth]);
  return <><div className="relative" ref={sidebarRef}><Sidebar collapsible="icon" className="border-r border-white/8 bg-[#0e0e0e]" disableTransition={isResizing}><SidebarHeader className="h-16 justify-center"><div className="flex w-full items-center gap-3 px-2"><button onClick={toggleSidebar} className="grid h-8 w-8 place-items-center rounded-lg text-white/60 transition hover:bg-white/8 hover:text-white"><PanelLeft className="h-4 w-4" /></button>{!isCollapsed ? <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded bg-[#e50914]"><Clapperboard className="h-3.5 w-3.5 text-white" /></span><span className="font-display text-sm font-bold tracking-[-.04em] text-white">OUR STORY</span></div> : null}</div></SidebarHeader><SidebarContent className="gap-0"><SidebarMenu className="px-2 py-2">{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-10 text-white/65 data-[active=true]:bg-[#e50914] data-[active=true]:text-white"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarContent><SidebarFooter className="p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-white/7 group-data-[collapsible=icon]:justify-center"><Avatar className="h-9 w-9 border border-white/15"><AvatarFallback className="bg-white/10 text-xs text-white">{user?.name?.charAt(0).toUpperCase() || "O"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-medium text-white">{user?.name || "Owner"}</p><p className="mt-1 truncate text-xs text-white/45">Owner account</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-white/10 bg-[#161616] text-white"><DropdownMenuItem onClick={logout} className="cursor-pointer text-[#f36b70] focus:bg-white/8 focus:text-[#f36b70]"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><div className={`absolute right-0 top-0 z-50 h-full w-1 cursor-col-resize transition hover:bg-[#e50914]/40 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => !isCollapsed && setIsResizing(true)} /></div><SidebarInset className="bg-[#080808]"><>{isMobile ? <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-white/8 bg-[#080808]/95 px-3 backdrop-blur"><SidebarTrigger className="h-9 w-9 rounded-lg text-white hover:bg-white/8" /><span className="text-sm font-semibold text-white">{activeMenuItem?.label || "Studio"}</span></div> : null}<main className="flex-1 p-4 sm:p-6">{children}</main></></SidebarInset></>;
}
