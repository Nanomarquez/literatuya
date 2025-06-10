"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createDefinition } from "@/lib/definitions";

const categories = [
  "Palabras bonitas",
  "Comportamiento",
  "Sensaciones",
  "Acciones modernas",
  "Otros",
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CreateDefinitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchingRAE, setSearchingRAE] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    raeDefinition: "",
    literaturiaDefinition: "",
    category: "",
  });

  const debouncedWord = useDebounce(formData.word, 1000);

  const searchRAEDefinition = useCallback(
    async (word: string) => {
      if (!word.trim()) return;

      setSearchingRAE(true);
      try {
        const response = await fetch(
          `/api/rae?word=${encodeURIComponent(word)}`
        );
        const data = await response.json();

        if (data.ok && data.data.meanings && data.data.meanings.length > 0) {
          const firstMeaning = data.data.meanings[0];
          const definition = firstMeaning.senses[0].raw;

          setFormData((prev) => ({
            ...prev,
            raeDefinition: definition,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            raeDefinition: "",
          }));
          toast({
            title: "No encontrado",
            description: "No se encontró la palabra en la RAE",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        setFormData((prev) => ({
          ...prev,
          raeDefinition: "",
        }));
        toast({
          title: "Error",
          description: "Error al buscar en la RAE",
          variant: "destructive",
        });
      } finally {
        setSearchingRAE(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (debouncedWord) {
      searchRAEDefinition(debouncedWord);
    }
  }, [debouncedWord, searchRAEDefinition]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una definición",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Debes seleccionar una categoría",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createDefinition({
        ...formData,
        authorId: user.uid,
        authorName: user.displayName || "Anónimo",
        authorPhoto: user.photoURL || undefined,
        isOfficial: false,
      });

      toast({
        title: "¡Éxito!",
        description: "Tu definición ha sido creada correctamente",
      });

      router.push("/definiciones");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Hubo un error al crear la definición",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      word: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-xl md:text-3xl font-bold mb-8">Crear Nueva Definición</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <label htmlFor="word" className="text-sm font-medium">
              Palabra
            </label>
            <Input
              id="word"
              name="word"
              required
              value={formData.word}
              onChange={handleWordChange}
              placeholder="Escribe la palabra que quieres definir"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="raeDefinition" className="text-sm font-medium">
              Definición RAE {searchingRAE && "(Buscando...)"}
            </label>
            <Textarea
              id="raeDefinition"
              name="raeDefinition"
              value={formData.raeDefinition}
              onChange={handleChange}
              placeholder="La definición de la RAE aparecerá automáticamente si existe"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="literaturiaDefinition"
              className="text-sm font-medium"
            >
              Definición Literatuya
            </label>
            <Textarea
              id="literaturiaDefinition"
              name="literaturiaDefinition"
              required
              value={formData.literaturiaDefinition}
              onChange={handleChange}
              placeholder="Escribe tu definición creativa"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoría
            </label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Definición"}
          </Button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
