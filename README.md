# GameVault Scanner

Aplicacion de escritorio que escanea automaticamente todos tus discos duros y detecta videojuegos instalados, mostrando **donde estan**, **cuanto espacio ocupan** y **en que plataforma estan** (Steam, Epic, GOG, Battle.net, etc).

## Caracteristicas

- **Escaneo multi-plataforma**: Detecta juegos de 10+ fuentes
  - Steam, Epic Games, GOG Galaxy, Battle.net
  - Xbox / Microsoft Store, Ubisoft Connect, EA App / Origin
  - Emuladores (RetroArch, Dolphin, PCSX2, Cemu, Ryujinx, etc.)
  - Registro de Windows (fallback)

- **Analisis por disco**: Visualiza que juego ocupa cuanto espacio en cada disco
- **Dashboard interactivo**: Graficos en tiempo real con Kinetic Storage Map
- **Busqueda y filtros**: Filtra por plataforma, disco, rango de tamano
- **Ordenamiento por columna**: Click en los headers para ordenar por nombre, tamano, plataforma, disco o fecha
- **Exportar CSV/JSON**: Descarga tu lista de juegos completa
- **Alertas de disco**: Aviso cuando un disco esta >90% lleno (warning) o >95% (critical)
- **Scan pausable**: Pausa y reanuda el escaneo en cualquier momento
- **Vista Scan dedicada**: Progreso circular, log en tiempo real estilo terminal
- **Settings**: Configura scanners por plataforma, gestion de cache, scan paths personalizados
- **Cache inteligente**: Guarda resultados 24h para escaneos rapidos
- **Sin instalacion**: Descarga, descomprime y ejecuta

## Descarga

1. Ve a [Releases](https://github.com/Enryuuh/GameVaultScanner/releases)
2. Descarga `GameVaultScanner-v1.1.0-win64.zip`
3. Descomprime en cualquier carpeta
4. Ejecuta `ViewerStorage.exe`

**Requisitos**: Windows 10/11 (64-bit). No necesita Node.js ni instalacion.

## Nota sobre Windows Defender / SmartScreen

Al ejecutar la app por primera vez, Windows puede mostrar un aviso de **"Windows protegio su equipo"**. Esto es normal y ocurre con cualquier aplicacion que no tiene un certificado de firma de codigo (code signing). La app es completamente segura y de codigo abierto.

**Para continuar:**
1. Haz click en **"Mas informacion"**
2. Haz click en **"Ejecutar de todas formas"**

Esto solo ocurre la primera vez que abres la app.

## Uso

1. Abre la app
2. Presiona el boton **"Scan Now"** o navega a la vista Scan
3. Espera a que termine el escaneo
4. Navega entre **Dashboard** (graficos), **Games** (lista detallada), **Scan** (progreso) y **Settings** (configuracion)

### Filtros disponibles en Games Library

- **Plataforma**: Steam, Epic, GOG, Battle.net, Xbox, Ubisoft, EA, Emulator
- **Disco**: C:, D:, E:, etc.
- **Tamano**: < 1 GB, 1-10 GB, 10-50 GB, 50-100 GB, > 100 GB
- **Busqueda**: Por nombre del juego
- **Ordenamiento**: Click en las columnas (Name, Platform, Size, Drive, Installed)

### Exportar datos

En la vista Games Library, usa los botones **"Export CSV"** o **"Export JSON"** para descargar tu lista de juegos.

## Como funciona

```
1. Lectura de discos -> WMIC (Windows Management Instrumentation)
2. Lectura de launchers -> Archivos de config + Registro de Windows
3. Escaneo de carpetas -> Busqueda recursiva de instalaciones
4. Analisis -> Calculo de tamano total y ubicacion
5. Cache -> Se guarda 24h en %APPDATA%/gamevault-scanner/cache.json
```

## Tech Stack

- **Electron 33** — App de escritorio multiplataforma
- **React 19 + TypeScript** — UI moderna y tipada
- **Tailwind CSS 4** — Estilos optimizados
- **Zustand** — Estado global minimalista
- **Recharts** — Graficos interactivos
- **Lucide React** — Iconos
- **electron-vite** — Bundler optimizado para Electron

## Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de produccion
npm run build

# Crear .exe para distribucion
npm run build:win
```

## Licencia

MIT

---

Hecho por [Enryuuh](https://github.com/Enryuuh)
