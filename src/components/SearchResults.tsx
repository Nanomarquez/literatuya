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
import { Definition, getDefinitions } from "@/lib/definitions";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export function SearchResults({ query }: { query: string }) {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        setLoading(true);
        const data = await getDefinitions({ search: query });
        setDefinitions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinitions();
  }, [query]);

  const officialResults = definitions.filter((item) => item.isOfficial);
  const communityResults = definitions.filter((item) => !item.isOfficial);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Resultados para &quot;{query}&quot;
        </h2>
        <Badge variant="outline">{definitions.length} resultados</Badge>
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
          {definitions.map((definition) => (
            <ResultCard key={definition.id} definition={definition} />
          ))}
        </TabsContent>

        <TabsContent value="official" className="space-y-4">
          {officialResults.length > 0 ? (
            officialResults.map((definition) => (
              <ResultCard key={definition.id} definition={definition} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron definiciones oficiales para &quot;{query}&quot;
            </p>
          )}
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {communityResults.length > 0 ? (
            communityResults.map((definition) => (
              <ResultCard key={definition.id} definition={definition} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron definiciones de la comunidad para &quot;{query}
              &quot;
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResultCard({ definition }: { definition: Definition }) {
  return (
    <Link href={`/palabra/${definition.id}`}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{definition.word}</CardTitle>
              <CardDescription>{definition.category}</CardDescription>
            </div>
            <div className="flex gap-2">
              {!definition.isOfficial && (
                <Badge variant="secondary">Comunidad</Badge>
              )}
              <Badge variant="outline">{definition.votes} votos</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {definition.raeDefinition && (
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">RAE:</span>{" "}
              {definition.raeDefinition}
            </p>
          )}
          <p className="text-sm mb-2">
            <span className="font-semibold">Literatuya:</span>{" "}
            {definition.literaturiaDefinition}
          </p>
          {/* {definition.example && (
            <p className="text-sm italic text-muted-foreground">
              <span className="font-semibold">Ejemplo:</span>{" "}
              {definition.example}
            </p>
          )} */}
        </CardContent>
      </Card>
    </Link>
  );
}
