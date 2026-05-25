import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, X, Send, Lock } from "lucide-react";
import ResultPreview from "./components/ResultPreview";
import PaymentSuccess from "./components/PaymentSuccess";
import DeepReport from "./components/DeepReport";
import { analyzeSaju } from "./utils/sajuEngine";
import TarotResult from "./components/TarotResult";

/* ── 상수 & 타로 카드 데이터 ── */
const TAROT_CARDS = [
  { name: "The Moon", korean: "달", element: "수(水)", meaning: "직관과 잠재의식의 문이 열립니다. 보이지 않는 진실이 수면 위로 떠오릅니다.", suit: "Major" },
  { name: "The Star", korean: "별", element: "풍(風)", meaning: "희망과 갱신의 에너지가 당신을 감쌉니다. 어둠 뒤에 빛이 기다립니다.", suit: "Major" },
  { name: "The Tower", korean: "탑", element: "화(火)", meaning: "급격한 변화와 각성. 파괴는 새로운 창조의 전주곡입니다.", suit: "Major" },
  { name: "Ace of Swords", korean: "검의 에이스", element: "금(金)", meaning: "지성과 결단의 칼날. 명료한 진실이 당신을 기다립니다.", suit: "Swords" },
  { name: "The Hermit", korean: "은둔자", element: "토(土)", meaning: "내면의 지혜를 찾는 여정. 고독 속에 깨달음이 있습니다.", suit: "Major" },
  { name: "Wheel of Fortune", korean: "운명의 바퀴", element: "목(木)", meaning: "순환하는 운명의 흐름. 변화의 정점에 당신이 서 있습니다.", suit: "Major" },
  { name: "The High Priestess", korean: "여교황", element: "수(水)", meaning: "신비로운 지식과 직관. 말해지지 않은 것들이 더 많은 것을 말합니다.", suit: "Major" },
  { name: "The Emperor", korean: "황제", element: "화(火)", meaning: "권위와 구조. 당신의 내면에 강인한 통치자가 깨어납니다.", suit: "Major" },
];

const OHANG = ["목(木)", "화(火)", "토(土)", "금(金)", "수(水)"];
const OHANG_COLORS = { "목(木)": [34, 197, 94], "화(火)": [239, 68, 68], "토(土)": [245, 158, 11], "금(金)": [156, 163, 175], "수(水)": [59, 130, 246] };

const GUARDIAN = {
  tarot: { name: "아스트라", title: "타로의 수호신", color: [139, 92, 246] },
  saju: { name: "천명", title: "사주의 수호신", color: [245, 158, 11] },
  fusion: { name: "아우라", title: "융합 아우라 AI", color: [236, 72, 153] },
};

/* ── 선택지별 맞춤 응답 맵 ── */
const RESPONSE_MAP = {
  // 타로 Q1: 오늘의 질문
  "사랑과 관계": "사랑... 그 에너지가 당신의 아우라 전체에 퍼져있군요.\n\n그 감정이 언제부터 시작되었나요? 갑자기 찾아왔나요, 아니면 오랫동안 쌓여온 것인가요?",
  "일과 커리어": "커리어에 대한 고민이 지금 당신의 에너지장을 무겁게 누르고 있네요.\n\n그 압박감은 언제부터였나요? 갑자기 찾아왔나요, 아니면 서서히 쌓여온 것인가요?",
  "나 자신에 관해": "자기 자신을 마주보는 용기... 그것 자체가 이미 강한 아우라입니다.\n\n그 물음이 언제부터 당신을 찾아왔나요? 갑자기였나요, 아니면 오래전부터였나요?",
  "모든 것이 뒤엉켜 있어": "그 혼돈이 느껴집니다. 여러 에너지가 동시에 충돌하고 있군요.\n\n그 혼란은 언제부터 시작되었나요? 갑자기 찾아왔나요, 아니면 서서히 쌓인 것인가요?",

  // 타로 Q2: 시작 시점
  "갑자기 찾아왔어": "갑작스러운 파동... 외부의 충격이 당신의 에너지장을 흔든 것 같습니다.\n\n이제 카드가 당신을 부릅니다. 마음을 비우고 직관이 이끄는 대로 한 장을 선택하세요.",
  "오래전부터였어": "오랫동안 혼자 안고 있었군요. 그 무게가 얼마나 깊이 쌓였는지 카드가 읽어낼 것입니다.\n\n마음을 비우고, 세 장 중 당신에게 끌리는 카드를 선택해주세요.",
  "잘 모르겠어": "모르겠다는 느낌 자체가 중요한 신호입니다. 이미 무언가가 당신 안에서 움직이고 있어요.\n\n생각을 내려놓고 직관으로만 카드를 선택해보세요.",
  "최근 어떤 사건 이후로": "어떤 사건이 당신의 흐름을 바꿨군요. 그 이전과 이후, 당신의 에너지가 달라졌습니다.\n\n이제 카드가 그 분기점을 읽어낼 것입니다. 직관을 믿고 선택하세요.",

  // 타로 Q4: 카드 메시지 반응
  "변화에 대한 이야기": "변화에 끌린다는 것... 당신의 내면이 이미 움직일 준비가 되어 있다는 신호입니다.\n\n더 정확한 분석을 위해 생년월일이 필요해요. 태어난 날의 에너지와 카드를 연결해보겠습니다.",
  "관계에 대한 메시지": "관계의 에너지가 지금 당신의 아우라에서 가장 강하게 진동하고 있네요.\n\n생년월일을 알려주시면 당신의 사주와 이 카드가 말하는 관계의 흐름을 연결해드리겠습니다.",
  "내면의 힘에 관한 것": "내면의 힘... 그것이 지금 당신에게 가장 필요한 것이군요. 카드도 같은 것을 가리킵니다.\n\n생년월일을 입력해주시면 당신만의 내면 에너지 지도를 완성하겠습니다.",
  "아직 잘 모르겠어": "모르겠다는 것도 솔직한 답입니다. 카드가 아직 말을 아끼고 있는 것일 수도 있어요.\n\n생년월일을 더하면 더 선명한 그림이 나올 겁니다. 알려주시겠어요?",

  // 사주 Q1: 최근 변화
  "직업이나 진로의 변화": "진로의 갈림길... 사주에서 가장 강하게 드러나는 에너지 중 하나입니다.\n\n당신이 태어난 계절이 그 흐름과 깊은 연관이 있어요. 어느 계절에 태어나셨나요?",
  "인간관계의 변화": "관계의 변화는 당신의 대인 에너지가 재편되고 있다는 신호입니다.\n\n태어난 계절의 기운이 이 변화를 어떻게 이끌고 있는지 읽어보겠습니다. 어느 계절생이신가요?",
  "내면의 변화": "내면의 변화를 감지할 수 있다는 것, 그 자체가 높은 자기 인식의 증거입니다.\n\n사주에서 내면의 흐름은 태어난 계절과 긴밀하게 연결됩니다. 어느 계절에 태어나셨나요?",
  "아직 변화를 찾고 있어": "변화를 찾고 있다는 것, 이미 움직임이 시작된 것입니다. 단지 아직 보이지 않을 뿐이에요.\n\n사주로 그 숨겨진 흐름을 찾아보겠습니다. 어느 계절에 태어나셨나요?",

  // 사주 Q2: 계절
  "봄 (3-5월)": "봄의 기운, 목(木)의 에너지가 강하게 흐르는 시기에 태어나셨군요. 성장과 시작의 힘을 타고났습니다.\n\n정확한 사주 팔자 분석을 위해 생년월일을 입력해주세요.",
  "여름 (6-8월)": "여름의 화(火) 기운... 열정과 표현의 에너지를 타고난 분이시군요. 그 빛이 느껴집니다.\n\n생년월일을 입력해주시면 당신의 팔자를 완성하겠습니다.",
  "가을 (9-11월)": "가을의 금(金) 기운, 결단과 수확의 에너지를 품고 태어나셨네요. 단단한 내면이 보입니다.\n\n생년월일을 입력해주시면 더 정밀하게 분석해드리겠습니다.",
  "겨울 (12-2월)": "겨울의 수(水) 기운... 깊은 직관과 지혜를 품고 태어난 영혼이시군요.\n\n생년월일을 입력해주시면 당신의 사주 팔자를 완성하겠습니다.",

  // 사주 Q4: 필요한 에너지
  "성장과 확장의 기운": "목(木)의 성장 에너지를 원하고 있군요. 지금 당신의 사주 흐름과 맞닿아 있습니다.\n\n분석이 거의 완성되었습니다. 잠시만 기다려주세요...",
  "열정과 변화의 기운": "화(火)의 열정 에너지를 갈망하고 있군요. 내면이 이미 변화를 준비하고 있다는 신호입니다.\n\n분석이 거의 완성되었습니다. 잠시만 기다려주세요...",
  "안정과 기반의 기운": "토(土)의 안정 에너지... 지금 당신에게 가장 필요한 것이 단단한 기반이군요.\n\n분석이 거의 완성되었습니다. 잠시만 기다려주세요...",
  "예리함과 결단의 기운": "금(金)의 결단 에너지를 원하는군요. 지금 당신 앞에 선택의 순간이 다가오고 있습니다.\n\n분석이 거의 완성되었습니다. 잠시만 기다려주세요...",

  // 융합 Q1: 색깔
  "보라색 - 신비롭고 깊은": "보라... 수(水)와 목(木)의 경계에서 피어나는 색입니다. 당신의 에너지장이 깊고 신비롭게 진동하고 있어요.\n\n최근 반복적으로 떠오르는 이미지가 있나요?",
  "붉은색 - 강렬하고 뜨거운": "붉은 에너지, 화(火)의 기운이 강하게 흐르고 있군요. 지금 당신 내면에 무언가 강렬하게 타오르고 있습니다.\n\n최근 자꾸 떠오르는 이미지나 꿈이 있나요?",
  "파란색 - 고요하고 넓은": "파란 에너지, 수(水)의 기운이 깊고 넓게 흐르는군요. 고요한 표면 아래 강한 흐름이 있습니다.\n\n최근 반복적으로 떠오르는 이미지가 있나요?",
  "금색 - 찬란하고 귀한": "금빛 에너지, 금(金)과 화(火)의 교차점에 있군요. 빛나고자 하는 욕구가 강합니다.\n\n최근 자꾸 떠오르는 이미지나 꿈이 있나요?",

  // 융합 Q2: 반복 이미지
  "물이나 바다": "물의 이미지... 수(水) 기운이 당신 무의식 깊이 흐르고 있습니다. 직관과 감수성이 지금 가장 강하게 깨어있어요.\n\n사주와 타로를 완전히 융합하기 위해 생년월일이 필요합니다.",
  "불이나 빛": "불과 빛의 이미지... 화(火) 에너지가 무의식에서 피어오르고 있습니다. 변화와 표현의 욕구가 강하게 끓고 있어요.\n\n융합 분석을 완성하기 위해 생년월일을 알려주세요.",
  "숲이나 나무": "숲과 나무... 목(木) 에너지의 강한 신호입니다. 성장에 대한 욕구가 무의식 깊이 자리하고 있군요.\n\n생년월일을 입력해주시면 융합 분석을 시작하겠습니다.",
  "하늘이나 별": "하늘과 별... 금(金)과 수(水)가 교차하는 에너지입니다. 높은 곳을 향한 의지와 깊은 지혜가 공존하는군요.\n\n생년월일을 알려주시면 완전한 융합 분석을 시작하겠습니다.",
  "특별한 것은 없어": "특별한 이미지가 없다는 것도 하나의 신호입니다. 에너지가 내면 깊이 잠들어 있는 상태일 수 있어요.\n\n사주가 그 잠든 에너지를 깨울 것입니다. 생년월일을 알려주세요.",

  // 융합 Q5: 결과 반응
  "내가 아는 내 모습 그대로야": "그렇군요. 자신을 명확히 알고 있다는 것 자체가 강한 힘입니다.\n\n사주와 타로가 일치된 당신의 아우라 분석이 완성되었습니다.",
  "몰랐던 나의 모습을 발견했어": "새로운 자신을 만나는 순간이군요. 이것이 바로 아우라 분석이 존재하는 이유입니다.\n\n당신의 운명 지도가 완성되었습니다.",
  "반은 맞고 반은 모르겠어": "그 반반의 경계에서 진짜 당신이 숨어 있습니다. 아직 발견되지 않은 에너지가 남아있어요.\n\n지금 보이는 것만으로도 충분히 강력한 분석입니다.",
  "더 깊이 알고 싶어": "그 탐구의 에너지 자체가 당신의 가장 강한 힘입니다.\n\n심층 결과에서 지금보다 훨씬 더 깊은 이야기를 들려드리겠습니다.",

  // 타로 Q3: 카드 키워드 반응
  "희망과 새로운 시작": "희망이라는 단어가 당신 안에서 공명하는군요. 그것은 이미 당신 내면에 그 에너지가 준비되어 있다는 신호입니다.\n\n분석을 완성하기 위해 생년월일이 필요합니다. 태어난 날의 에너지와 이 카드를 연결해볼게요.",
  "숨겨진 진실의 발견": "진실을 마주하고자 하는 용기... 지금 당신의 아우라에서 가장 강하게 진동하는 에너지입니다.\n\n생년월일을 알려주시면 그 진실이 어디서 오는지 사주와 함께 읽어드리겠습니다.",
  "내면의 용기와 힘": "내면의 힘이 공명한다는 것, 이미 당신은 그 힘을 느끼고 있다는 뜻입니다.\n\n생년월일을 더하면 그 힘이 언제 가장 강하게 발현되는지 알 수 있습니다.",
  "변화와 결단의 순간": "변화와 결단... 지금 당신 앞에 실제로 선택의 기로가 있는 것 같군요.\n\n생년월일을 입력해주시면 그 결단의 타이밍을 사주로 읽어드리겠습니다.",
};

const CHAT_FLOWS = {
  tarot: [
    { from: "ai", text: "...당신의 아우라가 저에게 닿습니다. 파동이 느껴지는군요.\n\n오늘, 당신 마음 속 가장 무거운 질문이 무엇인가요?", options: ["사랑과 관계", "일과 커리어", "나 자신에 관해", "모든 것이 뒤엉켜 있어"] },
    { from: "ai", text: "__RESPONSE__", special: "tarot_flip" },
    { from: "ai", text: "__CARD_RESPONSE__", options: ["희망과 새로운 시작", "숨겨진 진실의 발견", "내면의 용기와 힘", "변화와 결단의 순간"] },
    { from: "ai", text: "__RESPONSE__", special: "birth_input" },
  ],
  saju: [
    { from: "ai", text: "천명이 당신을 기다리고 있었습니다.\n\n사주는 태어난 순간의 우주 에너지를 읽습니다. 요즘 당신의 삶에서 가장 크게 느껴지는 변화는 무엇인가요?", options: ["직업이나 진로의 변화", "인간관계의 변화", "내면의 변화", "아직 변화를 찾고 있어"] },
    { from: "ai", text: "__RESPONSE__", options: ["봄 (3-5월)", "여름 (6-8월)", "가을 (9-11월)", "겨울 (12-2월)"] },
    { from: "ai", text: "__RESPONSE__", special: "birth_input" },
    { from: "ai", text: "__RESPONSE__", options: ["성장과 확장의 기운", "열정과 변화의 기운", "안정과 기반의 기운", "예리함과 결단의 기운"] },
  ],
  fusion: [
    { from: "ai", text: "아우라 AI가 당신의 에너지장을 스캔하고 있습니다...\n\n지금 이 순간, 당신이 느끼는 감각을 색으로 표현한다면 어떤 색인가요?", options: ["보라색 - 신비롭고 깊은", "붉은색 - 강렬하고 뜨거운", "파란색 - 고요하고 넓은", "금색 - 찬란하고 귀한"] },
    { from: "ai", text: "__RESPONSE__", options: ["물이나 바다", "불이나 빛", "숲이나 나무", "하늘이나 별", "특별한 것은 없어"] },
    { from: "ai", text: "__RESPONSE__", special: "birth_input" },
    { from: "ai", text: "사주 데이터를 기반으로 타로 카드를 뽑겠습니다. 직관에 따라 카드를 선택해주세요.", special: "tarot_flip" },
    { from: "ai", text: "__RESPONSE__", options: ["내가 아는 내 모습 그대로야", "몰랐던 나의 모습을 발견했어", "반은 맞고 반은 모르겠어", "더 깊이 알고 싶어"] },
  ],
};

/* ── Canvas 아우라 구체 ── */
function AuraOrb({ mood, auraColor, intensity = 1 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 320;
    const H = canvas.height = 320;
    const cx = W / 2, cy = H / 2;

    const [r, g, b] = auraColor;

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // 외부 파동 링
      for (let i = 3; i >= 0; i--) {
        const wave = Math.sin(t * 0.8 + i * 0.7) * 18 * intensity;
        const radius = 80 + i * 28 + wave;
        const alpha = (0.06 - i * 0.012) * intensity;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 2 + i;
        ctx.stroke();
      }

      // 내부 글로우
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      grd.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},0.45)`);
      grd.addColorStop(0.8, `rgba(${r},${g},${b},0.12)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // 하이라이트
      const hGrd = ctx.createRadialGradient(cx - 22, cy - 22, 0, cx - 22, cy - 22, 44);
      hGrd.addColorStop(0, `rgba(255,255,255,0.45)`);
      hGrd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 66, 0, Math.PI * 2);
      ctx.fillStyle = hGrd;
      ctx.fill();

      // 파티클
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * (0.3 + i * 0.04);
        const dist = 80 + Math.sin(t * 1.2 + i * 0.5) * 22 * intensity;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const ps = 2 + Math.sin(t + i) * 1.5;
        const pa = 0.4 + Math.sin(t * 0.7 + i) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pa})`;
        ctx.fill();
      }
    }

    function loop(ts) {
      timeRef.current = ts * 0.001;
      draw(timeRef.current);
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [auraColor, intensity]);

  return <canvas ref={canvasRef} style={{ width: 320, height: 320, filter: "blur(0.3px)" }} />;
}

/* ── 타로 카드 플립 컴포넌트 ── */
function TarotFlip({ onSelect }) {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [selected, setSelected] = useState(null);
  const cards = useRef([
    TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)],
    TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)],
    TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)],
  ]);

  const handleFlip = (i) => {
    if (selected !== null) return;
    setFlipped(prev => { const n = [...prev]; n[i] = true; return n; });
    setTimeout(() => {
      setSelected(i);
      onSelect(cards.current[i]);
    }, 700);
  };

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "16px 0" }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          onClick={() => handleFlip(i)}
          style={{ cursor: selected !== null ? "default" : "pointer", perspective: 600, width: 80, height: 130 }}
          whileHover={selected === null ? { y: -8 } : {}}
        >
          <motion.div
            animate={{ rotateY: flipped[i] ? 180 : 0 }}
            transition={{ duration: 0.7 }}
            style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
          >
            {/* 카드 뒷면 */}
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
              borderRadius: 10, border: "1px solid rgba(139,92,246,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ fontSize: 28, opacity: 0.6 }}>✦</div>
            </div>
            {/* 카드 앞면 */}
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
              borderRadius: 10, border: "1px solid rgba(139,92,246,0.8)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: 8, gap: 6
            }}>
              <div style={{ fontSize: 22 }}>☽</div>
              <div style={{ fontSize: 10, color: "#c4b5fd", textAlign: "center", lineHeight: 1.4, fontWeight: 600 }}>
                {cards.current[i].name}
              </div>
              <div style={{ fontSize: 8, color: "#7c3aed", textAlign: "center" }}>
                {cards.current[i].korean}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── 생년월일 입력 컴포넌트 ── */
const TIME_SLOTS = [
  { label: "자시 (밤 11시 ~ 새벽 1시)", value: "23:00" },
  { label: "축시 (새벽 1시 ~ 3시)",     value: "01:00" },
  { label: "인시 (새벽 3시 ~ 5시)",     value: "03:00" },
  { label: "묘시 (오전 5시 ~ 7시)",     value: "05:00" },
  { label: "진시 (오전 7시 ~ 9시)",     value: "07:00" },
  { label: "사시 (오전 9시 ~ 11시)",    value: "09:00" },
  { label: "오시 (오전 11시 ~ 오후 1시)", value: "11:00" },
  { label: "미시 (오후 1시 ~ 3시)",     value: "13:00" },
  { label: "신시 (오후 3시 ~ 5시)",     value: "15:00" },
  { label: "유시 (오후 5시 ~ 7시)",     value: "17:00" },
  { label: "술시 (오후 7시 ~ 9시)",     value: "19:00" },
  { label: "해시 (오후 9시 ~ 11시)",    value: "21:00" },
];

function BirthInput({ onSubmit }) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [showTimeSelect, setShowTimeSelect] = useState(false);

  return (
    <div style={{
      background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)",
      borderRadius: 14, padding: 18, marginTop: 8
    }}>
      <div style={{ fontSize: 14, color: "#a78bfa", marginBottom: 12, fontWeight: 700, letterSpacing: 1 }}>
        ✦ 사주 데이터 입력
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* 생년월일 */}
        <div>
          <label style={{ fontSize: 14, color: "#c4b5fd", display: "block", marginBottom: 6, fontWeight: 600 }}>
            생년월일 <span style={{ color: "#f87171", fontSize: 12 }}>*필수</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 10, padding: "12px 14px", color: "#e2e8f0", fontSize: 15,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* 태어난 시간 — 한국 시진 선택 */}
        <div>
          <label style={{ fontSize: 14, color: "#c4b5fd", display: "block", marginBottom: 6, fontWeight: 600 }}>
            태어난 시간 <span style={{ color: "#6b7280", fontSize: 12 }}>(선택 · 더 정확한 분석에 활용)</span>
          </label>

          {/* 토글 버튼 */}
          <div
            onClick={() => setShowTimeSelect(!showTimeSelect)}
            style={{
              padding: "12px 14px", background: "rgba(0,0,0,0.4)",
              border: `1px solid ${timeSlot ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.2)"}`,
              borderRadius: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              color: timeSlot ? "#c4b5fd" : "#4b5563", fontSize: 14,
            }}
          >
            <span>{timeSlot ? TIME_SLOTS.find(t => t.value === timeSlot)?.label : "태어난 시간대를 선택하세요"}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{showTimeSelect ? "▲" : "▼"}</span>
          </div>

          {/* 드롭다운 목록 */}
          {showTimeSelect && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 6, background: "rgba(13,8,32,0.98)",
                border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10,
                overflow: "hidden", maxHeight: 220, overflowY: "auto",
              }}
            >
              {/* 모름 선택지 */}
              <div
                onClick={() => { setTimeSlot(""); setShowTimeSelect(false); }}
                style={{
                  padding: "11px 14px", cursor: "pointer", fontSize: 14,
                  color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: !timeSlot ? "rgba(139,92,246,0.1)" : "transparent",
                }}
              >
                ⟆ 잘 모르겠어요
              </div>
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.value}
                  onClick={() => { setTimeSlot(slot.value); setShowTimeSelect(false); }}
                  style={{
                    padding: "11px 14px", cursor: "pointer", fontSize: 14,
                    color: timeSlot === slot.value ? "#c4b5fd" : "#9ca3af",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: timeSlot === slot.value ? "rgba(139,92,246,0.15)" : "transparent",
                    display: "flex", justifyContent: "space-between",
                  }}
                >
                  <span>{slot.label}</span>
                  {timeSlot === slot.value && <span style={{ color: "#a78bfa" }}>✓</span>}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* 확인 버튼 */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => date && onSubmit(date, timeSlot)}
          disabled={!date}
          style={{
            marginTop: 4, padding: "14px 0",
            background: date ? "linear-gradient(90deg,#7c3aed,#9333ea)" : "rgba(139,92,246,0.15)",
            border: "none", borderRadius: 10,
            color: date ? "#fff" : "#6d28d9", fontSize: 15,
            fontWeight: 800, cursor: date ? "pointer" : "default", letterSpacing: 1,
            fontFamily: "inherit",
          }}
        >
          {date ? "아우라 분석 시작 →" : "생년월일을 먼저 입력해주세요"}
        </motion.button>
      </div>
    </div>
  );
}

/* ── 페이월 모달 ── */
function PaywallModal({ onClose, guardianColor }) {
  const [r, g, b] = guardianColor;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }} transition={{ type: "spring", damping: 22 }}
        style={{
          background: "linear-gradient(145deg, #0a0a1a 0%, #0f0f2a 100%)",
          border: `1px solid rgba(${r},${g},${b},0.4)`,
          borderRadius: 20, padding: "32px 24px", maxWidth: 380, width: "100%",
          position: "relative", boxShadow: `0 0 60px rgba(${r},${g},${b},0.2)`
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.08)",
          border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer",
          color: "#9ca3af", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
        }}><X size={16} /></button>

        {/* 상단 아이콘 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 48, display: "block" }}
          >✦</motion.div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 8, letterSpacing: 1 }}>
            심층 운명 리포트
          </div>
          <div style={{ fontSize: 12, color: `rgba(${r},${g},${b},0.9)`, marginTop: 4, letterSpacing: 2 }}>
            AURA DEEP ANALYSIS
          </div>
        </div>

        {/* 혜택 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            "고화질 아우라 부적 이미지 (A4 인쇄용)",
            "30페이지 사주 + 타로 융합 리포트 PDF",
            "2026년 월별 운세 캘린더",
            "AI 수호신과 1:1 심층 대화 (무제한)",
            "아우라 변화 추적 앱 3개월 이용권",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: `rgba(${r},${g},${b},0.2)`,
                border: `1px solid rgba(${r},${g},${b},0.5)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: `rgb(${r},${g},${b})` }} />
              </div>
              <span style={{ fontSize: 13, color: "#d1d5db" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* 가격 */}
        <div style={{
          background: `rgba(${r},${g},${b},0.08)`,
          border: `1px solid rgba(${r},${g},${b},0.2)`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#6b7280", textDecoration: "line-through", marginBottom: 2 }}>정가 ₩49,000</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>₩<span style={{ color: `rgb(${r},${g},${b})` }}>9,900</span></div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>첫 분석 한정 특가 · 오늘만</div>
        </div>

        {/* 결제 버튼 - 카카오페이 스타일 */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%", padding: "15px 0",
            background: "#FEE500", border: "none", borderRadius: 12,
            color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10
          }}
        >
          <span style={{ fontSize: 18 }}>💛</span> 카카오페이로 결제
        </motion.button>

        {/* 토스 스타일 */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%", padding: "15px 0",
            background: "#0064FF", border: "none", borderRadius: 12,
            color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}
        >
          <span style={{ fontSize: 16 }}>💙</span> 토스로 간편결제
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
          <Lock size={12} style={{ color: "#4b5563" }} />
          <span style={{ fontSize: 12, color: "#4b5563" }}>256bit SSL 암호화 · 언제든 환불 가능</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── 오행 분석 카드 (sajuData 기반) ── */
function OhangCard({ birthDate, drawnCard, sajuData }) {
  // sajuData가 있으면 실제 계산값 사용, 없으면 날짜 해시로 결정론적 계산
  let ohang, dominant;
  if (sajuData) {
    dominant = sajuData.dominant;
    ohang = dominant.name;
  } else {
    // 날짜 기반 결정론적 인덱스 (렌더링마다 바뀌지 않음)
    const seed = birthDate ? new Date(birthDate).getTime() : 0;
    const idx = Math.abs(Math.floor(Math.sin(seed * 0.001) * 10000)) % OHANG.length;
    ohang = OHANG[idx];
  }
  const [r, g, b] = OHANG_COLORS[ohang] || [139, 92, 246];
  const clash = drawnCard ? ohang !== drawnCard.element : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(0,0,0,0.4)", border: `1px solid rgba(${r},${g},${b},0.4)`,
        borderRadius: 12, padding: 14, marginTop: 10, fontSize: 14
      }}
    >
      <div style={{ fontSize: 13, color: `rgb(${r},${g},${b})`, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
        ◈ 오행 분석
      </div>
      <div style={{ color: "#d1d5db", lineHeight: 1.8, fontSize: 15 }}>
        <span style={{ color: `rgb(${r},${g},${b})`, fontWeight: 700 }}>{birthDate}</span> 생의 당신은{" "}
        <span style={{ color: `rgb(${r},${g},${b})`, fontWeight: 700 }}>{ohang}</span> 기운이 강하게 흐릅니다.
        {drawnCard && (
          <>
            {" "}뽑으신 <span style={{ color: "#c4b5fd", fontWeight: 700 }}>{drawnCard.name}</span> 카드의{" "}
            <span style={{ color: "#c4b5fd" }}>{drawnCard.element}</span> 에너지와{" "}
            {clash
              ? <><span style={{ color: "#f87171", fontWeight: 700 }}>충돌</span>하고 있습니다. 이 긴장이 오히려 당신에게 강력한 돌파구를 만들어 줍니다.</>
              : <><span style={{ color: "#34d399", fontWeight: 700 }}>공명</span>하고 있습니다. 지금은 자연스러운 흐름을 따를 최적의 시기입니다.</>
            }
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ── 메인 앱 ── */
export default function App() {
  // orb → choice → (tarot_flow | chat) → result → report
  const [phase, setPhase] = useState("orb");
  const [mood, setMood] = useState(50);
  const [auraColor, setAuraColor] = useState([139, 92, 246]);
  const [chatType, setChatType] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatStep, setChatStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [drawnCard, setDrawnCard] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [orbIntensity, setOrbIntensity] = useState(1);
  const chatEndRef = useRef(null);
  const [sajuData, setSajuData] = useState(null);
  const [sliderTouched, setSliderTouched] = useState(false);

  // 무드 → 아우라 색상 변환
  useEffect(() => {
    const m = mood / 100;
    if (m < 0.25) setAuraColor([59, 130, 246]);       // 파랑 (차분)
    else if (m < 0.5) setAuraColor([139, 92, 246]);    // 보라 (중간)
    else if (m < 0.75) setAuraColor([236, 72, 153]);   // 핑크 (활기)
    else setAuraColor([245, 158, 11]);                  // 앰버 (강렬)
    setOrbIntensity(0.6 + m * 0.8);
  }, [mood]);

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const startChat = (type) => {
    setChatType(type);
    if (type === "tarot") {
      // 타로는 새 질문 기반 플로우로 이동
      setPhase("tarot_flow");
      return;
    }
    setPhase("chat");
    const flow = CHAT_FLOWS[type];
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{ ...flow[0], id: 0 }]);
      setIsTyping(false);
    }, 1200);
  };

  const advanceChat = useCallback((userText, userOption) => {
    const flow = CHAT_FLOWS[chatType];
    const nextStep = chatStep + 1;
    const chosen = userOption || userText;
    const userMsg = { from: "user", text: chosen, id: Date.now() };

    setMessages(prev => [...prev, userMsg]);
    setUserInput("");

    // 아우라 컬러 미세 변화
    setAuraColor(prev => prev.map(c => Math.min(255, Math.max(0, c + (Math.random() - 0.5) * 30))));

    if (nextStep < flow.length) {
      setIsTyping(true);
      setTimeout(() => {
        setChatStep(nextStep);

        // 플레이스홀더를 맞춤 응답으로 교체
        const nextMsg = { ...flow[nextStep], id: Date.now() + 1 };
        if (nextMsg.text === "__RESPONSE__") {
          const mapped = RESPONSE_MAP[chosen];
          nextMsg.text = mapped || "그렇군요... 당신의 에너지가 선명하게 읽힙니다.";
        }
        // 타로 카드 선택 후 다음 메시지: 카드명 포함한 맞춤 멘트
        if (nextMsg.text === "__CARD_RESPONSE__") {
          nextMsg.text = `✦ ${chosen} 카드가 당신을 선택했군요.

이 카드의 키워드 중 지금 당신의 마음에 가장 먼저 닿는 단어는 무엇인가요?`;
        }

        setMessages(prev => [...prev, nextMsg]);
        setIsTyping(false);
      }, 1400 + Math.random() * 600);
    } else {
      // 대화 종료 → 결과 미리보기 페이지로 이동
      setIsTyping(true);
      setTimeout(() => {
        // 마지막 응답도 맞춤형으로
        const finalResponse = RESPONSE_MAP[chosen];
        const finalText = finalResponse
          ? finalResponse + "\n\n분석이 완성되었습니다. 결과를 확인해보세요."
          : "분석이 완성되었습니다...\n\n당신의 아우라와 운명의 흐름이 선명하게 읽힙니다. 결과를 확인해보세요.";
        setMessages(prev => [...prev, {
          from: "ai", text: finalText, id: Date.now() + 2
        }]);
        setIsTyping(false);
        setTimeout(() => setPhase("result"), 2000);
      }, 1600);
    }
  }, [chatType, chatStep]);

  const [r, g, b] = auraColor;
  const guardian = chatType ? GUARDIAN[chatType] : null;
  const [gr, gg, gb] = guardian ? guardian.color : [139, 92, 246];

  return (
    <div style={{
      minHeight: "100vh", background: "#020209",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif",
      color: "#e2e8f0", position: "relative", overflow: "hidden"
    }}>
      {/* 배경 아우라 블러 */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 30%, rgba(${r},${g},${b},0.12) 0%, transparent 70%)`,
        transition: "background 1.5s ease", zIndex: 0
      }} />

      <AnimatePresence mode="wait">

        {/* ── 1. 오브 화면 ── */}
        {phase === "orb" && (
          <motion.div
            key="orb"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "relative", zIndex: 1, minHeight: "100vh",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "40px 20px"
            }}
          >
            {/* 로고 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}
            >
              <div style={{
                fontSize: 48, letterSpacing: 5, color: `rgba(${r},${g},${b},1)`,
                fontWeight: 900, textTransform: "uppercase",
                textShadow: `0 0 40px rgba(${r},${g},${b},0.5)`
              }}>AURA</div>
            </motion.div>
            {/* 서비스 태그라인 */}
            <motion.div
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: 13, color: "#6b7280", letterSpacing: 5, marginBottom: 32, textTransform: "uppercase" }}
            >
              AI 운명 상담 서비스
            </motion.div>

            {/* 서비스 특징 카피 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                textAlign: "center", marginBottom: 36,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
                maxWidth: 340,
              }}
            >
              {/* 3요소 배지 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { icon: "☯", label: "사주 八字" },
                  { icon: "×", label: null },
                  { icon: "🃏", label: "타로 78장" },
                  { icon: "×", label: null },
                  { icon: "✦", label: "AI 딥러닝" },
                ].map((item, i) => item.label ? (
                  <div key={i} style={{
                    padding: "5px 14px", borderRadius: 20,
                    background: `rgba(${r},${g},${b},0.1)`,
                    border: `1px solid rgba(${r},${g},${b},0.3)`,
                    fontSize: 13, fontWeight: 700,
                    color: `rgba(${r},${g},${b},0.95)`,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span>{item.icon}</span> {item.label}
                  </div>
                ) : (
                  <span key={i} style={{ fontSize: 16, color: `rgba(${r},${g},${b},0.4)`, fontWeight: 300 }}>×</span>
                ))}
              </div>

              {/* 메인 카피 */}
              <div style={{
                fontSize: 15, color: "#9ca3af", lineHeight: 1.9, textAlign: "center", letterSpacing: 0.3,
              }}>
                3가지가 교차하는 지점에서<br />
                <span style={{
                  fontSize: 18, fontWeight: 800,
                  color: "#f0eaff",
                  background: `linear-gradient(90deg, rgb(${r},${g},${b}), rgba(${r},${g},${b},0.7))`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  당신의 운명이 선명해집니다
                </span>
              </div>
            </motion.div>

            {/* 아우라 구체 */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 18 }}
              style={{ position: "relative" }}
            >
              <AuraOrb mood={mood} auraColor={auraColor} intensity={orbIntensity} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center", pointerEvents: "none"
              }}>
                <div style={{ fontSize: 11, color: `rgba(${r},${g},${b},0.8)`, letterSpacing: 3 }}>
                  SYNC
                </div>
              </div>
            </motion.div>

            {/* 무드 슬라이더 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ width: "100%", maxWidth: 340, marginTop: 32 }}
            >
              {/* 안내 문구 — 터치 전엔 깜빡이며 표시 */}
              <motion.div
                animate={sliderTouched ? { opacity: 0, y: -6, height: 0, marginBottom: 0 } : { opacity: 1, y: 0, height: "auto", marginBottom: 12 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: "center", overflow: "hidden" }}
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 13, color: `rgba(${r},${g},${b},0.8)`,
                    background: `rgba(${r},${g},${b},0.08)`,
                    border: `1px solid rgba(${r},${g},${b},0.25)`,
                    borderRadius: 20, padding: "7px 18px", letterSpacing: 0.5,
                  }}
                >
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ fontSize: 16 }}
                  >👆</motion.span>
                  슬라이더를 움직여 지금 기분을 표현해보세요
                </motion.div>
              </motion.div>

              {/* 라벨 */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, color: "#4b5563", marginBottom: 12, letterSpacing: 1
              }}>
                <span>고요함</span>
                <span style={{ color: `rgba(${r},${g},${b},0.8)`, fontWeight: 600 }}>현재 기분</span>
                <span>강렬함</span>
              </div>

              <input
                type="range" min="0" max="100" value={mood}
                onChange={e => { setMood(Number(e.target.value)); setSliderTouched(true); }}
                style={{
                  width: "100%", appearance: "none", height: 4,
                  background: `linear-gradient(90deg, rgba(${r},${g},${b},0.9) ${mood}%, rgba(255,255,255,0.1) ${mood}%)`,
                  borderRadius: 4, outline: "none", cursor: "pointer"
                }}
              />

              {/* 결과 문구 */}
              <motion.div
                animate={sliderTouched ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 0 }}
                style={{ textAlign: "center", marginTop: 14, fontSize: 16, color: `rgba(${r},${g},${b},0.85)`, letterSpacing: 2, fontWeight: 600 }}
              >
                {mood < 25 ? "잔잔한 물처럼" : mood < 50 ? "은은히 타오르는" : mood < 75 ? "강하게 맥동하는" : "폭발적인"} 아우라
              </motion.div>

              {/* 슬라이더 조작 후 아우라 반응 안내 */}
              {sliderTouched && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "#4b5563" }}
                >
                  ✦ 아우라가 당신의 감정에 반응하고 있습니다
                </motion.div>
              )}
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPhase("choice")}
              style={{
                marginTop: 36, padding: "14px 40px",
                background: `rgba(${r},${g},${b},0.12)`,
                border: `1px solid rgba(${r},${g},${b},0.5)`,
                borderRadius: 50, color: `rgba(${r},${g},${b},1)`,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                letterSpacing: 2, display: "flex", alignItems: "center", gap: 8
              }}
            >
              아우라 읽기 시작 <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ── 2. 선택 화면 ── */}
        {phase === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            style={{
              position: "relative", zIndex: 1, minHeight: "100vh",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "40px 20px"
            }}
          >
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ textAlign: "center", marginBottom: 48 }}
            >
              <div style={{ fontSize: 13, letterSpacing: 6, color: "#6b7280", fontWeight:600, marginBottom: 16 }}>CHOOSE YOUR PATH</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#f8fafc" }}>운명의 세 갈래 길</div>
              <div style={{ fontSize: 16, color: "#9ca3af", marginTop: 8 }}>
                어느 길에서 당신의 아우라가 빛날까요
              </div>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 360 }}>
              {[
                {
                  type: "tarot", icon: "🌙",
                  title: "타로", subtitle: "순간의 거울",
                  desc: "지금 이 순간, 우주가 당신에게 보내는 메시지",
                  color: [139, 92, 246], delay: 0.2
                },
                {
                  type: "saju", icon: "☀️",
                  title: "사주", subtitle: "인생의 지도",
                  desc: "태어난 순간의 별자리가 그린 당신의 운명",
                  color: [245, 158, 11], delay: 0.32
                },
                {
                  type: "fusion", icon: "✦",
                  title: "융합", subtitle: "아우라 동기화",
                  premium: true, desc: "사주 + 타로 + AI가 결합한 초개인화 분석",
                  color: [236, 72, 153], delay: 0.44
                },
              ].map(card => {
                const [cr, cg, cb] = card.color;
                return (
                  <motion.div
                    key={card.type}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: card.delay }}
                    whileHover={{ scale: 1.025, x: 4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => startChat(card.type)}
                    style={{
                      position: "relative", cursor: "pointer",
                      background: `rgba(${cr},${cg},${cb},0.06)`,
                      border: `1px solid rgba(${cr},${cg},${cb},${card.premium ? 0.5 : 0.25})`,
                      borderRadius: 16, padding: "20px 22px",
                      display: "flex", alignItems: "center", gap: 16,
                      boxShadow: card.premium ? `0 0 30px rgba(${cr},${cg},${cb},0.12)` : "none"
                    }}
                  >
                    {card.premium && (
                      <div style={{
                        position: "absolute", top: -1, right: 14,
                        background: `rgba(${cr},${cg},${cb},1)`,
                        borderRadius: "0 0 8px 8px", padding: "3px 10px",
                        fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 2
                      }}>PREMIUM</div>
                    )}
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: `rgba(${cr},${cg},${cb},0.15)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, border: `1px solid rgba(${cr},${cg},${cb},0.3)`
                    }}>{card.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontWeight: 900, fontSize: 19, color: "#f1f5f9" }}>{card.title}</span>
                        <span style={{ fontSize: 14, color: `rgba(${cr},${cg},${cb},1)`, letterSpacing: 1, fontWeight:600 }}>{card.subtitle}</span>
                      </div>
                      <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 5, lineHeight: 1.5 }}>{card.desc}</div>
                    </div>
                    <ChevronRight size={18} style={{ color: `rgba(${cr},${cg},${cb},0.6)`, flexShrink: 0 }} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── 3. 채팅 화면 ── */}
        {phase === "chat" && guardian && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: "relative", zIndex: 1, height: "100vh",
              display: "flex", flexDirection: "column",
              background: `linear-gradient(135deg, #0d0820 0%, #130a2e 40%, #1a0b3d 70%, #0d0820 100%)`,
            }}
          >
            {/* 보라 배경 파티클 레이어 */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              background: `
                radial-gradient(ellipse at 20% 20%, rgba(${gr},${gg},${gb},0.18) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(${gr},${gg},${gb},0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, rgba(${gr},${gg},${gb},0.10) 0%, transparent 40%)
              `
            }} />

            {/* 헤더 */}
            <div style={{
              position: "relative", zIndex: 2,
              padding: "18px 24px", borderBottom: `1px solid rgba(${gr},${gg},${gb},0.2)`,
              display: "flex", alignItems: "center", gap: 14,
              background: `rgba(13,8,32,0.85)`, backdropFilter: "blur(24px)",
            }}>
              {/* 수호신 아바타 */}
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, rgba(${gr},${gg},${gb},0.5), rgba(${gr},${gg},${gb},0.15))`,
                border: `1.5px solid rgba(${gr},${gg},${gb},0.7)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                boxShadow: `0 0 16px rgba(${gr},${gg},${gb},0.3)`,
              }}>
                {chatType === "tarot" ? "🌙" : chatType === "saju" ? "☀️" : "✦"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 19, color: "#f0eaff", letterSpacing: 0.5 }}>{guardian.name}</div>
                <div style={{ fontSize: 15, color: `rgba(${gr},${gg},${gb},0.9)`, letterSpacing: 1 }}>{guardian.title}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#a78bfa",
                  boxShadow: "0 0 8px #a78bfa", animation: "none"
                }} />
                <span style={{ fontSize: 13, color: "rgba(167,139,250,0.8)", letterSpacing: 1 }}>분석중</span>
              </div>
            </div>

            {/* 채팅 영역 */}
            <div style={{
              position: "relative", zIndex: 1,
              flex: 1, overflowY: "auto", padding: "28px 20px",
              display: "flex", flexDirection: "column", gap: 20,
              maxWidth: 780, width: "100%", margin: "0 auto", alignSelf: "center",
              boxSizing: "border-box",
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 22 }}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: msg.from === "ai" ? "flex-start" : "flex-end",
                  }}
                >
                  {/* AI 발신자 이름 */}
                  {msg.from === "ai" && (
                    <div style={{
                      fontSize: 14, color: `rgba(${gr},${gg},${gb},0.95)`,
                      marginBottom: 7, marginLeft: 4, fontWeight: 700, letterSpacing: 1,
                    }}>
                      ✦ {guardian.name}
                    </div>
                  )}

                  {/* 말풍선 */}
                  <div style={{
                    maxWidth: "72%",
                    background: msg.from === "ai"
                      ? `linear-gradient(135deg, rgba(${gr},${gg},${gb},0.18) 0%, rgba(${gr},${gg},${gb},0.08) 100%)`
                      : `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)`,
                    border: msg.from === "ai"
                      ? `1px solid rgba(${gr},${gg},${gb},0.35)`
                      : "1px solid rgba(255,255,255,0.2)",
                    borderRadius: msg.from === "ai" ? "6px 20px 20px 20px" : "20px 6px 20px 20px",
                    padding: "16px 20px",
                    boxShadow: msg.from === "ai"
                      ? `0 4px 24px rgba(${gr},${gg},${gb},0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
                      : `0 4px 16px rgba(0,0,0,0.3)`,
                  }}>
                    <div style={{
                      fontSize: 17, lineHeight: 1.9, color: "#e8e0ff",
                      whiteSpace: "pre-wrap", fontWeight: 400,
                    }}>{msg.text}</div>

                    {/* 타로 카드 플립 */}
                    {msg.special === "tarot_flip" && !drawnCard && (
                      <TarotFlip onSelect={(card) => {
                        setDrawnCard(card);
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            from: "ai",
                            text: `✦ ${card.name} (${card.korean})\n\n${card.meaning}`,
                            id: Date.now()
                          }]);
                          setTimeout(() => advanceChat(null, card.name), 800);
                        }, 1000);
                      }} />
                    )}
                    {msg.special === "tarot_flip" && drawnCard && (
                      <div style={{
                        marginTop: 14, display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px",
                        background: `linear-gradient(135deg, rgba(${gr},${gg},${gb},0.18), rgba(${gr},${gg},${gb},0.08))`,
                        borderRadius: 14, border: `1px solid rgba(${gr},${gg},${gb},0.4)`,
                        boxShadow: `0 0 20px rgba(${gr},${gg},${gb},0.15)`,
                      }}>
                        {/* 카드 미니 이미지 */}
                        <div style={{
                          width: 52, height: 82, borderRadius: 8, flexShrink: 0,
                          background: "linear-gradient(145deg, #0f172a, #1e1b4b)",
                          border: `1.5px solid rgba(${gr},${gg},${gb},0.8)`,
                          display: "flex", flexDirection: "column", alignItems: "center",
                          justifyContent: "center", gap: 4, padding: 6,
                          boxShadow: `0 0 12px rgba(${gr},${gg},${gb},0.3)`,
                        }}>
                          <div style={{ fontSize: 20 }}>☽</div>
                          <div style={{ fontSize: 7, color: "#c4b5fd", textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>
                            {drawnCard.name}
                          </div>
                          <div style={{ fontSize: 6, color: "#7c3aed" }}>{drawnCard.element}</div>
                        </div>
                        {/* 카드 정보 */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: `rgba(${gr},${gg},${gb},0.8)`, letterSpacing: 2, marginBottom: 5 }}>
                            ✦ 선택된 카드
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#c4b5fd", marginBottom: 4 }}>
                            {drawnCard.name}
                          </div>
                          <div style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
                            {drawnCard.korean} · {drawnCard.element}
                          </div>
                          <div style={{ fontSize: 12, color: "#7c6fb5", marginTop: 6, lineHeight: 1.5 }}>
                            {drawnCard.meaning.slice(0, 30)}...
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 생년월일 입력 */}
                    {msg.special === "birth_input" && !birthDate && (
                      <BirthInput onSubmit={(date) => {
                        setBirthDate(date);
                        const result = analyzeSaju(date, drawnCard);
                        setSajuData(result);
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            from: "ai",
                            text: `${date} 생의 에너지가 읽힙니다...

${result.yearPillar.animal}띠, ${result.dominant.name} 기운이 강하게 흐르는 당신의 아우라가 선명해집니다.`,
                            ohang: chatType !== "tarot",
                            birthDateData: date,
                            id: Date.now()
                          }]);
                          setTimeout(() => advanceChat(null, date), 800);
                        }, 800);
                      }} />
                    )}
                    {msg.special === "birth_input" && birthDate && (
                      <div style={{ marginTop: 10, fontSize: 13, color: "#a78bfa" }}>
                        ✓ {birthDate} 입력됨
                      </div>
                    )}

                    {/* 오행 분석 (융합 모드) */}
                    {msg.ohang && msg.birthDateData && (
                      <OhangCard birthDate={msg.birthDateData} drawnCard={drawnCard} sajuData={sajuData} />
                    )}
                  </div>

                  {/* 선택지 버튼 */}
                  {msg.from === "ai" && msg.options && chatStep === messages.filter(m => m.from === "ai").length - 1 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 12, maxWidth: "72%" }}>
                      {msg.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          whileHover={{ scale: 1.04, background: `rgba(${gr},${gg},${gb},0.22)` }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => advanceChat(null, opt)}
                          style={{
                            padding: "10px 18px",
                            background: `rgba(${gr},${gg},${gb},0.12)`,
                            border: `1px solid rgba(${gr},${gg},${gb},0.45)`,
                            borderRadius: 24, color: "#d4c8ff",
                            fontSize: 16, cursor: "pointer", fontFamily: "inherit",
                            boxShadow: `0 2px 12px rgba(${gr},${gg},${gb},0.15)`,
                          }}
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* 타이핑 인디케이터 */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div style={{ fontSize: 15, color: `rgba(${gr},${gg},${gb},0.9)`, fontWeight: 600, letterSpacing: 1 }}>
                    ✦ {guardian.name}
                  </div>
                  <div style={{
                    padding: "14px 20px",
                    background: `linear-gradient(135deg, rgba(${gr},${gg},${gb},0.18), rgba(${gr},${gg},${gb},0.08))`,
                    border: `1px solid rgba(${gr},${gg},${gb},0.35)`,
                    borderRadius: "6px 20px 20px 20px",
                    display: "flex", gap: 6, alignItems: "center",
                    boxShadow: `0 4px 24px rgba(${gr},${gg},${gb},0.15)`,
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                        style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: `rgba(${gr},${gg},${gb},0.9)`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 입력창 */}
            <div style={{
              position: "relative", zIndex: 2,
              padding: "14px 20px 20px",
              borderTop: `1px solid rgba(${gr},${gg},${gb},0.2)`,
              background: `rgba(13,8,32,0.9)`, backdropFilter: "blur(24px)",
            }}>
              <div style={{
                maxWidth: 780, margin: "0 auto",
                display: "flex", gap: 12, alignItems: "center",
                background: `rgba(${gr},${gg},${gb},0.1)`,
                border: `1px solid rgba(${gr},${gg},${gb},0.3)`,
                borderRadius: 50, padding: "10px 10px 10px 22px",
                boxShadow: `0 0 20px rgba(${gr},${gg},${gb},0.1)`,
              }}>
                <input
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && userInput.trim() && advanceChat(userInput)}
                  placeholder="당신의 이야기를 들려주세요..."
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#e8e0ff", fontSize: 17, fontFamily: "inherit",
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => userInput.trim() && advanceChat(userInput)}
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: userInput.trim()
                      ? `radial-gradient(circle, rgba(${gr},${gg},${gb},1), rgba(${gr},${gg},${gb},0.7))`
                      : `rgba(${gr},${gg},${gb},0.15)`,
                    border: `1px solid rgba(${gr},${gg},${gb},0.5)`,
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "all 0.25s",
                    boxShadow: userInput.trim() ? `0 0 16px rgba(${gr},${gg},${gb},0.5)` : "none",
                  }}
                >
                  <Send size={16} style={{ color: "#fff" }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 타로 질문 기반 플로우 ── */}
      {phase === "tarot_flow" && (
        <TarotResult
          onRestart={() => {
            setMessages([]); setChatStep(0);
            setDrawnCard(null); setBirthDate(null); setSajuData(null);
            setChatType(null); setPhase("orb");
          }}
          onGoFusion={() => {
            setMessages([]); setChatStep(0);
            setDrawnCard(null); setBirthDate(null); setSajuData(null);
            setChatType("fusion"); setPhase("chat");
            const flow = CHAT_FLOWS["fusion"];
            setTimeout(() => {
              setMessages([{ ...flow[0], id: Date.now() }]);
            }, 300);
          }}
        />
      )}

      {/* ── 결과 미리보기 페이지 ── */}
      {phase === "result" && (
        <ResultPreview
          drawnCard={drawnCard}
          birthDate={birthDate}
          chatType={chatType}
          sajuData={sajuData}
          guardianColor={guardian ? guardian.color : [139, 92, 246]}
          onPaid={() => setPhase("report")}
        />
      )}

      {/* ── 결제 완료 페이지 ── */}
      {phase === "paid" && (
        <PaymentSuccess onOpenReport={() => setPhase("report")} />
      )}

      {/* ── 심층 리포트 페이지 ── */}
      {phase === "report" && (
        <DeepReport
          sajuData={sajuData}
          drawnCard={drawnCard}
          chatType={chatType}
          onBack={() => setPhase("result")}
          onRestart={(type) => {
            // 상태 초기화 후 특정 타입으로 재시작
            setMessages([]); setChatStep(0);
            setDrawnCard(null); setBirthDate(null); setSajuData(null);
            if (type === "home") { setPhase("orb"); setChatType(null); }
            else { setChatType(type); setPhase("choice"); }
          }}
        />
      )}
    </div>
  );
}
