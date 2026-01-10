import { getScriptures } from "@/actions/scriptures";
import dynamic from "next/dynamic";

// Desactivar SSR para estos componentes que usan HeroUI Modal/Overlays
const GalacticNavigator = dynamic(
  () => import("@/components/GalacticNavigator").then(mod => ({ default: mod.GalacticNavigator })),
  { ssr: false }
);

// ... imports
import { Metadata } from "next";

// ... existing dynamic imports

const KineticBible = dynamic(
  () => import("@/components/KineticBible"),
  { ssr: false }
);

const TimelineSidebar = dynamic(
  () => import("@/components/TimelineSidebar").then(mod => ({ default: mod.TimelineSidebar })),
  { ssr: false }
);

type Props = {
  params: { slug: string };
  searchParams: { book?: string; chapter?: string; verse?: string };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const book = searchParams.book;
  const chapter = searchParams.chapter ? parseInt(searchParams.chapter) : undefined;
  const verse = searchParams.verse ? parseInt(searchParams.verse) : undefined;

  let title = "The Living Word - Biblia Espacial";
  let description = "Navega a través de la Biblia en una experiencia 3D dinámica y espacial.";
  let ogImage = "/icon.png"; // Default image

  if (book && chapter && verse) {
    const scriptures = await getScriptures({
      book,
      chapter,
      pageSize: 100 // We fetch the chapter, but we find the verse
    });

    const targetVerse = scriptures.find(s => s.verse_number === verse);

    if (targetVerse) {
      title = `${targetVerse.book_name} ${targetVerse.chapter}:${targetVerse.verse_number} - La Biblia 3D`;
      description = targetVerse.content;

      // Construct dynamic OG Image URL
      const params = new URLSearchParams();
      params.set('book', targetVerse.book_name);
      params.set('chapter', targetVerse.chapter.toString());
      params.set('verse', targetVerse.verse_number.toString());
      params.set('text', targetVerse.content);

      // Use an absolute URL if possible, or relative if deployed on same domain
      // Since this runs on server, we can use process.env.NEXT_PUBLIC_SITE_URL or similar if defined, 
      // OR just rely on Next.js resolving absolute URLs for metadata images automatically if we return a relative path starting with /
      // But for OpenGraph, full URLs are safer. Let's assume standard Next.js behavior relative to base.
      ogImage = `/api/og?${params.toString()}`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { book?: string; chapter?: string; verse?: string };
}) {
  const book = searchParams.book;
  const chapter = searchParams.chapter ? parseInt(searchParams.chapter) : undefined;
  const verse = searchParams.verse ? parseInt(searchParams.verse) : undefined;

  const initialVerses = await getScriptures({
    book,
    chapter,
    pageSize: 100
  });

  return (
    <div className="bg-black text-white selection:bg-gold/30 min-h-dvh">
      <GalacticNavigator />
      <TimelineSidebar />
      {/* AudioController moved inside KineticBible for state access */}

      {initialVerses.length > 0 ? (
        <KineticBible initialVerses={initialVerses} targetVerse={verse} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center gap-6">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-serif tracking-tighter text-white/20">The Living Word</h1>
            <p className="text-zinc-500 italic">Esperando que la luz se manifieste...</p>
          </div>

          <div className="max-w-md p-6 border border-white/5 bg-white/5 rounded-2xl backdrop-blur-xl text-sm text-zinc-400">
            <p>
              Para comenzar, asegúrate de haber ejecutado el script SQL en Supabase y de tener los
              datos cargados en la tabla <code className="text-gold/80">scriptures</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
