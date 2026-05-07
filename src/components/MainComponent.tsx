import { useState, useEffect } from 'preact/hooks';
import CharacterGeneratorUI from './CharacterGeneratorUI';
import StartScreen from './StartScreen';

export default function MainComponent() {
  const [hasStarted, setHasStarted] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 450;
      const scaleY = window.innerHeight / 980;
      setScale(Math.min(1, scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a1a1a]">
      <div
        style={{
          width: '450px',
          height: '980px',
          transform: `translate(-50%, -50%) scale(${scale})`,
          position: 'absolute',
          top: '50%',
          left: '45%',
          transformOrigin: 'center center'
        }}
      >
        {hasStarted ? (
          <CharacterGeneratorUI />
        ) : (
          <StartScreen onStart={() => setHasStarted(true)} />
        )}
      </div>
    </div>
  );
}
