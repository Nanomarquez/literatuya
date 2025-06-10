"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  BookOpen,
  Home,
  Search,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Notifications } from "@/components/Notifications";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Definiciones", href: "/definiciones", icon: Book },
    { name: "Curiosidades", href: "/curiosidades", icon: Sparkles },
    { name: "Palabra del día", href: "/palabra-del-dia", icon: BookOpen },
    { name: "Adivinanza", href: "/adivinanza", icon: Search },
    { name: "Entretenimiento", href: "/entretenimiento", icon: User },
  ];

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="flex-1 container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              Litera<span className="text-rose-500">tuya</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/buscar">
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>
            <ModeToggle />
            {user && <Notifications />}
          </div>
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/perfil">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="md:hidden border-t fixed w-full bottom-0 bg-background">
        <nav className="flex justify-between px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
