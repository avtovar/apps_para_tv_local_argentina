import { tv } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold flex items-center gap-4">
          Argentina TV <span className="text-blue-500">Live</span>
        </h1>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500" tabIndex={0}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Buenos Aires</h2>
          <p className="text-gray-400">Canales de la capital y provincia.</p>
        </div>
        <div className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500" tabIndex={0}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Córdoba</h2>
          <p className="text-gray-400">Toda la programación cordobesa.</p>
        </div>
        <div className="p-8 border border-gray-800 rounded-xl bg-gray-900/50 hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500" tabIndex={0}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Santa Fe</h2>
          <p className="text-gray-400">Lo mejor del Litoral.</p>
        </div>
      </div>
    </main>
  );
}
