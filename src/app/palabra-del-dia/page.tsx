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

export default function WordOfTheDayPage() {
  // Esto sería un dato que vendría de una base de datos
  const wordOfTheDay = {
    id: 12,
    word: "Ultracrepidario",
    definition:
      "Dicho de una persona: Que habla o da su opinión en asuntos que desconoce.",
    literaturiaDefinition:
      "El experto de todo en redes sociales que nunca ha experimentado nada de lo que habla.",
    etymology:
      "Del latín 'ultra' (más allá) y 'crepida' (sandalia), aludiendo a la expresión 'zapatero, a tus zapatos'.",
    example:
      "El ultracrepidario de la oficina siempre tiene consejos sobre cómo hacer tu trabajo, aunque nunca ha hecho algo similar.",
    curiosities: [
      "La palabra tiene su origen en una anécdota del pintor griego Apeles, quien aceptó la crítica de un zapatero sobre cómo había pintado unas sandalias, pero cuando este quiso opinar sobre el resto del cuadro, le dijo: 'Zapatero, a tus zapatos'.",
      "Es una de las palabras menos conocidas del español que describe un comportamiento muy común en la era de internet.",
    ],
    category: "Comportamiento",
    votes: 423,
    comments: 37,
  };

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
                <p>{wordOfTheDay.definition}</p>
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
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{wordOfTheDay.votes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{wordOfTheDay.comments}</span>
                  </Button>
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
            {wordOfTheDay.curiosities.map((curiosity, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
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
