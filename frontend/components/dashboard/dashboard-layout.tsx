"use client";

import type React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Package,
  Car,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  Search,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Browse Requests", href: "/dashboard/browse", icon: Search },
  { name: "Browse Trips", href: "/dashboard/browse-trips", icon: Car },
  { name: "My Requests", href: "/dashboard/requests", icon: Package },
  { name: "My Trips", href: "/dashboard/trips", icon: Car },
  { name: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  // { name: "Tracking", href: "/dashboard/tracking", icon: MapPin },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading, error } = useAuth();

  useEffect(() => {
    console.log("DashboardLayout: Auth state changed", {
      user: !!user,
      loading,
      error,
    });

    if (typeof window === "undefined") return;

    const hasToken = !!localStorage.getItem("auth_token");
    console.log("DashboardLayout: Token check", { hasToken });

    // Only redirect if we're sure there's no authentication
    if (!loading && !user && !hasToken) {
      console.log(
        "DashboardLayout: Redirecting to login - no user and no token"
      );
      router.push("/login");
    }
  }, [loading, user, error, router]);

  // Show loading state while auth is being determined
  if (loading) {
    console.log("DashboardLayout: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Handle authentication errors more defensively
  if (error && typeof window !== "undefined") {
    const hasToken = !!localStorage.getItem("auth_token");
    // Only redirect if we have a token but authentication specifically failed (401)
    // Don't redirect for network errors or other API failures
    if (hasToken && !user && error.includes("401")) {
      console.log(
        "DashboardLayout: 401 auth error with token, clearing and redirecting"
      );
      localStorage.removeItem("auth_token");
      router.push("/login");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Session expired. Redirecting to login...
            </p>
          </div>
        </div>
      );
    }
  }

  // Final check for user authentication
  if (!user) {
    console.log("DashboardLayout: No user, checking token...");
    if (typeof window !== "undefined") {
      const hasToken = !!localStorage.getItem("auth_token");
      if (!hasToken) {
        console.log("DashboardLayout: No token, redirecting to login");
        router.push("/login");
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
          </div>
        );
      }
    }

    // If we have a token but no user, wait a bit more
    console.log("DashboardLayout: Have token but no user, showing loading");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  console.log("DashboardLayout: Rendering dashboard for user:", user.firstName);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  CC
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground">
                  CampusConnect
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  Student Portal
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profileImage || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.verificationStatus === "approved" && (
                        <Shield className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {user.studentId}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
