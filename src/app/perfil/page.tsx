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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, ThumbsUp, Edit } from "lucide-react";

export default function ProfilePage() {
  // Estos serían datos que vendrían de una base de datos
  const userProfile = {
    name: "María García",
    username: "@maria_garcia",
    email: "maria@ejemplo.com",
    joinDate: "Marzo 2024",
    bio: "Amante de las palabras y los juegos de ingenio. Siempre buscando nuevas formas de expresar ideas.",
    stats: {
      totalPoints: 1250,
      gamesWon: 23,
      streak: 5,
      trophies: 3,
      definitionsCreated: 12,
      commentsPosted: 45,
      likesReceived: 234,
    },
    recentActivity: [
      {
        id: 1,
        type: "definition",
        content: "Creó la definición de 'Procrastinear'",
        date: "Hace 2 días",
        points: 25,
      },
      {
        id: 2,
        type: "game",
        content: "Ganó la adivinanza del día",
        date: "Hace 3 días",
        points: 85,
      },
      {
        id: 3,
        type: "comment",
        content: "Comentó en 'Serendipia'",
        date: "Hace 5 días",
        points: 5,
      },
    ],
    achievements: [
      {
        id: 1,
        name: "Principiante",
        description: "Gana 10 juegos",
        icon: "🥉",
        unlocked: true,
        date: "15 Mar 2024",
      },
      {
        id: 2,
        name: "Creador",
        description: "Crea 10 definiciones",
        icon: "✍️",
        unlocked: true,
        date: "20 Mar 2024",
      },
      {
        id: 3,
        name: "Popular",
        description: "Recibe 100 likes",
        icon: "❤️",
        unlocked: true,
        date: "25 Mar 2024",
      },
      {
        id: 4,
        name: "Experto",
        description: "Gana 25 juegos",
        icon: "🥈",
        unlocked: false,
        progress: "23/25",
      },
    ],
    favoriteDefinitions: [
      {
        id: 1,
        word: "Serendipia",
        author: "Carlos Ruiz",
        likes: 342,
      },
      {
        id: 2,
        word: "Petricor",
        author: "Ana López",
        likes: 256,
      },
    ],
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header del perfil */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">MG</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                    <p className="text-muted-foreground">
                      {userProfile.username}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Se unió en {userProfile.joinDate}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{userProfile.bio}</p>

                  {/* Stats rápidas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-500">
                        {userProfile.stats.totalPoints}
                      </div>
                      <p className="text-sm text-muted-foreground">Puntos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {userProfile.stats.gamesWon}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Juegos ganados
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {userProfile.stats.streak}
                      </div>
                      <p className="text-sm text-muted-foreground">Racha</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {userProfile.stats.trophies}
                      </div>
                      <p className="text-sm text-muted-foreground">Trofeos</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs del perfil */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activity">Actividad</TabsTrigger>
              <TabsTrigger value="achievements">Logros</TabsTrigger>
              <TabsTrigger value="definitions">Definiciones</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad reciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {activity.type === "definition" && "📝"}
                          {activity.type === "game" && "🎮"}
                          {activity.type === "comment" && "💬"}
                        </div>
                        <div>
                          <p className="font-medium">{activity.content}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">+{activity.points} pts</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logros y trofeos</CardTitle>
                  <CardDescription>
                    {userProfile.achievements.filter((a) => a.unlocked).length}{" "}
                    de {userProfile.achievements.length} logros desbloqueados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${
                          achievement.unlocked
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {achievement.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            {achievement.unlocked ? (
                              <p className="text-xs text-green-600">
                                Desbloqueado el {achievement.date}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                Progreso: {achievement.progress}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="definitions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis definiciones</CardTitle>
                  <CardDescription>
                    {userProfile.stats.definitionsCreated} definiciones creadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aquí aparecerán las definiciones que has creado</p>
                    <Button className="mt-4">Crear nueva definición</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Definiciones favoritas</CardTitle>
                  <CardDescription>
                    Palabras que has marcado como favoritas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.favoriteDefinitions.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{fav.word}</h3>
                        <p className="text-sm text-muted-foreground">
                          Por {fav.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        {fav.likes}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
