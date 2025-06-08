import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex-1 container mx-auto p-4 flex items-center justify-between">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Literatuya. Todos los derechos
            reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/sobre-nosotros"
            className="text-sm text-muted-foreground hover:underline"
          >
            Sobre Nosotros
          </Link>
          <Link
            href="/terminos"
            className="text-sm text-muted-foreground hover:underline"
          >
            Términos
          </Link>
          <Link
            href="/privacidad"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacidad
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
