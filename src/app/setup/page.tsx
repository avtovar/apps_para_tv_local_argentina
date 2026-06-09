"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import sampleData from "../../../skills/argentina-tv-manager/assets/sample_data.json";
import type { Channel, Province } from "@/types";

type SampleData = {
  provinces: Province[];
  channels: Channel[];
};

const setupData = sampleData as SampleData;

export default function SetupPage() {
  const [status, setStatus] = useState("Esperando para iniciar...");

  const runSetup = async () => {
    setStatus("Subiendo datos a Firestore...");
    try {
      if (!db) {
        throw new Error("Firestore no está inicializado.");
      }

      // Subir Provincias
      for (const province of setupData.provinces) {
        await setDoc(doc(db, "provinces", province.id), province);
        setStatus(`Provincia subida: ${province.name}`);
      }

      // Subir Canales
      for (const channel of setupData.channels) {
        await setDoc(doc(db, "channels", channel.id), channel);
        setStatus(`Canal subido: ${channel.name}`);
      }

      setStatus("✅ Setup completado con éxito. Ya puedes ir al Explorer.");
    } catch (error: unknown) {
      console.error(error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Firestore Initial Setup</h1>
      <p className="mb-8 text-gray-400 max-w-md text-center">
        Este script subirá los canales y provincias de ejemplo a tu instancia de Firebase. 
        Asegúrate de tener configuradas las variables de entorno.
      </p>
      <button 
        onClick={runSetup}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition-all"
      >
        Ejecutar Setup
      </button>
      <div className="mt-10 p-4 bg-gray-900 rounded border border-gray-800 w-full max-w-lg overflow-hidden text-sm font-mono">
        {status}
      </div>
    </div>
  );
}
