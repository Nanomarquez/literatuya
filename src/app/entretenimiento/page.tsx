"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Play, RotateCcw } from "lucide-react";

export default function EntertainmentPage() {
  const [selectedTrivia, setSelectedTrivia] = useState<{
    id: number;
    name: string;
    description: string;
    difficulty: string;
    questions: number;
    timePerQuestion: number;
    icon: string;
  } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState<"menu" | "playing" | "finished">(
    "menu"
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const triviaCategories = [
    {
      id: 1,
      name: "Palabras raras",
      description: "Pon a prueba tu conocimiento de palabras poco comunes",
      difficulty: "Fácil",
      questions: 10,
      timePerQuestion: 30,
      icon: "🤔",
    },
    {
      id: 2,
      name: "Etimología",
      description: "Descubre el origen de las palabras",
      difficulty: "Medio",
      questions: 15,
      timePerQuestion: 25,
      icon: "📚",
    },
    {
      id: 3,
      name: "Sinónimos y antónimos",
      description: "Encuentra las palabras relacionadas",
      difficulty: "Fácil",
      questions: 12,
      timePerQuestion: 20,
      icon: "🔄",
    },
    {
      id: 4,
      name: "Definiciones creativas",
      description: "Adivina la palabra por su definición Literatuya",
      difficulty: "Difícil",
      questions: 8,
      timePerQuestion: 35,
      icon: "🎨",
    },
  ];

  const sampleQuestions = [
    {
      question: "¿Qué significa la palabra 'petricor'?",
      options: [
        "Miedo a las piedras",
        "Olor que produce la lluvia al caer en suelos secos",
        "Tipo de roca volcánica",
        "Sonido del viento entre las rocas",
      ],
      correct: 1,
      explanation:
        "Petricor es el olor característico que se produce cuando llueve sobre tierra seca.",
    },
    {
      question: "¿Cuál es el origen de la palabra 'serendipia'?",
      options: [
        "Del latín 'serenus' (sereno)",
        "Del cuento 'Los tres príncipes de Serendip'",
        "Del griego 'serendiptos' (casualidad)",
        "Del árabe 'sarandib' (isla)",
      ],
      correct: 1,
      explanation:
        "La palabra proviene del cuento persa 'Los tres príncipes de Serendip', donde los protagonistas hacían descubrimientos por casualidad.",
    },
    {
      question: "Según Literatuya, ¿qué es 'procrastinear'?",
      options: [
        "Trabajar muy rápido",
        "El arte de convertir 'lo haré en 5 minutos' en 'algún día'",
        "Hacer varias tareas a la vez",
        "Planificar con anticipación",
      ],
      correct: 1,
      explanation:
        "En Literatuya, 'procrastinear' describe humorísticamente el hábito de postergar tareas indefinidamente.",
    },
  ];

  const handleTimeUp = useCallback(() => {
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion + 1 < sampleQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(selectedTrivia?.timePerQuestion || 0);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameStatus("finished");
      }
    }, 2000);
  }, [
    currentQuestion,
    sampleQuestions.length,
    selectedTrivia?.timePerQuestion,
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === "playing" && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStatus, showResult, handleTimeUp]);

  const startTrivia = (trivia: {
    id: number;
    name: string;
    description: string;
    difficulty: string;
    questions: number;
    timePerQuestion: number;
    icon: string;
  }) => {
    setSelectedTrivia(trivia);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(trivia.timePerQuestion);
    setGameStatus("playing");
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === sampleQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < sampleQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(selectedTrivia?.timePerQuestion || 0);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameStatus("finished");
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameStatus("menu");
    setSelectedTrivia(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (gameStatus === "menu") {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Entretenimiento</h1>
              <p className="text-muted-foreground">
                Pon a prueba tus conocimientos con nuestras trivias por tiempo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {triviaCategories.map((trivia) => (
                <Card
                  key={trivia.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{trivia.icon}</span>
                        <div>
                          <CardTitle>{trivia.name}</CardTitle>
                          <CardDescription>
                            {trivia.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          trivia.difficulty === "Fácil"
                            ? "secondary"
                            : trivia.difficulty === "Medio"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {trivia.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{trivia.questions} preguntas</span>
                      <span>{trivia.timePerQuestion}s por pregunta</span>
                    </div>
                    <Button
                      onClick={() => startTrivia(trivia)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar trivia
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Mejores puntuaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "María García",
                      score: "95%",
                      category: "Palabras raras",
                    },
                    {
                      name: "Carlos Ruiz",
                      score: "88%",
                      category: "Etimología",
                    },
                    { name: "Ana López", score: "92%", category: "Sinónimos" },
                  ].map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{entry.score}</Badge>
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

  if (gameStatus === "playing") {
    const question = sampleQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header del juego */}
            <div className="flex justify-between items-center">
              <Badge variant="outline">{selectedTrivia?.name}</Badge>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span
                  className={`font-bold ${
                    timeLeft <= 10 ? "text-red-500" : ""
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Pregunta {currentQuestion + 1} de {sampleQuestions.length}
                </span>
                <span>
                  Puntuación: {score}/{currentQuestion + (showResult ? 1 : 0)}
                </span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Pregunta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showResult
                        ? index === question.correct
                          ? "default"
                          : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                        : selectedAnswer === index
                        ? "secondary"
                        : "outline"
                    }
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                  >
                    <span className="mr-3 font-bold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}

                {showResult && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">Explicación:</span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (gameStatus === "finished") {
    const percentage = Math.round((score / sampleQuestions.length) * 100);

    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardContent className="pt-6 text-center space-y-6">
                <div className="text-6xl">
                  {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : "😊"}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    ¡Trivia completada!
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedTrivia?.name}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-4xl font-bold text-rose-500">
                    {score}/{sampleQuestions.length}
                  </div>
                  <div className="text-2xl font-semibold">
                    {percentage}% de aciertos
                  </div>

                  <div className="flex justify-center">
                    <Badge
                      variant={
                        percentage >= 80
                          ? "default"
                          : percentage >= 60
                          ? "secondary"
                          : "outline"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {percentage >= 80
                        ? "¡Excelente!"
                        : percentage >= 60
                        ? "¡Bien hecho!"
                        : "¡Sigue practicando!"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Volver al menú
                  </Button>
                  <Button
                    onClick={() =>
                      startTrivia(selectedTrivia || triviaCategories[0])
                    }
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Jugar de nuevo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return null;
}
