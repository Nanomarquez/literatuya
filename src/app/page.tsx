"use client";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { TrendingWords } from "@/components/TrendingWords";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  console.log({ user });

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Litera<span className="text-rose-500">tuya</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Descubre y comparte desafíos literarios interesantes y auténticos
          </p>
        </div>

        <SearchBar />
        {user ? (
          <Button asChild>
            <Link href="/definiciones/crear">
              <Plus className="h-4 w-4 mr-2" />
              Crear definición
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Inicia sesión para crear</Link>
          </Button>
        )}

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Palabras en tendencia
          </h2>
          <TrendingWords />
        </div>
      </div>
      <Footer />
    </main>
  );
}
