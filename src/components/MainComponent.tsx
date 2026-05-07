import { useState, useEffect, useRef } from 'preact/hooks';
import CharacterGeneratorUI from './CharacterGeneratorUI';
import StartScreen from './StartScreen';
import bgFondo from '../assets/RecursosPag/Fondo.png?url';

// Dimensiones del diseño base — el "lienzo" en el que fue construida la UI
const BASE_W = 1080;
const BASE_H = 1920;
// Escala máxima (evitar que se vea gigante en monitores 4K)
const MAX_SCALE = 2.5;

export default function MainComponent() {
  const [hasStarted, setHasStarted] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const computeLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Escala que llena el ancho — prioritaria en portrait
      const scaleByWidth = Math.min(vw / BASE_W, MAX_SCALE);
      const scaledHeight = BASE_H * scaleByWidth;

      // Si la altura escalada entra en pantalla → llenar el ancho completo
      // Si no → reducir escala para que también quepa la altura (sin scroll)
      const finalScale = scaledHeight <= vh
        ? scaleByWidth
        : Math.min(scaleByWidth, vh / BASE_H);

      setScale(finalScale);
    };

    computeLayout();

    // ResizeObserver detecta cambios reales del viewport en tiempo real
    // (barra de URL de móvil, cambio de orientación, redimensionado de ventana)
    const ro = new ResizeObserver(computeLayout);
    ro.observe(document.documentElement);

    window.addEventListener('orientationchange', () => {
      setTimeout(computeLayout, 150);
    });

    return () => {
      ro.disconnect();
    };
  }, []);

  const handleStart = () => {
    // Iniciar desvanecimiento de salida
    setContentOpacity(0);
    
    // Esperar a que termine la transición (500ms) para cambiar el componente
    setTimeout(() => {
      setHasStarted(true);
      // Iniciar desvanecimiento de entrada
      setContentOpacity(1);
    }, 600);
  };

  const scaledW = BASE_W * scale;
  const scaledH = BASE_H * scale;

  return (
    // Capa exterior: ocupa todo el viewport con el fondo del juego
    // Las áreas laterales (desktop) muestran el fondo en blur, sin barras negras
    <div
      style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: `url('${bgFondo}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro semitransparente sobre el fondo (áreas fuera de la UI en desktop/landscape) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 0,
        }}
      />

      {/* Contenedor exactamente del tamaño escalado — sin espacios vacíos */}
      <div
        ref={wrapperRef}
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 1,
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Canvas de diseño original transformado al scale calculado dinámicamente */}
        <div
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: contentOpacity,
            transition: 'opacity 0.6s ease-in-out',
          }}
        >
          {hasStarted ? (
            <CharacterGeneratorUI />
          ) : (
            <StartScreen onStart={handleStart} />
          )}
        </div>
      </div>
    </div>
  );
}
