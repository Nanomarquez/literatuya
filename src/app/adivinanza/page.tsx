"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Lightbulb } from "lucide-react"

export default function GuessGamePage() {
  const [currentWord, setCurrentWord] = useState({
    id: 1,
    word: "SERENDIPIA",
    definition: "Hallazgo valioso que se produce de manera accidental o casual.",
    literaturiaDefinition:
      "Ese momento mágico cuando encuentras algo genial sin buscarlo, como cuando buscas calcetines y encuentras dinero.",
    hints: ["Tiene 10 letras", "Empieza con 'S'", "Relacionado con descubrimientos casuales", "Termina con 'A'"],
  })

  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts] = useState(5)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [hintsUsed, setHintsUsed] = useState(0)
  const [points, setPoints] = useState(0)
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    gamesWon: 23,
    streak: 5,
    trophies: 3,
  })

  const handleGuess = () => {
    if (guess.toLowerCase() === currentWord.word.toLowerCase()) {
      setGameStatus("won")
      const earnedPoints = Math.max(100 - attempts * 10 - hintsUsed * 5, 20)
      setPoints(earnedPoints)
      setUserStats((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + earnedPoints,
        gamesWon: prev.gamesWon + 1,
        streak: prev.streak + 1,
      }))
    } else {
      setAttempts((prev) => prev + 1)
      if (attempts + 1 >= maxAttempts) {
        setGameStatus("lost")
      }
    }
    setGuess("")
  }

  const useHint = () => {
    if (hintsUsed < currentWord.hints.length) {
      setHintsUsed((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    setGuess("")
    setAttempts(0)
    setGameStatus("playing")
    setHintsUsed(0)
    setPoints(0)
    setCurrentWord({
      id: 2,
      word: "NUEVA_PALABRA",
      definition: "Nueva definición",
      literaturiaDefinition: "Nueva definición literatuya",
      hints: ["Nueva pista 1", "Nueva pista 2", "Nueva pista 3", "Nueva pista 4"]
    })
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Adivinanza del día</h1>
            <p className="text-muted-foreground">¡Adivina la palabra y gana puntos!</p>
          </div>

          {/* Stats del usuario */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-rose-500">{userStats.totalPoints}</div>
                <p className="text-sm text-muted-foreground">Puntos totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-500">{userStats.gamesWon}</div>
                <p className="text-sm text-muted-foreground">Juegos ganados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-500">{userStats.streak}</div>
                <p className="text-sm text-muted-foreground">Racha actual</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                  <Trophy className="h-5 w-5" />
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
                Intentos restantes: {maxAttempts - attempts} | Pistas usadas: {hintsUsed}
              </CardDescription>
              <Progress value={(attempts / maxAttempts) * 100} className="w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Definiciones */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Definición RAE:</h3>
                  <p className="text-muted-foreground">{currentWord.definition}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Definición Literatuya:</h3>
                  <p className="italic">{currentWord.literaturiaDefinition}</p>
                </div>
              </div>

              {/* Pistas */}
              {hintsUsed > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Pistas:</h3>
                  {currentWord.hints.slice(0, hintsUsed).map((hint, index) => (
                    <div key={index} className="flex items-center gap-2">
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
                    <Button variant="outline" onClick={useHint} disabled={hintsUsed >= currentWord.hints.length}>
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
                  <h3 className="text-2xl font-bold text-green-500">¡Correcto!</h3>
                  <p className="text-lg">
                    La palabra era: <span className="font-bold">{currentWord.word}</span>
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-lg font-semibold">+{points} puntos</span>
                  </div>
                  <Button onClick={resetGame}>Jugar de nuevo mañana</Button>
                </div>
              )}

              {gameStatus === "lost" && (
                <div className="text-center space-y-4">
                  <div className="text-4xl">😔</div>
                  <h3 className="text-2xl font-bold text-red-500">¡Se acabaron los intentos!</h3>
                  <p className="text-lg">
                    La palabra era: <span className="font-bold">{currentWord.word}</span>
                  </p>
                  <Button onClick={resetGame}>Intentar mañana</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trofeos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Trofeos disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🥉</div>
                  <h4 className="font-semibold">Principiante</h4>
                  <p className="text-sm text-muted-foreground">Gana 10 juegos</p>
                  <Badge variant="secondary">Desbloqueado</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🥈</div>
                  <h4 className="font-semibold">Experto</h4>
                  <p className="text-sm text-muted-foreground">Gana 25 juegos</p>
                  <Badge variant="outline">2/25</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🥇</div>
                  <h4 className="font-semibold">Maestro</h4>
                  <p className="text-sm text-muted-foreground">Gana 50 juegos</p>
                  <Badge variant="outline">2/50</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
