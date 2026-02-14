import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// --- CONFIGURACIÓN DE DATOS ---

// IMAGEN DEL ROMPECABEZAS
const PUZZLE_IMAGE = "https://gomaypeachstore.com/wp-content/uploads/2024/06/buba-and-dudu.png.webp";

// PLAYLIST DE SERENATA
const songsConfig = [
  {
    title: "Ya No Vivo Por Vivir",
    artist: "Juan Gabriel",
    url: "https://music.youtube.com/watch?v=W-Nwn8wgb0o&si=bSdIgyIxopLc1-7b",
    color: "#ef5350",
    note: "Cuando escucho esto, cierro los ojos y siento tu abrazo a pesar de la distancia. Es mi refugio."
  },
  {
    title: "Amar y Vivir",
    artist: "Vicente Fernández",
    url: "https://music.youtube.com/watch?v=gjoKqyLWUmg&si=QkcOucnZjJFiVBBc",
    color: "#ffa726",
    note: "Todos saben amar y vivir, pero pocos saben hacerlo como nosotros lo hacemos: con entrega total."
  },
  {
    title: "Nuestro Juramento",
    artist: "Julio Jaramillo",
    url: "https://music.youtube.com/watch?v=XEy76RTfF7E&si=gRJjLGfIIlE-1tez",
    color: "#7e57c2",
    note: "No importa el tiempo ni la historia, nuestro juramento de amor es sagrado y eterno."
  },
  {
    title: "Cuando Sale la Luna",
    artist: "Pedro Infante",
    url: "https://music.youtube.com/watch?v=yB_NsRdVdi0&si=4CCLTvJZnNdqmbOQ",
    color: "#42a5f5",
    note: "Dios me mandó este hermoso cariño que eres tú. Eres lo más precioso que tengo."
  },
  {
    title: "Me Gustas Mucho",
    artist: "Juan Gabriel (Canta Rocío Dúrcal)",
    url: "https://music.youtube.com/watch?v=P5AXA04LYsQ&si=NwxedyugyT8Cra60",
    color: "#26a69a",
    note: "Me gustas mucho, siempre seré tuya y estaré a tu lado para amarte."
  }
];

// Mensajes para el botón "No"
const noMessages = [
  "¿Eh? 👀 ¿Ya hiciste clic en No?",
  "Vaya. Qué decisión tan valiente.",
  "¿Estás *seguro* seguro? Mi corazón dice lo contrario.",
  "Kiyozawa... ese botón se ve sospechoso 😏",
  "Está bien, pero imagínate diciendo No a *esta cara* 🥺",
  "Esto se está poniendo incómodo. Solo di Sí.",
  "A estas alturas, el botón No es solo decoración 😂",
  "Ya basta de drama. Claramente tienes que decir Sí 💖"
];

const basketsConfig = [
  { id: 1, count: 1, color: "⬜", label: "Amor a primera vista", emoji: "🌼" },
  { id: 2, count: 2, color: "🟨", label: "Solo nosotros dos", emoji: "🌻" },
  { id: 3, count: 3, color: "🟥", label: "Te amo", emoji: "🌺" },
  { id: 4, count: 12, color: "🌸", label: "Siempre tuya", emoji: "🌸" },
  { id: 5, count: 108, color: "🟥", label: "¡Cásate conmigo!", emoji: "🌹" }
];

const dollsConfig = [
  { size: 180, text: "Tu mente tan brillante 🧠" },
  { size: 150, text: "Tu pasión por lo que amas 📚" },
  { size: 120, text: "Tu esfuerzo y dedicación ✨" },
  { size: 90, text: "Tu paciencia infinita conmigo 🧘🏻‍♂️" },
  { size: 60, text: "Simplemente TÚ (mi favorito) ❤️" }
];

const mathFunctions = [
  {
    name: "El latido (Corazón Neón)",
    formula: "f(x) = x^(2/3) + √(3 - x^2) · sin(16πx)",
    type: "cartesian",
    range: [-Math.sqrt(3), Math.sqrt(3)],
    getPoint: (x) => {
      const scale = 80;
      const y = Math.pow(Math.abs(x), 2 / 3) + Math.sqrt(3 - x * x) * Math.sin(16 * Math.PI * x);
      return { x: x * scale, y: -y * scale + 20 };
    },
    color: "#ff1493",
    speed: 0.01
  },
  {
    name: "Corazón Paramétrico",
    formula: "x = 16sin³t, y = 13cost - 5cos2t...",
    type: "parametric",
    range: 2 * Math.PI,
    getPoint: (t) => {
      const scale = 12;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { x: x * scale, y: -y * scale };
    },
    color: "#ff0000",
    speed: 0.05
  },
  {
    name: "Flor en expansión",
    formula: "r = e^(0.15θ) · sin(12θ)",
    type: "polar",
    range: 8 * Math.PI,
    getPoint: (t) => {
      const scale = 8;
      const r = Math.exp(0.15 * t) * Math.sin(12 * t);
      return { x: r * Math.cos(t) * scale, y: -r * Math.sin(t) * scale };
    },
    color: "#d500f9",
    speed: 0.05
  },
  {
    name: "Corazón Floral",
    formula: "r = sin(11θ) + 0.5sin(7θ) + 0.3cos(13θ)",
    type: "polar",
    range: 2 * Math.PI,
    getPoint: (t) => {
      const scale = 150;
      const r = Math.sin(11 * t) + 0.5 * Math.sin(7 * t) + 0.3 * Math.cos(13 * t);
      return { x: r * Math.cos(t) * scale, y: -r * Math.sin(t) * scale };
    },
    color: "#00e5ff",
    speed: 0.02
  },
  {
    name: "Rosa Galáctica",
    formula: "r = sin(8θ) + 0.5cos(16θ)",
    type: "polar",
    range: 2 * Math.PI,
    getPoint: (t) => {
      const scale = 180;
      const r = Math.sin(8 * t) + 0.5 * Math.cos(16 * t);
      return { x: r * Math.cos(t) * scale, y: -r * Math.sin(t) * scale };
    },
    color: "#ffea00",
    speed: 0.02
  },
 
  {
    name: "Flor Hipotrocoide",
    formula: "R=7, r=3, d=5",
    type: "parametric",
    range: 6 * Math.PI,
    getPoint: (t) => {
      const scale = 12;
      const R = 7;
      const r = 3;
      const d = 5;
      const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
      const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
      return { x: x * scale, y: -y * scale };
    },
    color: "#ff6d00",
    speed: 0.05
  },
  {
    name: "Rosa en Floración",
    formula: "r = √θ · (1 + 0.3sin(5θ))",
    type: "polar",
    range: 12 * Math.PI,
    getPoint: (t) => {
      const scale = 40;
      const r = Math.sqrt(t) * (1 + 0.3 * Math.sin(5 * t));
      return { x: r * Math.cos(t) * scale, y: -r * Math.sin(t) * scale };
    },
    color: "#f50057",
    speed: 0.1
  }
];

// Tipos de chocolates para la caja
const chocolateTypes = ["🍫", "🍬", "🍩", "🟤", "🍪", "🤎", "🍮", "🟫"];

function generateValentineMessage(name = "Tú") {
  return `¡Sabía que dirías que sí! Pero espera, tengo algo más para ti...`;
}

const themes = {
  pink: "from-pink-100 via-pink-200 to-rose-200",
  dark: "from-zinc-900 via-rose-900 to-black"
};

function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-float text-pink-400"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${12 + Math.random() * 24}px`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

function NightSky() {
  return (
    <div className="night-sky">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
}

export default function Valentine() {
  const zoneRef = useRef(null);
  const noBtnRef = useRef(null);
  const canvasRef = useRef(null);

  // Estados de navegación
  const [step, setStep] = useState("intro");
  const [theme, setTheme] = useState("pink");
  const [yesScale, setYesScale] = useState(1);
  const [noStage, setNoStage] = useState(0);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [flowerStage, setFlowerStage] = useState(0);
  const [threadProgress, setThreadProgress] = useState(0);
  const [dollIndex, setDollIndex] = useState(0);
  const [animatingDoll, setAnimatingDoll] = useState(false);

  // Estados para Linternas
  const [wish, setWish] = useState("");
  const [isLanternFlying, setIsLanternFlying] = useState(false);

  // Estados para Matemáticas
  const [mathIndex, setMathIndex] = useState(0);
  const mathCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Estados para Rompecabezas
  const [puzzleTiles, setPuzzleTiles] = useState([8, 2, 4, 6, 0, 1, 3, 5, 7]);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // Estados para Chocolates
  const [chocolates, setChocolates] = useState(
    Array.from({ length: 16 }).map(() => ({
      type: chocolateTypes[Math.floor(Math.random() * chocolateTypes.length)],
      eaten: false
    }))
  );

  const name = "Kiyozawa";
  const btnStyle = "group flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-500 rounded-full font-bold shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer min-w-[140px]";

  // --- EFECTO DE FONDO ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- LÓGICA DE DIBUJO MATEMÁTICO ---
  useEffect(() => {
    if (step !== "math") return;
    const canvas = mathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.translate(rect.width / 2, rect.height / 2);

    const currentFunc = mathFunctions[mathIndex];
    let t;
    let maxT;
    let isCartesian = currentFunc.type === "cartesian";

    if (isCartesian) {
      t = currentFunc.range[0];
      maxT = currentFunc.range[1];
    } else {
      t = 0;
      maxT = currentFunc.range;
    }
    const speed = currentFunc.speed || 0.05;

    ctx.clearRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentFunc.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = currentFunc.color;

    let lastPoint = isCartesian ? currentFunc.getPoint(t) : currentFunc.getPoint(0);
    if (!isCartesian) { ctx.beginPath(); ctx.moveTo(lastPoint.x, lastPoint.y); }

    const animate = () => {
      if (t > maxT) return;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      for (let i = 0; i < 10; i++) {
        t += speed;
        if (t > maxT) break;
        const p = currentFunc.getPoint(t);
        ctx.lineTo(p.x, p.y);
        lastPoint = p;
      }
      ctx.stroke();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [step, mathIndex]);

  // --- LÓGICA DEL ROMPECABEZAS ---
  const handleTileClick = (index) => {
    if (isPuzzleSolved) return;
    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      const newTiles = [...puzzleTiles];
      const temp = newTiles[index];
      newTiles[index] = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = temp;
      setPuzzleTiles(newTiles);
      setSelectedTileIndex(null);
      const isSolved = newTiles.every((val, i) => val === i);
      if (isSolved) {
        setIsPuzzleSolved(true);
        fireConfetti();
      }
    }
  };

  // --- LÓGICA DE CHOCOLATES ---
  const eatChocolate = (index) => {
    if (chocolates[index].eaten) return;
    const newChocos = [...chocolates];
    newChocos[index].eaten = true;
    setChocolates(newChocos);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: Math.random(), y: Math.random() * 0.5 + 0.2 },
      colors: ['#5D4037', '#8D6E63', '#FFAB91']
    });
  };

  const refillChocolates = () => {
    setChocolates(
      Array.from({ length: 16 }).map(() => ({
        type: chocolateTypes[Math.floor(Math.random() * chocolateTypes.length)],
        eaten: false
      }))
    );
    fireConfetti();
  };

  // --- FUNCIONES AUXILIARES ---
  const fireConfetti = () => {
    confetti({
      particleCount: 260,
      spread: 150,
      startVelocity: 60,
      origin: { x: 0.5, y: 0.5 }
    });
  };
  
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const moveNo = (x, y) => {
    if (!zoneRef.current || !noBtnRef.current) return;
    const zone = zoneRef.current.getBoundingClientRect();
    const btn = noBtnRef.current.getBoundingClientRect();
    let dx = btn.left + btn.width / 2 - x;
    let dy = btn.top + btn.height / 2 - y;
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;
    let left = btn.left - zone.left + dx * 160;
    let top = btn.top - zone.top + dy * 160;
    noBtnRef.current.style.left = clamp(left, 0, zone.width - btn.width) + "px";
    noBtnRef.current.style.top = clamp(top, 0, zone.height - btn.height) + "px";
    setYesScale(s => Math.min(2.3, s + 0.12));
  };

  const handleThreadClick = () => {
    if (threadProgress < 100) {
      setThreadProgress(prev => Math.min(prev + 10, 100));
      if (threadProgress + 10 >= 100) fireConfetti();
    }
  };

  const handleDollClick = () => {
    if (dollIndex < dollsConfig.length - 1 && !animatingDoll) {
      setAnimatingDoll(true);
      setTimeout(() => {
        setDollIndex(prev => prev + 1);
        setAnimatingDoll(false);
      }, 500);
    } else if (dollIndex === dollsConfig.length - 1) {
      fireConfetti();
    }
  };

  const startX = 10 + (40 * (threadProgress / 100));
  const endX = 90 - (40 * (threadProgress / 100));
  const curveY = 150 + (100 * (1 - threadProgress / 100));

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[theme]} transition-colors duration-700 overflow-hidden relative`}>
      {step === "lanterns" ? <NightSky /> : <FloatingHearts />}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {step !== "lanterns" && (
        <div className="fixed top-4 right-4 z-20 flex gap-2">
          {Object.keys(themes).map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`w-8 h-8 rounded-full border-2 ${theme === t ? "border-white scale-110" : "border-white/40"} transition`} style={{ background: t === "pink" ? "#fb7185" : "#18181b" }} />
          ))}
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center p-4">
        <main className={`relative z-10 w-full rounded-3xl p-4 text-center 
                    ${['intro', 'question', 'celebration'].includes(step) ? 'shadow-2xl bg-white/80 backdrop-blur-xl max-w-xl' : 'max-w-4xl'}`}>

          {/* --- PASO 1-3: INTRO, PREGUNTA, CELEBRACIÓN --- */}
          {step === "intro" && (
            <div className="animate-pop p-8">
              <h1 className="text-4xl font-extrabold mb-6">🌷💖 Querido {name}, amor mío 💖🌷</h1>
              <p className="mb-8 opacity-80">Tengo algo especial para ti, algo que ha estado en mi mente y quería preguntarte...</p>
              <button onClick={() => setStep("question")} className="px-10 py-4 bg-pink-500 text-white rounded-full text-xl font-bold hover:scale-105 transition shadow-lg">Continuar →</button>
            </div>
          )}

          {step === "question" && (
            <div className="p-8">
              <h1 className="text-4xl font-extrabold mb-8">¿Quieres ser mi San Valentín? 💖💐</h1>
              <section ref={zoneRef} onPointerMove={e => { const b = noBtnRef.current.getBoundingClientRect(); const d = Math.hypot(b.left + b.width / 2 - e.clientX, b.top + b.height / 2 - e.clientY); if (d < 140) moveNo(e.clientX, e.clientY); }} className="relative mx-auto w-full max-w-md h-40 touch-none">
                <button onClick={() => { fireConfetti(); setStep("celebration"); }} style={{ transform: `translateY(-50%) scale(${yesScale})`, boxShadow: yesScale > 1.6 ? "0 0 40px rgba(236,72,153,.9)" : undefined }} className="absolute left-[15%] top-1/2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transition animate-glow z-10">¡Sí! 💘</button>
                <button ref={noBtnRef} onClick={() => { setNoStage(s => { const next = Math.min(noMessages.length - 1, s + 1); if (next === noMessages.length - 1) setTimeout(() => { fireConfetti(); setStep("celebration"); }, 1500); return next; }); setYesScale(s => Math.min(3.2, s + 0.3)); }} className={`absolute left-[60%] top-1/2 -translate-y-1/2 px-8 py-4 rounded-full font-bold shadow-lg select-none transition-all duration-300 ${noStage > 4 ? "opacity-60 rotate-6" : ""} ${noStage > 6 ? "scale-75 blur-[1px]" : ""} bg-gray-200 text-gray-700`}>No 😐</button>
              </section>
              {noStage > 0 && (<div className="mt-8 space-y-2 min-h-[60px]"><p className="text-pink-600 font-semibold animate-pop">{noMessages[noStage]}</p></div>)}
            </div>
          )}

          {step === "celebration" && (
            <div className="animate-pop flex flex-col items-center p-8">
              <h2 className="text-5xl font-extrabold text-pink-600 animate-glow mb-6">¡SIIII! 💖🎉</h2>
              <p className="max-w-md mx-auto opacity-90 text-lg mb-8">{generateValentineMessage(name)}</p>
              <img className="mx-auto mb-8 max-w-xs rounded-lg shadow-lg" src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG10N2dpY25tcjJsbjhodGwwbTI5ZTQ3bmpyMTVyN3ptczYxMGtzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mxoL7edV2tld4H5VSt/giphy.gif" alt="Celebración" />
              <button onClick={() => setStep("letter")} className={btnStyle}>Siguiente <span>➡️</span></button>
            </div>
          )}

          {/* --- PASO 4-6: CARTA, FLORES, HILO --- */}
          {step === "letter" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[60vh]">
              <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-md">Una carta para ti 💌</h2>
              <div className={`envelope-container ${isLetterOpen ? 'open' : ''}`} onClick={() => setIsLetterOpen(!isLetterOpen)}>
                <div className="envelope"><div className="pocket"></div><div className="letter"><div className="text-left w-full h-full text-gray-800 text-sm leading-relaxed font-serif overflow-y-auto"><p className="font-bold mb-2">Para: {name}</p><p>Hola mi amor! ❤️<br /><br />Esto es solo el principio. Tengo miles de millones de razones para amarte, pero hoy quiero decírtelo de una forma única y especial. ¡Espero que te guste tanto cómo a mi me gustó hacerlo!<br /><br />Haz clic en siguiente para descubrir más...</p><p className="text-right mt-4 font-bold text-pink-500">Con amor, Mari</p></div></div></div>
              </div>
              <p className="text-white/80 mt-12 mb-8 text-sm animate-pulse">{isLetterOpen ? "Toca el sobre para cerrarlo" : "Toca el sobre para abrirlo"}</p>
              <div className="flex gap-4"><button onClick={() => setStep("celebration")} className={btnStyle}><span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás</button><button onClick={() => setStep("flowers")} className={btnStyle}>Siguiente <span className="group-hover:translate-x-1 transition-transform">➡️</span></button></div>
            </div>
          )}

          {step === "flowers" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[70vh] py-8">
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Algo que descubrí sobre las flores (花言葉)</h2>
              <p className="text-white/80 mb-12 italic">Toca las canastas para descubrir el mensaje...</p>
              <div className="baskets-container cursor-pointer select-none" onClick={() => { if (flowerStage < basketsConfig.length) { setFlowerStage(s => s + 1); fireConfetti(); } }}>
                {basketsConfig.map((basket, index) => (
                  <div key={basket.id} className={`basket-wrapper ${index < flowerStage ? 'filled' : ''}`}>
                    <div className={`flowers-cluster ${basket.count > 50 ? 'cluster-huge' : ''}`}>{Array.from({ length: Math.min(basket.count, 50) }).map((_, i) => (<span key={i} className="flower" style={{ animationDelay: `${Math.random() * 0.3}s`, transform: `rotate(${Math.random() * 30 - 15}deg) scale(${0.8 + Math.random() * 0.4})` }}>{basket.emoji}</span>))}{basket.count > 50 && <span className="absolute -top-6 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">x108</span>}</div>
                    <div className="basket"></div><div className="basket-label"><div className="text-sm font-bold text-pink-600">{basket.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">{flowerStage === basketsConfig.length && (<div className="animate-pop mb-4"><p className="text-2xl font-bold text-white drop-shadow-lg text-center">Te adoro y te amo en todos los idiomas y colores 🌈❤️</p></div>)}<div className="flex gap-4"><button onClick={() => setStep("letter")} className={btnStyle}><span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás</button>{flowerStage === basketsConfig.length && (<button onClick={() => setStep("redThread")} className={btnStyle}>Siguiente <span className="group-hover:translate-x-1 transition-transform">➡️</span></button>)}</div></div>
            </div>
          )}

          {step === "redThread" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[70vh]">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Algo que descubrí sobre lo que sentimos y la distancia (運命の赤い糸)</h2>
              <p className="text-white/80 mb-6 italic">La distancia no importa, ya estamos conectados. Toca para acercarnos...</p>
              <div className="red-thread-container" onClick={handleThreadClick}>
                <div className="map-bg"></div>
                <svg className="thread-svg" viewBox="0 0 600 300"><path d={`M ${startX * 6} 150 Q 300 ${curveY} ${endX * 6} 150`} className="thread-path" /></svg>
                <div className="avatar" style={{ left: `${startX}%` }}>👩🏻‍💻<div className="avatar-label">Maria 💜</div></div>
                <div className="avatar" style={{ left: `${endX}%` }}>🧑🏻‍🏫<div className="avatar-label">Kiyozawa 💙</div></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl transition-transform duration-500" style={{ transform: `translate(-50%, -50%) scale(${threadProgress >= 100 ? 1.5 : 0})`, opacity: threadProgress >= 100 ? 1 : 0 }}>❤️</div>
              </div>
              <div className="mt-8 flex gap-4"><button onClick={() => setStep("flowers")} className={btnStyle}><span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás</button>{threadProgress >= 100 && (<button onClick={() => setStep("matryoshkas")} className={btnStyle}>Siguiente <span className="group-hover:translate-x-1 transition-transform">➡️</span></button>)}</div>
            </div>
          )}

          {/* --- PASO 7: MATRYOSHKAS --- */}
          {step === "matryoshkas" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[70vh]">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Algo que descubrí sobre la profundidad de mis sentimientos por ti (Непрерывность) 🪆</h2>
              <p className="text-white/80 mb-8 italic">Con cada capa, descubro algo nuevo de ti. Toca la muñeca.</p>
              <div className="matryoshka-container" onClick={handleDollClick}>
                <div className={`doll-wrapper ${animatingDoll ? 'doll-open-anim' : ''}`}>
                  <div style={{ fontSize: `${dollsConfig[dollIndex].size}px` }} className="drop-shadow-2xl filter transition-all hover:scale-105 cursor-pointer">{dollIndex === dollsConfig.length - 1 ? '💖' : '🪆'}</div>
                </div>
                <div key={dollIndex} className="doll-message">{dollsConfig[dollIndex].text}</div>
              </div>
              <div className="mt-8 flex gap-4">
                <button onClick={() => setStep("redThread")} className={btnStyle}><span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás</button>
                <button onClick={() => setStep("lanterns")} className={btnStyle}>Siguiente ➡️</button>
              </div>
            </div>
          )}

          {/* --- PASO 8: LINTERNAS --- */}
          {step === "lanterns" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[80vh]">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md text-amber-100">Un Deseo al Cielo 🏮</h2>
              {!isLanternFlying ? (
                <>
                  <p className="text-white/80 mb-6 italic max-w-md">Escribe un deseo para nosotros y lánzalo al universo.</p>
                  <div className="lantern-container"><div className="lantern"><div className="wish-text-display">{wish || "Tu deseo aquí..."}</div></div></div>
                  <input type="text" placeholder="Escribe tu deseo..." className="w-64 px-4 py-2 rounded-full text-center text-gray-800 shadow-lg focus:outline-none mb-6 font-serif" maxLength={50} value={wish} onChange={(e) => setWish(e.target.value)} />
                  <div className="flex gap-4">
                    <button onClick={() => setStep("matryoshkas")} className={btnStyle}><span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás</button>
                    <button onClick={() => { if (wish) setIsLanternFlying(true); }} disabled={!wish} className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all ${wish ? 'bg-orange-500 text-white hover:scale-105 hover:bg-orange-400 cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>Lanzar al cielo ✨</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="lantern-container fly-away"><div className="lantern"><div className="wish-text-display">{wish}</div></div></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-pop" style={{ animationDelay: '2s' }}>
                    <p className="text-2xl text-amber-100 font-serif italic mb-4">"Que nuestros caminos sigan brillando juntos."</p>
                    <button onClick={() => setStep("math")} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-500 hover:scale-105 transition animate-pulse">Una sorpresa desde uno de mis lenguajes 📐❤️</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- PASO 9: MATEMÁTICAS --- */}
          {step === "math" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[80vh]">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Te amo con toda la lógica del universo 🌌</h2>
              <p className="text-white/80 mb-2 font-bold text-xl">{mathFunctions[mathIndex].name}</p>
              <p className="text-white/60 mb-6 italic font-mono text-sm bg-black/40 px-3 py-1 rounded inline-block">
                {mathFunctions[mathIndex].formula}
              </p>
              <div className="relative w-full max-w-2xl h-[500px] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl flex items-center justify-center mb-8 overflow-hidden">
                <canvas ref={mathCanvasRef} className="w-full h-full" />
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-6 items-center">
                  <button onClick={() => setMathIndex(prev => (prev - 1 + mathFunctions.length) % mathFunctions.length)} className={btnStyle}>⬅️ Anterior</button>
                  <span className="text-white/80 font-bold">{mathIndex + 1} / {mathFunctions.length}</span>
                  <button onClick={() => setMathIndex(prev => (prev + 1) % mathFunctions.length)} className={btnStyle}>Siguiente ➡️</button>
                </div>
                <button
                  onClick={() => { setIsPuzzleSolved(false); setStep("puzzle"); }}
                  className="mt-4 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xl font-bold hover:scale-105 transition shadow-lg animate-pulse border-2 border-white/50"
                >
                  Continuar ✨
                </button>
              </div>
            </div>
          )}

          {/* --- PASO 10: ROMPECABEZAS --- */}
          {step === "puzzle" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[80vh] p-4">
              {!isPuzzleSolved ? (
                <>
                  <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">Acomoda mi corazón 🧩</h2>
                  <p className="text-white/90 mb-8 italic max-w-lg text-lg">
                    "Gracias por recorrer este pequeño viaje digital conmigo. No importa si es código, flores, hilo rojo o matemáticas..."
                  </p>
                  <div className="puzzle-container">
                    {puzzleTiles.map((tileIndex, i) => (
                      <div
                        key={i}
                        onClick={() => handleTileClick(i)}
                        className={`puzzle-piece ${selectedTileIndex === i ? 'selected' : ''}`}
                        style={{
                          backgroundImage: `url(${PUZZLE_IMAGE})`,
                          backgroundPosition: `${(tileIndex % 3) * 50}% ${Math.floor(tileIndex / 3) * 50}%`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm">Toca dos piezas para intercambiarlas.</p>
                  <button
                    onClick={() => {
                      setIsPuzzleSolved(true);
                    }}
                    className="mt-4 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xl font-bold hover:scale-105 transition shadow-lg animate-pulse border-2 border-white/50"
                  >
                    Ver mi carta ✨
                  </button>
                </>
              ) : (
                <div className="mexican-letter-container">
                  <h3 className="text-3xl font-bold mb-6 text-center text-red-700 font-serif">¡Kiyozawa, amor de mi alma!</h3>
                  <div className="space-y-4 text-lg font-serif leading-relaxed">
                    <p>Hemos cruzado un universo digital juntos, entre códigos, estrellas y leyendas. Pero te lo juro por lo más sagrado, <strong>ninguna ecuación matemática en este mundo es capaz de calcular la inmensidad de lo que siento por ti</strong>.</p>
                    <p>Mira que la distancia entre ambos a veces duele, duele como una herida que no cierra. A veces siento que, como dice la canción, "he renunciado a todo por quererte". Pero luego pienso en tu cara y sé que cada kilómetro, cada hora de diferencia, <strong>vale la pena</strong>.</p>
                    <p>Que lo sepa el mundo entero, de orilla a orilla: ¡Contigo está mi absoluto destino!</p>
                    <p>Te ofrezco un amor de esos antiguos, un amor bravo y sincero. Un amor que no sabe de fronteras, que "no tiene horario, ni fecha en el calendario". Estoy dispuesta a esperarte la vida entera, porque sé que al final del camino, estás tú.</p>
                    <p>Ya armaste este rompecabezas, pero la verdad es que tú armaste los pedazos de mi corazón desde el primer día.</p>
                    <p className="font-bold text-xl text-center mt-8">Te amaré por siempre, y un día más.</p>
                  </div>
                  <div className="letter-signature">Por siempre tuya -Maria</div>
                  <div className="text-center mt-8">
                    <button onClick={() => { setIsPuzzleSolved(false); setStep("puzzle"); }} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition">
                      Volver al rompecabezas ⬅️
                    </button>

                    <button onClick={() => setStep("playlist")} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition ml-4">
                      Una serenata final 🎵
                    </button>
                  </div>
                </div>
              )}

              {!isPuzzleSolved && (
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setStep("math")} className={btnStyle}>
                    <span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Atrás
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- PASO 11: PLAYLIST ETERNA --- */}
          {step === "playlist" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[80vh] p-4">
              <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Nuestra Playlist Eterna 🎶</h2>
              <p className="text-white/80 mb-12 italic max-w-2xl text-lg">
                "Porque hay cosas que solo se pueden decir con una canción. Aquí están mis promesas, hechas música."
              </p>

              <div className="playlist-container">
                {songsConfig.map((song, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <a href={song.url} target="_blank" rel="noopener noreferrer" className="song-card">
                      <div className="vinyl-record">
                        <div className="vinyl-label" style={{ background: song.color }}></div>
                      </div>
                      <div className="play-icon">▶</div>
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artist}</div>
                    </a>
                    <div className="mt-4 bg-yellow-100 text-gray-800 p-3 rounded-lg shadow-md max-w-[250px] text-sm font-serif italic relative transform rotate-1 hover:rotate-0 transition-transform">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full opacity-50"></div>
                      "{song.note}"
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setIsPuzzleSolved(true);
                    setStep("puzzle");
                  }}
                  className={btnStyle}
                >
                  ⬅️ Volver a la carta
                </button>
                <button
                  onClick={() => setStep("chocolates")}
                  className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xl font-bold hover:scale-105 transition shadow-lg animate-pulse border-2 border-white/50"
                >
                  Un dulce final 🍫
                </button>
              </div>
            </div>
          )}

          {/* --- PASO 12: CHOCOLATES (NUEVO FINAL) --- */}
          {step === "chocolates" && (
            <div className="animate-pop flex flex-col items-center justify-center min-h-[80vh] p-4">
              <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">¡Feliz San Valentín! (Honmei Choco) 💝</h2>
              <p className="text-white/90 mb-8 italic max-w-lg text-lg">
                Como en Japón, aquí están mis sentimientos verdaderos para ti. ¡No olvides lo mucho que te amo, aprecio y adoro!
              </p>

              {/* CAJA DE CHOCOLATES */}
              <div className="bg-red-800 p-6 rounded-xl shadow-2xl border-4 border-yellow-500 mb-8 max-w-md w-full relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-700 px-6 py-2 rounded-t-lg border-t-4 border-l-4 border-r-4 border-yellow-500 text-yellow-100 font-bold tracking-widest uppercase text-sm shadow-lg">
                  ¡Feliz San Valentín!
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {chocolates.map((choco, i) => (
                    <div
                      key={i}
                      onClick={() => eatChocolate(i)}
                      className={`
                        w-16 h-16 flex items-center justify-center text-4xl cursor-pointer 
                        bg-black/20 rounded-full hover:scale-110 transition-all active:scale-90
                        ${choco.eaten ? 'opacity-50 grayscale scale-90' : 'animate-bounce-slow'}
                      `}
                    >
                      {choco.eaten ? "😋" : choco.type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 flex-col items-center">
                <button
                  onClick={refillChocolates}
                  className="px-8 py-2 bg-yellow-500 text-red-900 rounded-full font-bold shadow-lg hover:bg-yellow-400 hover:scale-105 transition"
                >
                  ¡Rellenar Caja! 🍬
                </button>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep("playlist")} className={btnStyle}>
                    ⬅️ Volver a la música
                  </button>

                  <button onClick={() => setStep("intro")} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition">
                    Reiniciar este viaje de amor ↺
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}