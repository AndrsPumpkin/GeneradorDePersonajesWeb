import { useState, useEffect, useRef } from 'preact/hooks';

// Assets Imports
import bgFondo from '../assets/RecursosPag/Fondo.png?url';
import marcoLargo from '../assets/RecursosPag/Marco Largo.png?url';
import marcoAncho from '../assets/RecursosPag/Marco Ancho.png?url';
import tablillaLarga from '../assets/RecursosPag/Tablilla Larga.png?url';
import pergamino from '../assets/RecursosPag/Pergamino.png?url';
import iconoFuerza from '../assets/RecursosPag/Fuerza Pesas.png?url';
import iconoDestreza from '../assets/RecursosPag/Destreza_Espada.png?url';
import iconoAgilidad from '../assets/RecursosPag/Agilidad_Botas.png?url';
import btnMas from '../assets/RecursosPag/Boton Mas.png?url';
import btnMenos from '../assets/RecursosPag/Boton Menos.png?url';
import tablaSveliaty from '../assets/RecursosPag/Tabla Sveliaty.png?url';
import sveliatyText from '../assets/RecursosPag/Sveliaty.png?url';
import tablonGrande from '../assets/RecursosPag/Tablon Grande.png?url';
import cameraIcon from '../assets/RecursosPag/New Piskel.png?url';
import gotaBase from '../assets/RecursosPag/GotaBase.png?url';

export default function CharacterGeneratorUI() {
   const [fuerza, setFuerza] = useState(0);
   const [destreza, setDestreza] = useState(0);
   const [agilidad, setAgilidad] = useState(0);

   const [appliedFuerza, setAppliedFuerza] = useState(0);
   const [appliedDestreza, setAppliedDestreza] = useState(0);
   const [appliedAgilidad, setAppliedAgilidad] = useState(0);

   const [resultImage, setResultImage] = useState<string | null>(null);

   const canvasRef = useRef<HTMLCanvasElement>(null);

   const formatIndex = (val: number) => val.toString().padStart(2, '0');

   useEffect(() => {
      if (appliedFuerza === 0 || appliedDestreza === 0 || appliedAgilidad === 0) {
         setResultImage(null);
         return;
      }

      const updateCanvas = async () => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         const ctx = canvas.getContext('2d');
         if (!ctx) return;

         ctx.clearRect(0, 0, canvas.width, canvas.height);

         const loadImage = (src: string): Promise<HTMLImageElement> =>
            new Promise((resolve, reject) => {
               const img = new Image();
               img.crossOrigin = 'anonymous';
               img.onload = () => resolve(img);
               img.onerror = reject;
               img.src = src;
            });

         try {
            const cuerpoImg = await loadImage(`/assets/personajes/cuerpo/cuerpo${formatIndex(agilidad)}.png`);
            const cabezaImg = await loadImage(`/assets/personajes/cabeza/cabeza${formatIndex(destreza)}.png`);
            const brazosImg = await loadImage(`/assets/personajes/brazos/brazos${formatIndex(fuerza)}.png`);

            ctx.drawImage(cuerpoImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(cabezaImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(brazosImg, 0, 0, canvas.width, canvas.height);

            setResultImage(canvas.toDataURL('image/png'));
         } catch (err) {
            console.error('Error loading images:', err);
         }
      };

      updateCanvas();
   }, [appliedFuerza, appliedAgilidad, appliedDestreza]);

   const generateRandom = () => {
      const f = Math.floor(Math.random() * 9) + 1;
      const a = Math.floor(Math.random() * 9) + 1;
      const d = Math.floor(Math.random() * 9) + 1;
      setFuerza(f); setAgilidad(a); setDestreza(d);
      setAppliedFuerza(f); setAppliedAgilidad(a); setAppliedDestreza(d);
   };

   const handleGenerate = () => {
      if (fuerza === 0 || destreza === 0 || agilidad === 0) {
         alert('Por favor, asegúrate de que todos los atributos sean mayores a 0 para generar el personaje.');
         return;
      }
      setAppliedFuerza(fuerza);
      setAppliedDestreza(destreza);
      setAppliedAgilidad(agilidad);
   };

   const saveImage = () => {
      if (!resultImage) return;
      const a = document.createElement('a');
      a.href = resultImage;
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      a.download = `Personaje_${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
   };

   const handleIncrement = (setter: any, current: number) => { if (current < 9) setter(current + 1); };
   const handleDecrement = (setter: any, current: number) => { if (current > 0) setter(current - 1); };

   // Fila de stat reutilizable
   const StatRow = ({
      icon, iconAlt, value, onInc, onDec, label,
   }: {
      icon: string; iconAlt: string; value: number;
      onInc: () => void; onDec: () => void; label: string;
   }) => (
      <div style={{
         display: 'flex',
         alignItems: 'center',
         width: '100%',
         gap: '30px',
         padding: '0 80px',
         boxSizing: 'border-box',
      }}>
         {/* Icono */}
         <img src={icon} alt={iconAlt} style={{ width: 90, height: 90, objectFit: 'contain', flexShrink: 0 }} />

         {/* Pergamino + número */}
         <div style={{ position: 'relative', width: 110, height: 145, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={pergamino} alt="Pergamino" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
            <span style={{ position: 'relative', zIndex: 1, fontSize: 56, fontWeight: 'bold', color: '#000', fontFamily: "'UnifrakturMaguntia', cursive" }}>{value}</span>
         </div>

         {/* Botones + / - */}
         <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            <button onClick={onInc} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0 }}>
               <img src={btnMas} alt="Mas" style={{ width: 82, height: 82 }} />
            </button>
            <button onClick={onDec} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0 }}>
               <img src={btnMenos} alt="Menos" style={{ width: 82, height: 82 }} />
            </button>
         </div>

         {/* Etiqueta */}
         <div style={{ display: 'flex', flexDirection: 'column', color: '#000', textAlign: 'center', flex: 1 }}>
            <span style={{ fontSize: 20, fontWeight: 'bold', opacity: 0.8, lineHeight: 1.2 }}>Cantidad de cartas de</span>
            <span style={{ fontSize: 40, fontFamily: "'UnifrakturMaguntia', cursive", lineHeight: 1.2 }}>{label}</span>
         </div>
      </div>
   );

   return (
      <div style={{
         width: '1080px',
         height: '1920px',
         backgroundImage: `url('${bgFondo}')`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         boxSizing: 'border-box',
         paddingTop: 40,
         paddingBottom: 30,
         gap: 0,
      }}>
         {/* Canvas oculto */}
         <canvas ref={canvasRef} width={1000} height={1000} style={{ display: 'none' }} />

         {/* ─── TÍTULOS ─── */}
         <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            {/* Tablón "Generador de Personajes" */}
            <div style={{ position: 'relative', width: '92%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={tablonGrande} alt="Tablon" style={{ width: '100%', display: 'block' }} />
               <span style={{
                  position: 'absolute',
                  fontSize: 52,
                  color: '#000',
                  fontFamily: "'UnifrakturMaguntia', cursive",
                  paddingTop: 8,
               }}>
                  Generador de Personajes
               </span>
            </div>

            {/* Tabla Sveliaty */}
            <div style={{ position: 'relative', width: '62%', marginTop: -170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={tablaSveliaty} alt="Tabla Sveliaty" style={{ width: '100%', display: 'block' }} />
               <img src={sveliatyText} alt="Sveliaty" style={{ position: 'absolute', width: '78%' }} />
            </div>
         </div>

         {/* ─── ÁREA DE IMAGEN ─── */}
         <div style={{
            position: 'relative',
            width: '90%',
            height: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -100,
            flexShrink: 0,
         }}>
            <img src={marcoLargo} alt="Marco" style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'fill' }} />

            <div style={{ position: 'relative', zIndex: 1, width: '75%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               {resultImage ? (
                  <img src={resultImage} alt="Personaje" style={{ height: '140%', objectFit: 'contain' }} />
               ) : (
                  <img src={gotaBase} alt="Gota Base" style={{ height: '100%', objectFit: 'contain' }} />
               )}
            </div>

            {/* Botón Capturar — solapado en el borde inferior */}
            <button
               onClick={saveImage}
               title="Capturar Imagen"
               style={{
                  position: 'absolute',
                  bottom: -42,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  zIndex: 20,
               }}
            >
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={tablillaLarga} alt="Capturar" style={{ width: 440, height: 100 }} />
                  <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 18 }}>
                     <span style={{ fontSize: 42, color: '#000', fontFamily: "'UnifrakturMaguntia', cursive", paddingTop: 8 }}>Capturar</span>
                     <img src={cameraIcon} alt="Camara" style={{ height: 42, opacity: 0.8 }} />
                  </div>
               </div>
            </button>
         </div>

         {/* ─── CONTROLES ─── */}
         <div style={{
            position: 'relative',
            width: '90%',
            height: 400,
            marginTop: 160,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>
            <img src={marcoAncho} alt="Marco Controles" style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'fill' }} />

            <div style={{
               position: 'relative',
               zIndex: 1,
               width: '100%',
               height: '100%',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-evenly',
               alignItems: 'center',
            }}>
               <StatRow icon={iconoFuerza} iconAlt="Fuerza" value={fuerza} onInc={() => handleIncrement(setFuerza, fuerza)} onDec={() => handleDecrement(setFuerza, fuerza)} label="Fuerza" />
               <StatRow icon={iconoDestreza} iconAlt="Destreza" value={destreza} onInc={() => handleIncrement(setDestreza, destreza)} onDec={() => handleDecrement(setDestreza, destreza)} label="Destreza" />
               <StatRow icon={iconoAgilidad} iconAlt="Agilidad" value={agilidad} onInc={() => handleIncrement(setAgilidad, agilidad)} onDec={() => handleDecrement(setAgilidad, agilidad)} label="Agilidad" />
            </div>
         </div>

         {/* ─── BOTONES INFERIORES ─── */}
         <div style={{
            display: 'flex',
            gap: 20,
            width: '90%',
            marginTop: 70,
            flexShrink: 0,
         }}>
            <button
               onClick={generateRandom}
               style={{ position: 'relative', flex: 1, height: 105, background: 'none', border: 'none', outline: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
               <img src={tablillaLarga} alt="Fondo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
               <span style={{ position: 'relative', zIndex: 1, fontSize: 36, color: '#000', fontFamily: "'UnifrakturMaguntia', cursive", paddingTop: 8 }}>Personaje Aleatorio</span>
            </button>

            <button
               onClick={handleGenerate}
               style={{ position: 'relative', flex: 1, height: 105, background: 'none', border: 'none', outline: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
               <img src={tablillaLarga} alt="Fondo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
               <span style={{ position: 'relative', zIndex: 1, fontSize: 36, color: '#000', fontFamily: "'UnifrakturMaguntia', cursive", paddingTop: 8 }}>Generar Personaje</span>
            </button>
         </div>
      </div>
   );
}
