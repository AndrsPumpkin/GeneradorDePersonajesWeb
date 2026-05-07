import { useState, useEffect } from 'preact/hooks';

// Assets
import bgFondo from '../assets/RecursosPag/Fondo.png?url';
import sveliatyText from '../assets/RecursosPag/Sveliaty.png?url';
import tablillaLarga from '../assets/RecursosPag/Tablilla Larga.png?url';

interface StartScreenProps {
   onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
   const [mounted, setMounted] = useState(false);
   const [showButton, setShowButton] = useState(false);

   useEffect(() => {
      // Pequeño delay para permitir que el DOM se renderice antes de aplicar la transición
      const mountTimer = setTimeout(() => setMounted(true), 100);

      // Mostrar el botón de Comenzar después de que termine la animación de caída
      const btnTimer = setTimeout(() => setShowButton(true), 1200);

      return () => {
         clearTimeout(mountTimer);
         clearTimeout(btnTimer);
      };
   }, []);

   return (
      <div
         className="w-full h-full bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center overflow-hidden"
         style={{ backgroundImage: `url('${bgFondo}')` }}
      >
         {/* Recurso Sveliaty Animado */}
         <div
            className="absolute flex justify-center items-center w-full transition-all duration-1000 z-20"
            style={{
               top: mounted ? '35%' : '-30%',
               transform: 'translateY(-50%)',
               transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Efecto rebote (bounce)
            }}
         >
            <div className="relative w-[100%] flex justify-center items-center">
               <img src={sveliatyText} alt="Sveliaty" className="absolute w-[80%] drop-shadow-lg mb-1" />
            </div>
         </div>

         {/* Botón Comenzar */}
         <div
            className={`absolute bottom-[35%] w-full flex justify-center transition-all duration-700 z-10 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[80px] pointer-events-none'}`}
         >
            <button
               onClick={onStart}
               className="btn-hover-effect"
               style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '125px', width: '640px', background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
               <img src={tablillaLarga} alt="Fondo Boton" className="absolute w-full h-full object-fill" />
               <span className="relative z-10 px-[20px] text-black text-[55px] pt-[10px]" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>Comenzar</span>
            </button>
         </div>
      </div>
   );
}
