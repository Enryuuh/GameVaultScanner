# GameVault Scanner

Aplicación de escritorio (Electron) que escanea todos los discos duros del PC y detecta videojuegos instalados de múltiples plataformas, mostrando su tamaño y ubicación.

## Stack

- **Electron 33** + **electron-vite** (bundler)
- **React 19** + **TypeScript** (renderer)
- **Tailwind CSS 4** (estilos)
- **Zustand** (estado global)
- **Recharts** (gráficos de disco)
- **Lucide React** (iconos)

## Estructura del proyecto

```
src/
├── main/                    # Proceso principal de Electron
│   ├── index.ts             # Ventana principal, app lifecycle
│   ├── ipc-handlers.ts      # Handlers IPC (scan, cache, window controls)
│   ├── types.ts             # Tipos compartidos (DetectedGame, DiskInfo, etc.)
│   └── scanners/            # Escáneres por plataforma
│       ├── disk-scanner.ts      # Info de discos (WMIC)
│       ├── steam-scanner.ts     # Steam (libraryfolders.vdf + appmanifest)
│       ├── epic-scanner.ts      # Epic Games (.item files)
│       ├── battlenet-scanner.ts # Battle.net (registro Windows)
│       ├── gog-scanner.ts       # GOG Galaxy (registro Windows)
│       ├── xbox-scanner.ts      # Xbox/Microsoft Store (WindowsApps)
│       ├── ubisoft-scanner.ts   # Ubisoft Connect (registro)
│       ├── ea-scanner.ts        # EA App/Origin (registro)
│       ├── emulator-scanner.ts  # RetroArch, Dolphin, PCSX2, Cemu, Ryujinx, etc.
│       └── registry-scanner.ts  # Fallback: registro de Windows (Uninstall keys)
├── preload/                 # Preload script (API bridge)
│   └── index.ts
└── renderer/                # Frontend React
    └── src/
        ├── App.tsx              # Layout principal con 2 vistas (Dashboard/Juegos)
        ├── store/scan-store.ts  # Zustand store (games, disks, scanning state)
        └── components/
            ├── dashboard/       # DiskOverview, DiskChart, ScanProgress
            ├── games/           # GameList, GameCard, GameFilters, PlatformBadge
            └── layout/          # TitleBar (custom), Sidebar
```

## Comandos

- `npm run dev` — Abrir en modo desarrollo (requiere `unset ELECTRON_RUN_AS_NODE` en bash)
- `npm run build` — Build de producción (electron-vite build)
- `npm run build:win` — Build + empaquetado Windows (electron-builder)

## Packaging manual (workaround winCodeSign)

electron-builder falla por symlinks de macOS en winCodeSign. Workaround:

```bash
# 1. Build
npx electron-vite build

# 2. Empaquetar con electron-builder (genera dist/win-unpacked/)
npx electron-builder --win --dir

# 3. Crear asar manualmente con dependencias de producción
mkdir .pack && cp package.json .pack/ && cp -r out .pack/
cd .pack && npm install --omit=dev --ignore-scripts
npx @electron/asar pack .pack dist/win-unpacked/resources/app.asar
rm -rf .pack

# 4. Zip para release
7za a -tzip GameVaultScanner-v1.0.0-win64.zip ./dist/win-unpacked/*
```

## Notas importantes

- La app usa `frame: false` con TitleBar custom (drag region + botones min/max/close)
- Cache de escaneo se guarda en `%APPDATA%/gamevault-scanner/cache.json` (24h TTL)
- Los scanners usan registro de Windows (`reg query`) y lectura directa de archivos de config de cada launcher
- El tema visual es oscuro (gaming aesthetic), colores definidos en Tailwind
- GitHub repo: https://github.com/Enryuuh/GameVaultScanner
