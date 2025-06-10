"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ThumbsUp, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Definition, getDefinitions } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

export interface DefinitionFilters {
  isOfficial?: boolean;
  trending?: boolean;
  search?: string;
}

export default function DefinitionsPage() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDefinitions = useCallback(async () => {
    try {
      setLoading(true);
      const filters: DefinitionFilters = {};

      switch (activeTab) {
        case "official":
          filters.isOfficial = true;
          break;
        case "community":
          filters.isOfficial = false;
          break;
        case "trending":
          filters.trending = true;
          break;
        // 'all' no necesita filtros
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      const data = await getDefinitions(filters);
      setDefinitions(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las definiciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, toast]);

  useEffect(() => {
    fetchDefinitions();
  }, [fetchDefinitions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between mb-4 flex-col md:flex-row gap-2 items-start md:items-center">
          <h1 className="text-3xl font-bold">Definiciones</h1>
          {user ? (
            <Button asChild>
              <Link href="/definiciones/crear">
                <Plus className="h-4 w-4 mr-2" />
                Crear definición
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Inicia sesión para crear</Link>
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar definiciones..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="space-y-6"
          onValueChange={handleTabChange}
        >
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="official">Oficiales</TabsTrigger>
            <TabsTrigger value="community">Comunidad</TabsTrigger>
            <TabsTrigger value="trending">Tendencia</TabsTrigger>
          </TabsList>

          <TabsContent
            value={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {loading ? (
              <Loader />
            ) : definitions.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No se encontraron definiciones
              </div>
            ) : (
              definitions.map((def) => (
                <DefinitionCard key={def.id} definition={def} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}

function DefinitionCard({ definition }: { definition: Definition }) {
  return (
    <Link href={`/palabra/${definition.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{definition.word}</CardTitle>
              <CardDescription>Por {definition.authorName}</CardDescription>
            </div>
            <div className="flex gap-2">
              {definition.isOfficial ? (
                <Badge variant="default">Oficial</Badge>
              ) : (
                <Badge variant="secondary">Comunidad</Badge>
              )}
              <Badge variant="outline">{definition.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {definition.raeDefinition && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">RAE:</span>{" "}
              {definition.raeDefinition}
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Literatuya:</span>{" "}
            {definition.literaturiaDefinition}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {definition.votes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {definition.comments}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
