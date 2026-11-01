import { useMemo } from 'react'

export default function FloatingParticles({ biome }) {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 3) * 7) % 98}%`,
      size: (i % 3 === 0 ? 4 : (i % 2 === 0 ? 3 : 2)),
      duration: 12 + (i % 7) * 3,
      delay: -(i * 1.5),
      opacity: 0.25 + (i % 4) * 0.15,
    }))
  }, [])

  const getColor = (index) => {
    if (biome === 'nether') {
      const palette = ['#ff4d4d', '#ff7849', '#ffa726', '#ff1744']
      return palette[index % palette.length]
    }
    if (biome === 'the_end') {
      const palette = ['#d946ef', '#c084fc', '#818cf8', '#e879f9']
      return palette[index % palette.length]
    }
    // Overworld
    const palette = ['#4ade80', '#38bdf8', '#a3e635', '#2dd4bf']
    return palette[index % palette.length]
  }

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="pixel-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: getColor(p.id),
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
