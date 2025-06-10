"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
// import { ThumbsUp, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Definition,
  voteDefinition,
  addComment,
  getDefinition,
  getComments,
  hasUserVoted,
} from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: string;
  definitionId: string;
}

export default function DefinitionPage() {
  const { id } = useParams();
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const def = await getDefinition(id as string);
        setDefinition(def);
        const coms = await getComments(id as string);
        setComments(coms);

        // Verificar si el usuario ya votó
        if (user) {
          const voted = await hasUserVoted(id as string, user.uid);
          setHasVoted(voted);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "No se pudo cargar la definición",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [id, toast, user]);

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    try {
      const voted = await voteDefinition(id as string, user.uid);
      if (definition) {
        setDefinition({
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
            definitionId: id as string,
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

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentId = await addComment(id as string, newComment, user);
      const newCommentObj: Comment = {
        id: commentId,
        content: newComment,
        userId: user.uid,
        userName: user.displayName || "Anónimo",
        userPhoto: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        definitionId: id as string,
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      if (definition) {
        setDefinition({
          ...definition,
          comments: definition.comments + 1,
        });

        // Crear notificación para el autor de la definición
        if (definition.authorId !== user.uid) {
          const notificationsRef = collection(db, "notifications");
          await addDoc(notificationsRef, {
            type: "comment",
            message: `${
              user.displayName || "Alguien"
            } comentó en tu definición de "${definition.word}"`,
            read: false,
            createdAt: new Date().toISOString(),
            userId: definition.authorId,
            definitionId: id as string,
          });
        }
      }
      toast({
        title: "¡Comentario publicado!",
        description: "Tu comentario ha sido publicado correctamente",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo publicar tu comentario",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!definition) {
    return <div>Definición no encontrada</div>;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {definition.word}
                </CardTitle>
                <div className="flex gap-2 mb-4">
                  {definition.isOfficial ? (
                    <Badge variant="default">Oficial</Badge>
                  ) : (
                    <Badge variant="secondary">Comunidad</Badge>
                  )}
                  <Badge variant="outline">{definition.category}</Badge>
                </div>
              </div>
              <Button
                variant={hasVoted ? "default" : "outline"}
                size="sm"
                onClick={handleVote}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {definition.votes}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {definition.raeDefinition && (
              <div>
                <h3 className="font-semibold mb-2">Definición RAE:</h3>
                <p className="text-muted-foreground">
                  {definition.raeDefinition}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Definición Literatuya:</h3>
              <p>{definition.literaturiaDefinition}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={definition.authorPhoto} />
                <AvatarFallback>{definition.authorName[0]}</AvatarFallback>
              </Avatar>
              <span>Por {definition.authorName}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            Comentarios ({comments.length})
          </h2>

          {user && (
            <form onSubmit={handleComment} className="space-y-4">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit">Publicar comentario</Button>
            </form>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={comment.userPhoto} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {comment.userName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
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
