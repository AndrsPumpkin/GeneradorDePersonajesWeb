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

   // Pad the index to format like "01", "02", etc.
   const formatIndex = (val: number) => {
      return val.toString().padStart(2, '0');
   };

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

         // Clear the canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Load images
         const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
               const img = new Image();
               img.crossOrigin = 'anonymous'; // Important for canvas toDataURL
               img.onload = () => resolve(img);
               img.onerror = reject;
               img.src = src;
            });
         };

         try {
            const cuerpoImg = await loadImage(`/assets/personajes/cuerpo/cuerpo${formatIndex(agilidad)}.png`);
            const cabezaImg = await loadImage(`/assets/personajes/cabeza/cabeza${formatIndex(destreza)}.png`);
            const brazosImg = await loadImage(`/assets/personajes/brazos/brazos${formatIndex(fuerza)}.png`);

            // Draw in order: Cuerpo -> Cabeza -> Brazos
            ctx.drawImage(cuerpoImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(cabezaImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(brazosImg, 0, 0, canvas.width, canvas.height);

            // Update the image src
            setResultImage(canvas.toDataURL('image/png'));
         } catch (err) {
            console.error("Error loading images:", err);
         }
      };

      updateCanvas();
   }, [appliedFuerza, appliedAgilidad, appliedDestreza]);

   const generateRandom = () => {
      const f = Math.floor(Math.random() * 9) + 1;
      const a = Math.floor(Math.random() * 9) + 1;
      const d = Math.floor(Math.random() * 9) + 1;
      setFuerza(f);
      setAgilidad(a);
      setDestreza(d);
      setAppliedFuerza(f);
      setAppliedAgilidad(a);
      setAppliedDestreza(d);
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

   const handleIncrement = (setter: any, current: number) => {
      if (current < 9) setter(current + 1);
   };

   const handleDecrement = (setter: any, current: number) => {
      if (current > 0) setter(current - 1);
   };

   return (
      <div
         className="w-full h-full bg-cover bg-center bg-no-repeat flex flex-col items-center py-4 px-4 font-serif relative"
         style={{ backgroundImage: `url('${bgFondo}')` }}
      >
         {/* Hidden Canvas for processing */}
         <canvas ref={canvasRef} width={1000} height={1000} style={{ display: 'none' }} />

         {/* Top Titles */}
         <div className="relative w-full flex flex-col items-center mb-2 z-20">
            <div className="relative w-[95%] flex items-center justify-center z-10">
               <img src={tablonGrande} alt="Tablon Grande" className="w-full drop-shadow-2xl" />
               <span className="absolute text-black text-[22px] pt-1" style={{ fontFamily: "'UnifrakturMaguntia', cursive", textShadow: "1px 1px 2px rgba(255,255,255,0.2)" }}>Generador de Personajes</span>
            </div>

            <div className="relative w-[65%] -mt-4 flex justify-center items-center z-20">
               <img src={tablaSveliaty} alt="Tabla Sveliaty" className="w-full drop-shadow-xl" />
               <img src={sveliatyText} alt="Sveliaty" className="absolute w-[80%] drop-shadow-md mb-1" />
            </div>
         </div>

         {/* Image Display Area */}
         <div className="relative w-full max-w-[400px] mb-4 flex justify-center items-center h-[330px]">
            <img src={marcoLargo} alt="Marco" className="absolute w-full h-[110%] object-fill drop-shadow-2xl" />

            <div className="relative z-10 w-[80%] h-[80%] flex items-center justify-center overflow-hidden">
               {resultImage ? (
                  <img src={resultImage} alt="Personaje generado" className="h-[140%] object-contain drop-shadow-lg" />
               ) : (
                  <img src={gotaBase} alt="Gota Base" className="h-[100%] object-contain drop-shadow-lg" />
               )}
            </div>

            {/* Capture Button overlaps bottom border */}
            <button
               onClick={saveImage}
               className="absolute -bottom-6 left-1/2 -translate-x-1/2 hover:scale-105 active:scale-95 transition-transform z-20 bg-transparent border-none outline-none"
               title="Capturar Imagen"
            >
               <div className="relative flex items-center justify-center">
                  <img src={tablillaLarga} alt="Capturar" className="w-48 h-14 drop-shadow-lg" />
                  <div className="absolute flex items-center gap-2">
                     <span className="text-black font-bold text-lg pt-1" style={{ fontFamily: "'UnifrakturMaguntia', cursive", textShadow: "1px 1px 2px rgba(255,255,255,0.3)" }}>Capturar</span>
                     <img src={cameraIcon} alt="Camara" className="h-6 opacity-80" />
                  </div>
               </div>
            </button>
         </div>

         {/* Controls Area */}
         <div className="relative w-full max-w-[400px] flex justify-center mt-1 mb-1 h-[210px]">
            <img src={marcoAncho} alt="Marco Controles" className="absolute w-full h-[110%] object-fill drop-shadow-2xl" />

            <div className="relative z-10 w-full h-full flex flex-col justify-center px-12 gap-2 mt-2">
               {/* Fuerza */}
               <div className="flex items-center justify-between w-full">
                  <img src={iconoFuerza} alt="Fuerza" className="w-10 h-10 object-contain drop-shadow-md" />

                  <div className="relative w-12 h-16 flex items-center justify-center">
                     <img src={pergamino} alt="Pergamino" className="absolute w-full h-full object-fill drop-shadow-sm" />
                     <span className="relative z-10 text-2xl font-bold text-black" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>{fuerza}</span>
                  </div>

                  <div className="flex gap-2">
                     <button onClick={() => handleIncrement(setFuerza, fuerza)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMas} alt="Mas" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                     <button onClick={() => handleDecrement(setFuerza, fuerza)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMenos} alt="Menos" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                  </div>

                  <div className="flex flex-col text-sm text-black text-center leading-none min-w-[80px]">
                     <span className="text-[9px] font-bold opacity-80 mb-1">Cantidad de cartas de</span>
                     <span className="text-lg" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Fuerza</span>
                  </div>
               </div>

               {/* Destreza */}
               <div className="flex items-center justify-between w-full">
                  <img src={iconoDestreza} alt="Destreza" className="w-10 h-10 object-contain drop-shadow-md" />

                  <div className="relative w-12 h-16 flex items-center justify-center">
                     <img src={pergamino} alt="Pergamino" className="absolute w-full h-full object-fill drop-shadow-sm" />
                     <span className="relative z-10 text-2xl font-bold text-black" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>{destreza}</span>
                  </div>

                  <div className="flex gap-2">
                     <button onClick={() => handleIncrement(setDestreza, destreza)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMas} alt="Mas" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                     <button onClick={() => handleDecrement(setDestreza, destreza)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMenos} alt="Menos" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                  </div>

                  <div className="flex flex-col text-sm text-black text-center leading-none min-w-[80px]">
                     <span className="text-[9px] font-bold opacity-80 mb-1">Cantidad de cartas de</span>
                     <span className="text-lg" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Destreza</span>
                  </div>
               </div>

               {/* Agilidad */}
               <div className="flex items-center justify-between w-full">
                  <img src={iconoAgilidad} alt="Agilidad" className="w-10 h-10 object-contain drop-shadow-md" />

                  <div className="relative w-12 h-16 flex items-center justify-center">
                     <img src={pergamino} alt="Pergamino" className="absolute w-full h-full object-fill drop-shadow-sm" />
                     <span className="relative z-10 text-2xl font-bold text-black" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>{agilidad}</span>
                  </div>

                  <div className="flex gap-2">
                     <button onClick={() => handleIncrement(setAgilidad, agilidad)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMas} alt="Mas" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                     <button onClick={() => handleDecrement(setAgilidad, agilidad)} className="active:scale-90 hover:scale-110 transition-transform bg-transparent border-none outline-none">
                        <img src={btnMenos} alt="Menos" className="w-9 h-9 drop-shadow-sm" />
                     </button>
                  </div>

                  <div className="flex flex-col text-sm text-black text-center leading-none min-w-[80px]">
                     <span className="text-[9px] font-bold opacity-80 mb-1">Cantidad de cartas de</span>
                     <span className="text-lg" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Agilidad</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Buttons */}
         <div className="flex gap-2 w-full justify-center mt-6 z-10 px-2">
            <button onClick={generateRandom} className="relative flex-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform h-14 drop-shadow-md bg-transparent border-none outline-none">
               <img src={tablillaLarga} alt="Fondo Boton" className="absolute w-full h-full object-fill" />
               <span className="relative z-10 px-2 text-black text-[16px] pt-1" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Personaje Aleatorio</span>
            </button>

            <button onClick={handleGenerate} className="relative flex-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform h-14 drop-shadow-md bg-transparent border-none outline-none">
               <img src={tablillaLarga} alt="Fondo Boton" className="absolute w-full h-full object-fill" />
               <span className="relative z-10 px-2 text-black text-[16px] pt-1" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Generar Personaje</span>
            </button>
         </div>

      </div>
   );
}
