import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TrendingWords() {
  // Estos serían datos que vendrían de una base de datos
  const trendingWords = [
    {
      id: 1,
      word: "Serendipia",
      definition:
        "Hallazgo valioso que se produce de manera accidental o casual.",
      literaturiaDefinition:
        "Ese momento mágico cuando encuentras algo genial sin buscarlo, como cuando buscas calcetines y encuentras dinero.",
      category: "Palabras bonitas",
      votes: 342,
    },
    {
      id: 2,
      word: "Petricor",
      definition: "Olor que produce la lluvia al caer en suelos secos.",
      literaturiaDefinition:
        "El perfume natural que la tierra regala cuando la lluvia la besa después de mucho tiempo.",
      category: "Sensaciones",
      votes: 289,
    },
    {
      id: 3,
      word: "Nefelibata",
      definition: "Persona soñadora que no se apercibe de la realidad.",
      literaturiaDefinition:
        "Alguien que vive entre nubes de imaginación mientras el mundo sigue su curso abajo.",
      category: "Personalidad",
      votes: 256,
    },
    {
      id: 4,
      word: "Melifluo",
      definition: "Sonido excesivamente dulce, suave o delicado.",
      literaturiaDefinition:
        "Palabras que suenan tan bien al oído que casi puedes saborear su dulzura.",
      category: "Sonidos",
      votes: 231,
    },
    {
      id: 5,
      word: "Sempiterno",
      definition:
        "Que durará siempre; que, habiendo tenido principio, no tendrá fin.",
      literaturiaDefinition:
        "Como el amor de una madre o la última temporada de una serie que nunca termina.",
      category: "Tiempo",
      votes: 198,
    },
    {
      id: 6,
      word: "Inefable",
      definition: "Que no puede explicarse con palabras.",
      literaturiaDefinition:
        "Cuando intentas explicar algo y terminas diciendo 'es que no sé cómo explicarlo'.",
      category: "Emociones",
      votes: 187,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trendingWords.map((word) => (
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
                <span className="font-semibold">RAE:</span> {word.definition}
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
