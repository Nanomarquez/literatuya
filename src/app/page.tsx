import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { TrendingWords } from "@/components/TrendingWords";
import { Footer } from "@/components/Footer";

export default function Home() {
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
