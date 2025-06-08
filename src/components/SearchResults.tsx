import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SearchResults({ query }: { query: string }) {
  // Estos serían datos que vendrían de una base de datos basados en la búsqueda
  const results = [
    {
      id: 1,
      word: "Serendipia",
      definition:
        "Hallazgo valioso que se produce de manera accidental o casual.",
      literaturiaDefinition:
        "Ese momento mágico cuando encuentras algo genial sin buscarlo, como cuando buscas calcetines y encuentras dinero.",
      example:
        "Descubrió su vocación por serendipia mientras ayudaba a un amigo.",
      category: "Palabras bonitas",
      votes: 342,
      type: "official",
    },
    {
      id: 7,
      word: "Serendipitoso",
      definition: "No existe en la RAE",
      literaturiaDefinition:
        "Persona que constantemente tiene experiencias de serendipia, como si la casualidad fuera su mejor amiga.",
      example:
        "Mi tío es tan serendipitoso que fue a comprar pan y volvió con un trabajo nuevo.",
      category: "Personalidad",
      votes: 156,
      type: "community",
    },
    {
      id: 8,
      word: "Serendipear",
      definition: "No existe en la RAE",
      literaturiaDefinition:
        "Verbo que describe la acción de encontrar cosas valiosas sin buscarlas intencionalmente.",
      example: "Me encanta serendipear por librerías de segunda mano.",
      category: "Acciones",
      votes: 89,
      type: "community",
    },
  ];

  const officialResults = results.filter((item) => item.type === "official");
  const communityResults = results.filter((item) => item.type === "community");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resultados para &quot;{query}&quot;</h2>
        <Badge variant="outline">{results.length} resultados</Badge>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="official">Definiciones oficiales</TabsTrigger>
          <TabsTrigger value="community">
            Definiciones de la comunidad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </TabsContent>

        <TabsContent value="official" className="space-y-4">
          {officialResults.length > 0 ? (
            officialResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron definiciones oficiales para &quot;{query}&quot;
            </p>
          )}
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {communityResults.length > 0 ? (
            communityResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron definiciones de la comunidad para &quot;{query}&quot;
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResultCard({ result }: { result: {
  id: number;
  word: string;
  definition: string;
  literaturiaDefinition: string;
  example: string;
  category: string;
  votes: number;
  type: string;
} }) {
  return (
    <Link href={`/palabra/${result.id}`}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{result.word}</CardTitle>
              <CardDescription>{result.category}</CardDescription>
            </div>
            <div className="flex gap-2">
              {result.type === "community" && (
                <Badge variant="secondary">Comunidad</Badge>
              )}
              <Badge variant="outline">{result.votes} votos</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {result.type === "official" && (
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">RAE:</span> {result.definition}
            </p>
          )}
          <p className="text-sm mb-2">
            <span className="font-semibold">Literatuya:</span>{" "}
            {result.literaturiaDefinition}
          </p>
          <p className="text-sm italic text-muted-foreground">
            <span className="font-semibold">Ejemplo:</span> {result.example}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
