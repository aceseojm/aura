import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, X, Send, Lock } from "lucide-react";
import ResultPreview from "./components/ResultPreview";
import PaymentSuccess from "./components/PaymentSuccess";
import DeepReport from "./components/DeepReport";
import { analyzeSaju } from "./utils/sajuEngine";

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

const CHAT_FLOWS = {
  tarot: [
    { from: "ai", text: "...당신의 아우라가 저에게 닿습니다. 파동이 느껴지는군요.\n\n오늘, 당신 마음 속 가장 무거운 질문이 무엇인가요? 사랑, 일, 아니면 자신에 관한 것인가요?", options: ["사랑과 관계", "일과 커리어", "나 자신에 관해", "모든 것이 뒤엉켜 있어"] },
    { from: "ai", text: "그렇군요... 그 무게감이 느껴집니다.\n\n그 감정이 언제부터 시작되었나요? 갑자기 찾아왔나요, 아니면 서서히 쌓여온 것인가요?", options: ["갑자기 찾아왔어", "오래전부터였어", "잘 모르겠어", "최근 어떤 사건 이후로"] },
    { from: "ai", text: "깊이 공명합니다... 이제 카드가 당신을 부릅니다.\n\n마음을 비우고, 세 장의 카드 중 하나를 선택해주세요. 당신의 직관을 믿으세요.", special: "tarot_flip" },
    { from: "ai", text: "이 카드가 오늘의 당신에게 말을 건넵니다.\n\n카드의 메시지 중 어떤 것이 가장 마음에 닿나요?", options: ["변화에 대한 이야기", "관계에 대한 메시지", "내면의 힘에 관한 것", "아직 잘 모르겠어"] },
    { from: "ai", text: "당신의 아우라 분석이 완성에 가까워지고 있습니다...\n\n더 정확한 운명의 지도를 그리려면 당신이 태어난 시간이 필요합니다. 생년월일을 알려주시겠어요?", special: "birth_input" },
  ],
  saju: [
    { from: "ai", text: "천명이 당신을 기다리고 있었습니다.\n\n사주는 태어난 순간의 우주 에너지를 읽습니다. 먼저, 요즘 당신의 삶에서 가장 큰 변화는 무엇인가요?", options: ["직업이나 진로의 변화", "인간관계의 변화", "내면의 변화", "아직 변화를 찾고 있어"] },
    { from: "ai", text: "우주의 흐름 속에서 그 변화의 의미를 찾아드리겠습니다.\n\n당신은 어떤 계절에 태어나셨나요?", options: ["봄 (3-5월)", "여름 (6-8월)", "가을 (9-11월)", "겨울 (12-2월)"] },
    { from: "ai", text: "생년월일을 입력해주시면, 당신의 사주 팔자와 오행 에너지를 분석해드리겠습니다.", special: "birth_input" },
    { from: "ai", text: "당신의 오행 기운이 읽힙니다...\n\n삶의 에너지 중 어떤 것이 지금 당신에게 가장 필요하다고 느끼시나요?", options: ["성장과 확장의 기운", "열정과 변화의 기운", "안정과 기반의 기운", "예리함과 결단의 기운"] },
  ],
  fusion: [
    { from: "ai", text: "아우라 AI가 당신의 에너지장을 스캔하고 있습니다...\n\n지금 이 순간, 당신이 느끼는 감각을 색으로 표현한다면 어떤 색인가요?", options: ["보라색 - 신비롭고 깊은", "붉은색 - 강렬하고 뜨거운", "파란색 - 고요하고 넓은", "금색 - 찬란하고 귀한"] },
    { from: "ai", text: "흥미롭습니다. 그 색은 당신의 오행 에너지와 공명하고 있어요.\n\n최근 반복적으로 꾸는 꿈이나 자꾸 떠오르는 이미지가 있나요?", options: ["물이나 바다", "불이나 빛", "숲이나 나무", "하늘이나 별", "특별한 것은 없어"] },
    { from: "ai", text: "아우라 동기화를 위해 생년월일이 필요합니다. 사주와 타로를 결합한 완전한 분석을 시작하겠습니다.", special: "birth_input" },
    { from: "ai", text: "사주 데이터를 기반으로 타로 카드를 뽑겠습니다. 직관에 따라 카드를 선택해주세요.", special: "tarot_flip" },
    { from: "ai", text: "융합 분석이 완성되고 있습니다...\n\n당신의 오행과 타로 에너지 사이의 패턴을 발견했습니다. 이 결과가 당신의 어떤 면을 가장 잘 나타내는 것 같나요?", options: ["내가 아는 내 모습 그대로야", "몰랐던 나의 모습을 발견했어", "반은 맞고 반은 모르겠어", "더 깊이 알고 싶어"] },
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
function BirthInput({ onSubmit }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div style={{
      background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)",
      borderRadius: 12, padding: 16, marginTop: 8
    }}>
      <div style={{ fontSize: 14, color: "#a78bfa", marginBottom: 10, fontWeight: 600, letterSpacing: 1 }}>
        ✦ 사주 데이터 입력
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <label style={{ fontSize: 13, color: "#6d28d9", display: "block", marginBottom: 4 }}>생년월일</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13,
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#6d28d9", display: "block", marginBottom: 4 }}>태어난 시간 (선택)</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13,
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => date && onSubmit(date, time)}
          disabled={!date}
          style={{
            marginTop: 4, padding: "10px 0", background: date ? "linear-gradient(90deg,#7c3aed,#9333ea)" : "rgba(139,92,246,0.2)",
            border: "none", borderRadius: 8, color: date ? "#fff" : "#6d28d9", fontSize: 13,
            fontWeight: 700, cursor: date ? "pointer" : "default", letterSpacing: 1
          }}
        >
          아우라 분석 시작 →
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

/* ── 오행 분석 카드 ── */
function OhangCard({ birthDate, drawnCard }) {
  const ohang = OHANG[Math.floor(Math.random() * OHANG.length)];
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
      <div style={{ fontSize: 11, color: `rgb(${r},${g},${b})`, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
        ◈ 오행 분석
      </div>
      <div style={{ color: "#d1d5db", lineHeight: 1.7 }}>
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
  // orb → choice → chat → result → paid → report
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
    const userMsg = { from: "user", text: userOption || userText, id: Date.now() };

    setMessages(prev => [...prev, userMsg]);
    setUserInput("");

    // 아우라 컬러 미세 변화
    setAuraColor(prev => prev.map(c => Math.min(255, Math.max(0, c + (Math.random() - 0.5) * 30))));

    if (nextStep < flow.length) {
      setIsTyping(true);
      setTimeout(() => {
        setChatStep(nextStep);
        setMessages(prev => [...prev, { ...flow[nextStep], id: Date.now() + 1 }]);
        setIsTyping(false);
      }, 1400 + Math.random() * 600);
    } else {
      // 대화 종료 → 결과 미리보기 페이지로 이동
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          from: "ai",
          text: "분석이 완성되었습니다...\n\n당신의 아우라와 운명의 흐름이 선명하게 읽힙니다. 결과를 확인해보세요.",
          id: Date.now() + 2
        }]);
        setIsTyping(false);
        setTimeout(() => setPhase("result"), 1800);
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
            <motion.div
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: 15, color: "#6b7280", letterSpacing: 4, marginBottom: 48, textTransform: "uppercase" }}
            >
              AI 운명 상담 서비스
            </motion.div>

            {/* 아우라 구체 */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 18 }}
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
              style={{ width: "100%", maxWidth: 320, marginTop: 32 }}
            >
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
                onChange={e => setMood(Number(e.target.value))}
                style={{
                  width: "100%", appearance: "none", height: 3,
                  background: `linear-gradient(90deg, rgba(${r},${g},${b},0.9) ${mood}%, rgba(255,255,255,0.1) ${mood}%)`,
                  borderRadius: 4, outline: "none", cursor: "pointer"
                }}
              />
              <div style={{
                textAlign: "center", marginTop: 14, fontSize: 16,
                color: `rgba(${r},${g},${b},0.7)`, letterSpacing: 2
              }}>
                {mood < 25 ? "잔잔한 물처럼" : mood < 50 ? "은은히 타오르는" : mood < 75 ? "강하게 맥동하는" : "폭발적인"} 아우라
              </div>
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
                        marginTop: 10, padding: "10px 16px",
                        background: `rgba(${gr},${gg},${gb},0.15)`,
                        borderRadius: 10, fontSize: 14, color: "#c4b5fd",
                        border: `1px solid rgba(${gr},${gg},${gb},0.3)`,
                      }}>
                        ✦ {drawnCard.name} 선택됨
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
                      <OhangCard birthDate={msg.birthDateData} drawnCard={drawnCard} />
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
          onBack={() => setPhase("result")}
        />
      )}
    </div>
  );
}
