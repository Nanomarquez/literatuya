"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Definition, getDefinitions } from "@/lib/definitions";
import Loader from "./Loader";

export function TrendingWords() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingWords = async () => {
      try {
        const trendingDefinitions = await getDefinitions({ trending: true });
        setDefinitions(trendingDefinitions);
      } catch (error) {
        console.error("Error al cargar las palabras trending:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingWords();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (definitions.length === 0) {
    return (
      <div className="text-center text-lg text-muted-foreground">
        No hay palabras trending
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {definitions.map((word) => (
        <Link href={`/palabra/${word.id}`} key={word.id}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{word.word}</CardTitle>
                <Badge variant="outline">{word.votes} votos</Badge>
              </div>
              <CardDescription>{word.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold">RAE:</span> {word.raeDefinition}
              </p>
              <p className="text-sm italic">
                <span className="font-semibold">Literatuya:</span>{" "}
                {word.literaturiaDefinition}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
