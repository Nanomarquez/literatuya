import { Navbar } from "@/components/Navbar"
import { SearchBar } from "@/components/SearchBar"
import { SearchResults } from "@/components/SearchResults"
import { Footer } from "@/components/Footer"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {query ? (
          <SearchResults query={query} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Realiza una búsqueda</h2>
            <p className="text-muted-foreground">
              Ingresa una palabra o frase para descubrir definiciones y curiosidades
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
