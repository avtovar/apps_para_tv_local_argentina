# Argentina TV Live

Aplicación web para ver canales de TV argentinos en vivo. Noticias, entretenimiento y más desde todas las provincias.

## Canales disponibles

| Canal | Provincia | Fuentes |
|-------|-----------|---------|
| TV Pública | Buenos Aires | Señal directa |
| A24 | Buenos Aires | Señal directa + YouTube |
| C5N | Buenos Aires | Señal directa + YouTube |
| Crónica TV | Buenos Aires | Señal directa + YouTube |
| TN | Buenos Aires | Señal directa + YouTube |
| Telefe | Buenos Aires | Señal directa |
| Canal 10 | Córdoba | Señal directa |
| Canal 12 | Córdoba | Señal directa |
| Canal 3 Rosario | Santa Fe | Señal directa |
| Canal 9 Litoral | Santa Fe | Señal directa |
| Canal 7 | Mendoza | Señal directa |
| Canal 11 Paraná | Entre Ríos | Señal directa |
| Canal 10 | Tucumán | Señal directa |

## Cómo ejecutar

### Requisitos

- Node.js 18+
- npm

### Pasos

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost    :3000](http://localhost:3000) en el navegador.

4. Navegar a **Explorar Canales** para ver la grilla.

### Variables de entorno (opcionales)

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | API Key de YouTube Data API v3 para obtener info de streams |
| `NEXT_PUBLIC_TVPLAN_API_KEY` | API Key de tv-plan.org para guía de programación (EPG) |
| `NEXT_PUBLIC_FIREBASE_*` | Configuración de Firebase para auth (opcional) |

Sin las variables de entorno la app funciona en **modo demo** con datos de ejemplo.

### Build de producción

```bash
npm run build
npm start
```

## Funcionalidades

- Grilla de canales por provincia
- Reproductor de video con soporte HLS
- Alternativa YouTube para canales que transmiten en ambas plataformas
- Navegación por teclado (flechas + Enter) para TV remoto
- Guía de programación (EPG) vía tv-plan.org

## Stack

- [Next.js](https://nextjs.org) 16
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Video.js](https://videojs.com)
- [Firebase](https://firebase.google.com) (opcional)
- [Lucide Icons](https://lucide.dev)
