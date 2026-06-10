# 🚀 Guía de Uso de Agentes Globales

Esta guía explica cómo llamar y utilizar los **217 agentes especializados** que acabamos de instalar globalmente en tu sistema. Ahora puedes invocarlos desde **cualquier repositorio o carpeta** en tu disco `F:` (o cualquier otro) sin necesidad de copiar archivos.

---

## 🎭 1. Gemini CLI / Antigravity
Los agentes se han instalado como "Skills" (habilidades) globales.

*   **Cómo llamarlos:** Usa el prefijo `@agency-` seguido del identificador del agente.
*   **Ejemplos de comandos:**
    *   `@agency-frontend-developer crea un botón animado con Tailwind`
    *   `@agency-backend-architect diseña el esquema de base de datos para un e-commerce`
    *   `@agency-security-architect revisa este código en busca de vulnerabilidades`
*   **Para ver todos los disponibles:**
    *   Ejecuta: `gemini list-skills` (o el comando equivalente de listado en tu versión).

---

## 🤖 2. Claude Code
Claude detectará automáticamente los agentes instalados en tu perfil de usuario.

*   **Cómo llamarlos:** Menciona el nombre del rol en lenguaje natural durante tu sesión de Claude.
*   **Ejemplos:**
    *   *"Claude, actúa como **Senior Developer** y refactoriza este controlador."*
    *   *"Usa el agente **DevOps Automator** para crear un pipeline de GitHub Actions."*
    *   *"Activa el modo **Technical Writer** y documenta esta función."*

---

## 💻 3. GitHub Copilot
Los agentes están disponibles en las carpetas de configuración global de Copilot.

*   **Cómo llamarlos:** En el chat de Copilot (VS Code), puedes referenciarlos directamente.
*   **Uso:** Copilot lee los archivos `.md` en `~/.copilot/agents/` para entender el contexto y las reglas del experto que elijas. Simplemente dile: *"Usa las reglas de **Software Architect** para este proyecto"*.

---

## 📂 Ubicación de los archivos (Backup)
Por si necesitas editarlos o agregar nuevos manualmente, se encuentran aquí:
*   **Gemini:** `C:\Users\avtov\.gemini\agents` y `C:\Users\avtov\.gemini\antigravity\skills`
*   **Claude:** `C:\Users\avtov\.claude\agents`
*   **Copilot:** `C:\Users\avtov\.copilot\agents`

---

## 🛠️ Cómo agregar nuevos agentes en el futuro
Si descargas o creas un nuevo agente en esta carpeta (`F:\Agentes_ia`), puedes volver a pedirme que ejecute la "instalación global" para que los nuevos también estén disponibles en todo tu sistema.

---

## 🏛️ Especializaciones Disponibles (Divisiones)
Puedes llamar agentes de cualquiera de estas categorías (usa el nombre de la categoría para buscar en tus carpetas globales):

| División | Áreas de Especialidad |
| :--- | :--- |
| **💻 Engineering** | Backend, Frontend, DevOps, AI, Blockchain, Mobile, SRE. |
| **🧪 Testing** | QA, API Testing, Performance, Accesibilidad, Auditoría. |
| **🛡️ Security** | Arquitectura de Seguridad, AppSec, Pentesting, Incident Response. |
| **📢 Marketing** | SEO, Growth Hacking, Redes Sociales (TikTok, LinkedIn, etc.), Contenido. |
| **🎨 Design** | UX/UI, Arquitectura de Información, Branding, Whimsy Injector. |
| **🌍 GIS** | Mapas, GeoAI, Análisis Espacial, BIM, WebGIS. |
| **💼 Sales** | Outbound, Discovery, Deal Strategy, Sales Engineering. |
| **📊 Product** | Priorización, Gestión de Feedback, Behavioral Nudges. |
| **🎬 Project Management** | Jira, Metas, Notas de Reunión, Operaciones de Estudio. |
| **🎮 Game Dev** | Unity, Unreal, Godot, Diseño de Niveles, Audio. |
| **💵 Finance** | Bookkeeping, Análisis Financiero, Estrategia de Impuestos. |
| **🥽 Spatial Computing** | XR, visionOS, Arquitectura Espacial. |
| **📚 Academic** | Antropología, Historia, Psicología, Narratología. |
| **🎯 Specialized** | MCP Builder, Orquestadores de Agentes, Automatización. |
| **🛟 Support** | Atención al Cliente, Analytics, Cumplimiento Legal. |
| **♟️ Strategy** | Estrategia de Negocios, Cambio Organizacional, Chief of Staff. |

---
*Generado automáticamente por Gemini CLI - 10 de junio de 2026*
