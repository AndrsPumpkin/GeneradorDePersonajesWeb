import { useState, useEffect, useRef } from 'preact/hooks';
import CharacterGeneratorUI from './CharacterGeneratorUI';
import StartScreen from './StartScreen';

// Dimensiones de diseño base (portrait) - deben coincidir con el contenido interno
const BASE_W = 430;
const BASE_H = 980;

export default function MainComponent() {
  const [hasStarted, setHasStarted] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Escalar para ocupar al máximo el espacio sin desbordar
      const scaleX = vw / BASE_W;
      const scaleY = vh / BASE_H;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    // También escuchar cambios de orientación
    window.addEventListener('orientationchange', computeScale);
    return () => {
      window.removeEventListener('resize', computeScale);
      window.removeEventListener('orientationchange', computeScale);
    };
  }, []);

  // Dimensiones escaladas del contenedor
  const scaledW = BASE_W * scale;
  const scaledH = BASE_H * scale;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#1a1a1a',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* Inner container at BASE size, scaled down via transform */}
        <div
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {hasStarted ? (
            <CharacterGeneratorUI />
          ) : (
            <StartScreen onStart={() => setHasStarted(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
