"use client";

import { useState, useEffect } from "react";
import { getDefinitions } from "@/lib/definitions";
import {
  getGameStats,
  updateGameStats,
  getTrophies,
  type GameStats,
  type Trophy,
  getGameState,
  updateGameState,
  initializeTrophies,
} from "@/lib/games";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy as TrophyIcon, Star, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface WordOfTheDay {
  word: string;
  raeDefinition?: string;
  literaturiaDefinition: string;
  category: string;
  hints: string[];
}

export default function GuessGamePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState<WordOfTheDay | null>(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts] = useState(5);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [userStats, setUserStats] = useState<GameStats>({
    totalPoints: 0,
    gamesWon: 0,
    streak: 0,
    trophies: 0,
  });
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (!user) {
          toast({
            title: "Error",
            description: "Debes iniciar sesión para jugar",
            variant: "destructive",
          });
          return;
        }

        // Inicializar trofeos base si no existen
        await initializeTrophies();

        // Obtener palabra del día
        const definitions = await getDefinitions({});
        const today = new Date();
        const startDate = new Date("2024-01-01");
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const index = diffDays % definitions.length;
        const wordOfTheDay = definitions[index];

        // Verificar si ya jugó hoy
        const gameState = await getGameState(user.uid);
        if (gameState) {
          setAttempts(gameState.attempts);
          setHintsUsed(gameState.hintsUsed);
          setGameStatus(gameState.gameStatus);
          setPoints(gameState.points);
        }

        // Generar pistas
        const hints = [
          `Tiene ${wordOfTheDay.word.length} letras`,
          `Empieza con '${wordOfTheDay.word[0]}'`,
          `Termina con '${wordOfTheDay.word[wordOfTheDay.word.length - 1]}'`,
          `Categoría: ${wordOfTheDay.category}`,
        ];

        setCurrentWord({
          ...wordOfTheDay,
          hints,
        });

        // Obtener estadísticas del usuario
        const stats = await getGameStats(user.uid);
        setUserStats({
          totalPoints: Number(stats.totalPoints) || 0,
          gamesWon: Number(stats.gamesWon) || 0,
          streak: Number(stats.streak) || 0,
          trophies: Number(stats.trophies) || 0,
        });

        // Obtener trofeos
        const userTrophies = await getTrophies(user.uid);
        setTrophies(userTrophies);

        setLoading(false);
      } catch (error) {
        console.error("Error al inicializar el juego:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el juego",
          variant: "destructive",
        });
      }
    };

    initializeGame();
  }, [user, toast]);

  const handleGuess = async () => {
    if (!user || !currentWord) return;

    if (guess.toLowerCase() === currentWord.word.toLowerCase()) {
      setGameStatus("won");
      const earnedPoints = Math.max(100 - attempts * 10 - hintsUsed * 5, 20);
      setPoints(earnedPoints);

      try {
        const updatedStats = await updateGameStats(
          user.uid,
          earnedPoints,
          true
        );
        setUserStats((prev) => ({
          ...prev,
          totalPoints: Number(updatedStats.totalPoints) || prev.totalPoints,
          gamesWon: Number(updatedStats.gamesWon) || prev.gamesWon,
          streak: Number(updatedStats.streak) || prev.streak,
          lastPlayedDate: updatedStats.lastPlayedDate,
          trophies: prev.trophies,
        }));

        const updatedTrophies = await getTrophies(user.uid);
        setTrophies(updatedTrophies);

        // Guardar estado final del juego
        await updateGameState({
          userId: user.uid,
          wordId: currentWord.word,
          attempts,
          hintsUsed,
          gameStatus: "won",
          points: earnedPoints,
          lastPlayed: new Date().toISOString().split("T")[0],
        });

        toast({
          title: "¡Felicidades!",
          description: `Has ganado ${earnedPoints} puntos`,
        });
      } catch (error) {
        console.error("Error al actualizar estadísticas:", error);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setGameStatus("lost");
        try {
          await updateGameStats(user.uid, 0, false);
          await updateGameState({
            userId: user.uid,
            wordId: currentWord.word,
            attempts: newAttempts,
            hintsUsed,
            gameStatus: "lost",
            points: 0,
            lastPlayed: new Date().toISOString().split("T")[0],
          });
        } catch (error) {
          console.error("Error al actualizar estadísticas:", error);
        }
      } else {
        // Guardar progreso actual
        await updateGameState({
          userId: user.uid,
          wordId: currentWord.word,
          attempts: newAttempts,
          hintsUsed,
          gameStatus,
          points,
          lastPlayed: new Date().toISOString().split("T")[0],
        });
      }
    }
    setGuess("");
  };

  const useHint = async () => {
    if (!user || !currentWord) return;
    if (hintsUsed < currentWord.hints.length) {
      const newHintsUsed = hintsUsed + 1;
      setHintsUsed(newHintsUsed);

      // Guardar progreso actual
      await updateGameState({
        userId: user.uid,
        wordId: currentWord.word,
        attempts,
        hintsUsed: newHintsUsed,
        gameStatus,
        points,
        lastPlayed: new Date().toISOString().split("T")[0],
      });
    }
  };

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

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Adivinanza del día</h1>
            <p className="text-muted-foreground">
              ¡Adivina la palabra y gana puntos!
            </p>
          </div>

          {/* Stats del usuario */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-rose-500">
                  {userStats.totalPoints}
                </div>
                <p className="text-sm text-muted-foreground">Puntos totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {userStats.gamesWon}
                </div>
                <p className="text-sm text-muted-foreground">Juegos ganados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {userStats.streak}
                </div>
                <p className="text-sm text-muted-foreground">Racha actual</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                  <TrophyIcon className="h-5 w-5" />
                  {userStats.trophies}
                </div>
                <p className="text-sm text-muted-foreground">Trofeos</p>
              </CardContent>
            </Card>
          </div>

          {/* Juego principal */}
          <Card>
            <CardHeader>
              <CardTitle>Palabra del día</CardTitle>
              <CardDescription>
                Intentos restantes: {maxAttempts - attempts} | Pistas usadas:{" "}
                {hintsUsed}
              </CardDescription>
              <Progress
                value={(attempts / maxAttempts) * 100}
                className="w-full"
              />
            </CardHeader>
            {!loading && currentWord && (
              <CardContent className="space-y-6">
                {/* Definiciones */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Definición RAE:</h3>
                    <p className="text-muted-foreground">
                      {currentWord.raeDefinition}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Definición Literatuya:
                    </h3>
                    <p className="italic">
                      {currentWord.literaturiaDefinition}
                    </p>
                  </div>
                </div>

                {/* Pistas */}
                {hintsUsed > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Pistas:</h3>
                    {currentWord.hints
                      .slice(0, hintsUsed)
                      .map((hint, index) => (
                        <div
                          key={`hint-${index}-${hint}`}
                          className="flex items-center gap-2"
                        >
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{hint}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Input y botones */}
                {gameStatus === "playing" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        onKeyPress={(e) => e.key === "Enter" && handleGuess()}
                        className="flex-1"
                      />
                      <Button onClick={handleGuess} disabled={!guess.trim()}>
                        Adivinar
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={useHint}
                        disabled={hintsUsed >= currentWord.hints.length}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Usar pista ({hintsUsed}/{currentWord.hints.length})
                      </Button>
                    </div>
                  </div>
                )}

                {/* Resultado */}
                {gameStatus === "won" && (
                  <div className="text-center space-y-4">
                    <div className="text-4xl">🎉</div>
                    <h3 className="text-2xl font-bold text-green-500">
                      ¡Correcto!
                    </h3>
                    <p className="text-lg">
                      La palabra era:{" "}
                      <span className="font-bold">{currentWord.word}</span>
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-semibold">
                        +{points} puntos
                      </span>
                    </div>
                  </div>
                )}

                {gameStatus === "lost" && (
                  <div className="text-center space-y-4">
                    <div className="text-4xl">😔</div>
                    <h3 className="text-2xl font-bold text-red-500">
                      ¡Se acabaron los intentos!
                    </h3>
                    <p className="text-lg">
                      La palabra era:{" "}
                      <span className="font-bold">{currentWord.word}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Trofeos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="h-5 w-5" />
                Trofeos disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trophies.map((trophy) => (
                  <div key={trophy.id} className="text-center space-y-2">
                    <div className="text-3xl">{trophy.icon}</div>
                    <h4 className="font-semibold">{trophy.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {trophy.description}
                    </p>
                    <Badge variant={trophy.unlocked ? "secondary" : "outline"}>
                      {trophy.progress}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
