import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useScanStore } from '../../store/scan-store'
import { formatBytes } from '../../lib/format'
import type { Platform } from '../../store/scan-store'

const DISK_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']

const PLATFORM_LABELS: Record<Platform, string> = {
  steam: 'Steam',
  epic: 'Epic Games',
  battlenet: 'Battle.net',
  gog: 'GOG',
  xbox: 'Xbox',
  ubisoft: 'Ubisoft',
  ea: 'EA',
  emulator: 'Emuladores',
  other: 'Otros'
}

const PLATFORM_COLORS: Record<Platform, string> = {
  steam: '#1b2838',
  epic: '#2a2a2a',
  battlenet: '#00AEFF',
  gog: '#a855f7',
  xbox: '#107C10',
  ubisoft: '#0070ff',
  ea: '#ff4747',
  emulator: '#f59e0b',
  other: '#64748b'
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-text">{payload[0].name}</p>
      <p className="text-accent-light font-medium">{formatBytes(payload[0].value)}</p>
    </div>
  )
}

export default function DiskChart() {
  const { games, disks } = useScanStore()

  if (games.length === 0) return null

  // Data by disk
  const diskData = disks
    .filter((d) => d.gamesBytes > 0)
    .map((d) => ({
      name: d.drive,
      value: d.gamesBytes
    }))

  // Data by platform
  const platformMap = new Map<Platform, number>()
  for (const game of games) {
    platformMap.set(game.platform, (platformMap.get(game.platform) || 0) + game.sizeBytes)
  }
  const platformData = Array.from(platformMap.entries())
    .map(([platform, size]) => ({
      name: PLATFORM_LABELS[platform],
      value: size,
      fill: PLATFORM_COLORS[platform]
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Games by Disk */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Juegos por Disco</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={diskData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {diskData.map((_, i) => (
                <Cell key={i} fill={DISK_COLORS[i % DISK_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {diskData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: DISK_COLORS[i % DISK_COLORS.length] }}
              />
              {d.name} ({formatBytes(d.value)})
            </div>
          ))}
        </div>
      </div>

      {/* Games by Platform */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Juegos por Plataforma</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={platformData} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {platformData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
