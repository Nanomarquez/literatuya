import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ThumbsUp, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function DefinitionsPage() {
  // Estos serían datos que vendrían de una base de datos
  const definitions = [
    {
      id: 1,
      word: "Serendipia",
      definition:
        "Hallazgo valioso que se produce de manera accidental o casual.",
      literaturiaDefinition:
        "Ese momento mágico cuando encuentras algo genial sin buscarlo, como cuando buscas calcetines y encuentras dinero.",
      author: "María García",
      category: "Palabras bonitas",
      votes: 342,
      comments: 28,
      isOfficial: true,
    },
    {
      id: 2,
      word: "Procrastinear",
      definition: "No existe en la RAE",
      literaturiaDefinition:
        "El arte de convertir 'lo haré en 5 minutos' en 'lo haré mañana' y luego en 'algún día'.",
      author: "Carlos Ruiz",
      category: "Comportamiento",
      votes: 289,
      comments: 45,
      isOfficial: false,
    },
    {
      id: 3,
      word: "Petricor",
      definition: "Olor que produce la lluvia al caer en suelos secos.",
      literaturiaDefinition:
        "El perfume natural que la tierra regala cuando la lluvia la besa después de mucho tiempo.",
      author: "Ana López",
      category: "Sensaciones",
      votes: 256,
      comments: 19,
      isOfficial: true,
    },
    {
      id: 4,
      word: "Cafetearse",
      definition: "No existe en la RAE",
      literaturiaDefinition:
        "Acción de pasar horas en una cafetería fingiendo que trabajas mientras en realidad solo tomas café y observas gente.",
      author: "Diego Morales",
      category: "Acciones modernas",
      votes: 198,
      comments: 33,
      isOfficial: false,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Definiciones</h1>
          <Button asChild>
            <Link href="/definiciones/crear">
              <Plus className="h-4 w-4 mr-2" />
              Crear definición
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar definiciones..." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="official">Oficiales</TabsTrigger>
            <TabsTrigger value="community">Comunidad</TabsTrigger>
            <TabsTrigger value="trending">Tendencia</TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {definitions.map((def) => (
              <DefinitionCard key={def.id} definition={def} />
            ))}
          </TabsContent>

          <TabsContent
            value="official"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {definitions
              .filter((def) => def.isOfficial)
              .map((def) => (
                <DefinitionCard key={def.id} definition={def} />
              ))}
          </TabsContent>

          <TabsContent
            value="community"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {definitions
              .filter((def) => !def.isOfficial)
              .map((def) => (
                <DefinitionCard key={def.id} definition={def} />
              ))}
          </TabsContent>

          <TabsContent
            value="trending"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {definitions
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 4)
              .map((def) => (
                <DefinitionCard key={def.id} definition={def} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}

function DefinitionCard({
  definition,
}: {
  definition: {
    id: number;
    word: string;
    definition: string;
    literaturiaDefinition: string;
    author: string;
    category: string;
    votes: number;
    comments: number;
    isOfficial: boolean;
  };
}) {
  return (
    <Link href={`/palabra/${definition.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{definition.word}</CardTitle>
              <CardDescription>Por {definition.author}</CardDescription>
            </div>
            <div className="flex gap-2">
              {definition.isOfficial ? (
                <Badge variant="default">Oficial</Badge>
              ) : (
                <Badge variant="secondary">Comunidad</Badge>
              )}
              <Badge variant="outline">{definition.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {definition.isOfficial && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">RAE:</span>{" "}
              {definition.definition}
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Literatuya:</span>{" "}
            {definition.literaturiaDefinition}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {definition.votes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {definition.comments}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
