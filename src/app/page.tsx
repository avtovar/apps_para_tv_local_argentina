import { Tv, Radio } from "lucide-react";
import { YouTubeIcon } from "@/components/YouTubeIcon";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold flex items-center gap-4">
          Argentina TV <span className="text-blue-500">Live</span>
        </h1>
      </div>

      <p className="mt-6 text-gray-400 text-center max-w-lg">
        Mirá los canales de TV argentinos en vivo. Noticias, entretenimiento y más desde todas las provincias.
        Canales con transmisión vía <YouTubeIcon className="w-4 h-4 inline text-red-500" /> YouTube y señal directa.
      </p>

      <Link
        href="/explorer"
        className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 inline-flex items-center gap-3"
      >
        <Tv className="w-6 h-6" />
        Explorar Canales
      </Link>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/explorer" className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Buenos Aires</h2>
          <p className="text-gray-400">A24, C5N, TN, Telefe, Crónica TV y más.</p>
        </Link>
        <Link href="/explorer" className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Córdoba</h2>
          <p className="text-gray-400">Canal 10, Canal 12 y toda la programación cordobesa.</p>
        </Link>
        <Link href="/explorer" className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Santa Fe</h2>
          <p className="text-gray-400">Canal 3 Rosario, Canal 9 Litoral y más.</p>
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1"><YouTubeIcon className="w-4 h-4 text-red-500" /> YouTube</span>
        <span className="flex items-center gap-1"><Radio className="w-4 h-4 text-blue-500" /> Señal Directa</span>
      </div>
    </main>
  );
}
