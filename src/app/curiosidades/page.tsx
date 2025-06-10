import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CuriositiesPage() {
  // Estos serían datos que vendrían de una base de datos
  const curiosities = [
    {
      id: 1,
      title: "Palabras intraducibles",
      content:
        "Existen palabras en otros idiomas que no tienen una traducción directa al español. Por ejemplo, 'hygge' en danés describe un sentimiento de comodidad, calidez y bienestar.",
      category: "Idiomas",
      likes: 245,
    },
    {
      id: 2,
      title: "El origen de 'OK'",
      content:
        "La expresión 'OK' surgió en el siglo XIX como una abreviatura humorística de 'oll korrect', una forma incorrecta de escribir 'all correct' (todo correcto).",
      category: "Etimología",
      likes: 189,
    },
    {
      id: 3,
      title: "La palabra más larga",
      content:
        "La palabra más larga aceptada por la RAE es 'electroencefalografista', con 23 letras. Sin embargo, existen términos técnicos mucho más largos.",
      category: "Récords",
      likes: 176,
    },
    {
      id: 4,
      title: "Palabras que cambiaron de significado",
      content:
        "La palabra 'villano' originalmente significaba 'habitante de una villa' sin connotación negativa. Con el tiempo, adquirió el significado de persona ruin o malvada.",
      category: "Evolución",
      likes: 154,
    },
    {
      id: 5,
      title: "Palíndromos famosos",
      content:
        "Un palíndromo es una palabra o frase que se lee igual de izquierda a derecha que de derecha a izquierda. Ejemplos en español: 'reconocer', 'anilina', 'somos'.",
      category: "Juegos de palabras",
      likes: 132,
    },
    {
      id: 6,
      title: "La letra más usada",
      content:
        "En español, la letra más frecuente es la 'e', seguida por la 'a' y la 'o'. La menos frecuente es la 'w'.",
      category: "Estadísticas",
      likes: 118,
    },
    {
      id: 7,
      title: "Palabras inventadas que se volvieron oficiales",
      content:
        "La palabra 'robot' fue inventada por el escritor checo Karel Čapek en su obra de teatro R.U.R. en 1920. Proviene de 'robota', que significa 'trabajo forzado'.",
      category: "Neologismos",
      likes: 203,
    },
    {
      id: 8,
      title: "El español y sus dialectos",
      content:
        "El español tiene más de 20 dialectos principales distribuidos por todo el mundo, cada uno con sus propias expresiones y particularidades.",
      category: "Dialectología",
      likes: 167,
    },
  ];

  const categories = Array.from(
    new Set(curiosities.map((item) => item.category))
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">
          Curiosidades literarias
        </h1>

        <Tabs defaultValue="all" className="max-w-4xl mx-auto">
          <TabsList className="mb-6 flex flex-wrap justify-center">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {curiosities.map((curiosity) => (
              <CuriosityCard key={curiosity.id} curiosity={curiosity} />
            ))}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {curiosities
                .filter((c) => c.category === category)
                .map((curiosity) => (
                  <CuriosityCard key={curiosity.id} curiosity={curiosity} />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}

function CuriosityCard({
  curiosity,
}: {
  curiosity: {
    id: number;
    title: string;
    content: string;
    category: string;
    likes: number;
  };
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{curiosity.title}</CardTitle>
          {/* <Badge variant="outline">{curiosity.likes} ❤️</Badge> */}
        </div>
        <CardDescription>{curiosity.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{curiosity.content}</p>
      </CardContent>
    </Card>
  );
}
