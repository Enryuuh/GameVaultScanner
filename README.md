# GameVault Scanner

Aplicación de escritorio que escanea automáticamente todos tus discos duros y detecta videojuegos instalados, mostrando **dónde están**, **cuánto espacio ocupan** y **en qué plataforma están** (Steam, Epic, GOG, Battle.net, etc).

## 🎮 Características

- **Escaneo multi-plataforma**: Detecta juegos de 10+ fuentes
  - Steam, Epic Games, GOG Galaxy, Battle.net
  - Xbox / Microsoft Store, Ubisoft Connect, EA App / Origin
  - Emuladores (RetroArch, Dolphin, PCSX2, Cemu, Ryujinx, etc.)
  - Registro de Windows (fallback)

- **Análisis por disco**: Visualiza qué juego ocupa cuánto espacio en cada disco
- **Dashboard interactivo**: Gráficos en tiempo real del uso de almacenamiento
- **Búsqueda y filtros**: Encuentra tus juegos al instante
- **Cache inteligente**: Guarda resultados 24h para escaneos rápidos
- **Sin instalación**: Descarga, descomprime y ejecuta

## 📥 Descarga

1. Ve a [Releases](https://github.com/Enryuuh/GameVaultScanner/releases)
2. Descarga `GameVaultScanner-v1.0.0-win64.zip` (114 MB)
3. Descomprime en cualquier carpeta
4. Ejecuta `GameVaultScanner.exe`

**Requisitos**: Windows 10/11 (64-bit). No necesita Node.js ni instalación.

## 🚀 Uso

1. Abre la app
2. Presiona el botón "Escanear"
3. Espera a que termine (depende de cuántos discos tengas)
4. Navega entre **Dashboard** (gráficos) y **Juegos** (lista detallada)

Filtra por:
- **Plataforma**: Steam, Epic, GOG, etc.
- **Disco**: C:, D:, E:, etc.
- **Tamaño**: Juegos grandes, medianos, pequeños

## 🛠️ Tech Stack

- **Electron 33** — App de escritorio multiplataforma
- **React 19 + TypeScript** — UI moderna y tipada
- **Tailwind CSS 4** — Estilos optimizados
- **Zustand** — Estado global minimalista
- **Recharts** — Gráficos interactivos
- **electron-vite** — Bundler optimizado para Electron

## 📊 Cómo funciona

```
1. Lectura de discos → WMIC (Windows Management Instrumentation)
2. Lectura de launchers → Archivos de config + Registro de Windows
3. Escaneo de carpetas → Búsqueda recursiva de instalaciones
4. Análisis → Cálculo de tamaño total y ubicación
5. Cache → Se guarda 24h en %APPDATA%/gamevault-scanner/cache.json
```

## 🔧 Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Crear .exe para distribución
npm run build:win
```

## 📝 Licencia

MIT — Libre para usar, modificar y distribuir.

## 🤝 Contribuciones

¿Encontraste un bug? ¿Quieres agregar soporte para otra plataforma?
Abre un issue en [GitHub](https://github.com/Enryuuh/GameVaultScanner/issues).

---

Hecho con ❤️ por [Enryuuh](https://github.com/Enryuuh)
