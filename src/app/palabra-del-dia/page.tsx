"use client";
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
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Definition, getDefinitions, voteDefinition } from "@/lib/definitions";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function WordOfTheDayPage() {
  const [wordOfTheDay, setWordOfTheDay] = useState<Definition | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const handleVote = async (definition: Definition) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    try {
      const voted = await voteDefinition(definition.id, user.uid);
      if (definition) {
        setWordOfTheDay({
          ...definition,
          votes: definition.votes + (voted ? 1 : -1),
        });

        // Crear notificación para el autor de la definición
        if (voted && definition.authorId !== user.uid) {
          const notificationsRef = collection(db, "notifications");
          await addDoc(notificationsRef, {
            type: "vote",
            message: `${user.displayName || "Alguien"} votó tu definición de "${
              definition.word
            }"`,
            read: false,
            createdAt: new Date().toISOString(),
            userId: definition.authorId,
            definitionId: definition.id,
          });
        }
      }
      setHasVoted(voted);
      toast({
        title: voted ? "¡Voto registrado!" : "¡Voto removido!",
        description: voted ? "Gracias por tu voto" : "Has quitado tu voto",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu voto",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        // Obtener todas las definiciones
        const definitions = await getDefinitions({});

        // Calcular el índice basado en la fecha actual
        const today = new Date();
        const startDate = new Date("2024-01-01"); // Fecha de inicio arbitraria
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Seleccionar la palabra del día usando el índice
        const index = diffDays % definitions.length;
        setWordOfTheDay(definitions[index]);
      } catch (error) {
        console.error("Error al cargar la palabra del día:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordOfTheDay();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!wordOfTheDay) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p>No se pudo cargar la palabra del día</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Palabra del día</h1>

        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl">
                    {wordOfTheDay.word}
                  </CardTitle>
                  <CardDescription>{wordOfTheDay.category}</CardDescription>
                </div>
                <Badge variant="outline">
                  {new Date().toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Definición RAE:</h3>
                <p>{wordOfTheDay.raeDefinition}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Definición Literatuya:</h3>
                <p className="italic">{wordOfTheDay.literaturiaDefinition}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Etimología:</h3>
                <p>{wordOfTheDay.etymology}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Ejemplo:</h3>
                <p className="italic">&quot;{wordOfTheDay.example}&quot;</p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    variant={hasVoted ? "default" : "outline"}
                    onClick={() => handleVote(wordOfTheDay)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{wordOfTheDay.votes}</span>
                  </Button>
                  <Link href={`/palabra/${wordOfTheDay.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{wordOfTheDay.comments}</span>
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Compartir</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Curiosidades</h2>
            {wordOfTheDay.curiosities?.map((curiosity, index) => (
              <Card key={index}>
                <CardContent>
                  <p>{curiosity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
