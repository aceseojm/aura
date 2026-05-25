import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* 타로 카드 78장 간소화 버전 - 질문 유형별 해석 포함 */
const TAROT_CARDS = [
  { name:"The Fool",      korean:"바보",     symbol:"🌟", meaning_love:"새로운 만남이나 관계의 시작을 암시합니다. 두려움 없이 마음을 열어보세요.", meaning_work:"새로운 도전을 두려워 말고 첫발을 내딛을 때입니다.", meaning_self:"내면의 순수함과 자유를 되찾을 시간입니다." },
  { name:"The Magician",  korean:"마법사",   symbol:"✨", meaning_love:"당신에게 매력적인 에너지가 있습니다. 먼저 표현하세요.", meaning_work:"당신의 능력을 충분히 발휘할 환경이 갖춰져 있습니다.", meaning_self:"당신 안의 잠재력이 깨어나고 있습니다." },
  { name:"The High Priestess", korean:"여교황", symbol:"🌙", meaning_love:"상대의 말보다 행동을 보세요. 직관을 믿으세요.", meaning_work:"서두르지 마세요. 때를 기다리는 지혜가 필요합니다.", meaning_self:"내면의 목소리에 귀 기울일 시간입니다." },
  { name:"The Empress",   korean:"여황제",   symbol:"🌸", meaning_love:"풍요롭고 따뜻한 감정이 흐릅니다. 관계가 깊어질 조짐입니다.", meaning_work:"창의적인 프로젝트가 결실을 맺을 시기입니다.", meaning_self:"자신을 충분히 돌보고 사랑해주세요." },
  { name:"The Emperor",   korean:"황제",     symbol:"⚡", meaning_love:"안정적이고 책임감 있는 관계를 원하고 있습니다.", meaning_work:"리더십을 발휘하고 구조를 만들어갈 시간입니다.", meaning_self:"내면의 규율과 자기 통제가 필요합니다." },
  { name:"The Hierophant",korean:"교황",     symbol:"🔑", meaning_love:"전통적이고 진지한 관계의 흐름입니다. 진심을 전하세요.", meaning_work:"정해진 방식을 따르는 것이 현명합니다.", meaning_self:"스스로의 믿음과 가치관을 점검할 때입니다." },
  { name:"The Lovers",    korean:"연인",     symbol:"💕", meaning_love:"선택의 순간이 왔습니다. 마음이 이끄는 대로 결정하세요.", meaning_work:"두 가지 선택지 중 가슴이 원하는 길을 따르세요.", meaning_self:"내면의 두 모습을 통합할 시간입니다." },
  { name:"The Chariot",   korean:"전차",     symbol:"🏆", meaning_love:"의지가 강한 만큼 상대를 배려하는 균형이 필요합니다.", meaning_work:"강한 추진력으로 목표를 향해 나아가세요.", meaning_self:"감정과 이성을 모두 통제하는 의지가 필요합니다." },
  { name:"Strength",      korean:"힘",       symbol:"🦁", meaning_love:"부드러운 힘으로 관계를 이끌어나가세요.", meaning_work:"인내와 끈기가 지금 가장 강력한 무기입니다.", meaning_self:"내면의 두려움을 용기로 극복할 때입니다." },
  { name:"The Hermit",    korean:"은둔자",   symbol:"🕯️", meaning_love:"혼자만의 시간이 관계를 더 성숙하게 만들어줍니다.", meaning_work:"깊이 있는 성찰 후에 결정하세요.", meaning_self:"고독 속에서 진정한 나를 발견할 시간입니다." },
  { name:"Wheel of Fortune", korean:"운명의 바퀴", symbol:"☯", meaning_love:"관계의 흐름이 변화하고 있습니다. 변화를 자연스럽게 받아들이세요.", meaning_work:"운의 흐름이 바뀌고 있습니다. 기회를 잡을 준비를 하세요.", meaning_self:"인생의 순환을 믿고 현재에 집중하세요." },
  { name:"Justice",       korean:"정의",     symbol:"⚖️", meaning_love:"솔직하고 공정한 소통이 관계를 탄탄하게 합니다.", meaning_work:"공정한 평가와 균형 잡힌 판단이 필요합니다.", meaning_self:"자신에게 정직해질 시간입니다." },
  { name:"The Hanged Man",korean:"매달린 사람", symbol:"🔄", meaning_love:"지금은 기다리는 것이 더 현명합니다. 서두르지 마세요.", meaning_work:"다른 시각으로 상황을 바라볼 때입니다.", meaning_self:"내려놓음 속에서 새로운 통찰을 얻습니다." },
  { name:"Death",         korean:"죽음",     symbol:"🌑", meaning_love:"관계의 오래된 패턴이 끝나고 새로운 국면이 시작됩니다.", meaning_work:"변화는 두렵지만 반드시 필요한 전환점입니다.", meaning_self:"과거를 놓아야 새로운 나로 태어납니다." },
  { name:"Temperance",    korean:"절제",     symbol:"🌊", meaning_love:"균형과 조화가 관계를 아름답게 만듭니다.", meaning_work:"급하지 않게, 꾸준히 나아가는 것이 중요합니다.", meaning_self:"감정의 균형을 찾는 것이 지금 핵심입니다." },
  { name:"The Devil",     korean:"악마",     symbol:"⛓️", meaning_love:"집착이나 두려움에서 벗어나야 관계가 성장합니다.", meaning_work:"편안함에 안주하는 것을 경계하세요.", meaning_self:"스스로를 옭아매는 생각의 사슬을 끊으세요." },
  { name:"The Tower",     korean:"탑",       symbol:"🌩️", meaning_love:"예상치 못한 변화가 오지만, 진실이 드러나는 기회입니다.", meaning_work:"기존의 방식이 무너질 수 있습니다. 재건을 준비하세요.", meaning_self:"오래된 믿음이 흔들릴 때 진정한 성장이 시작됩니다." },
  { name:"The Star",      korean:"별",       symbol:"⭐", meaning_love:"희망적인 에너지가 흐릅니다. 기대해도 좋습니다.", meaning_work:"노력이 빛을 발하는 시기입니다. 계속 나아가세요.", meaning_self:"희망과 치유의 에너지가 당신을 감싸고 있습니다." },
  { name:"The Moon",      korean:"달",       symbol:"🌙", meaning_love:"상대의 진심이 불분명할 수 있습니다. 직관으로 읽으세요.", meaning_work:"불확실한 상황이지만 직관을 믿고 나아가세요.", meaning_self:"무의식의 두려움을 직면해야 할 때입니다." },
  { name:"The Sun",       korean:"태양",     symbol:"☀️", meaning_love:"밝고 기쁜 에너지가 가득합니다. 관계가 빛납니다.", meaning_work:"성공과 성취의 에너지가 강하게 흐릅니다.", meaning_self:"자신감과 활력이 넘치는 시기입니다." },
  { name:"Judgement",     korean:"심판",     symbol:"📯", meaning_love:"과거를 용서하고 새로운 시작을 할 준비가 됐습니다.", meaning_work:"중요한 결정을 내릴 시간입니다. 확신을 갖고 선택하세요.", meaning_self:"진정한 자신으로 다시 태어날 기회입니다." },
  { name:"The World",     korean:"세계",     symbol:"🌍", meaning_love:"관계가 완성의 단계로 향하고 있습니다.", meaning_work:"하나의 완성과 새로운 시작이 동시에 옵니다.", meaning_self:"당신은 이미 충분히 완전한 존재입니다." },
];

const QUESTION_CATEGORIES = [
  {
    id: "love", icon: "💜", label: "연애 · 관계운",
    questions: [
      "현재 썸/연인과의 관계 흐름은 어떻게 흘러갈까요?",
      "그 사람의 속마음(나에 대한 감정)은 어떠한가요?",
      "우리의 관계 발전을 위해 내가 취해야 할 행동은?",
      "이 관계, 계속 이어가도 괜찮을까요?",
    ]
  },
  {
    id: "work", icon: "💼", label: "직장 · 사업 · 학업운",
    questions: [
      "현재 진행 중인 일의 예상 결과와 주의사항은?",
      "이직 · 전직을 준비하며 내가 보완해야 할 점은?",
      "두 선택지 중 나에게 더 잘 맞는 방향은?",
      "지금 도전하려는 일이 성공할 가능성은?",
    ]
  },
  {
    id: "self", icon: "🔮", label: "개인 성장 · 셀프케어",
    questions: [
      "이번 달 내가 가장 집중해야 할 것은 무엇인가요?",
      "지금 나를 가로막고 있는 장애물과 극복 방법은?",
      "내면 성장을 위해 지금 비워내야 할 것은?",
      "오늘 나에게 필요한 한 마디 메시지는?",
    ]
  },
];

/* ── 카드 플립 (질문 기반) ── */
function TarotFlipFull({ question, category, onComplete }) {
  const [phase, setPhase] = useState("pick"); // pick → flipped → done
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [card, setCard] = useState(null);
  const [spread, setSpread] = useState(() =>
    [0,1,2].map(() => TAROT_CARDS[Math.floor(Math.random()*TAROT_CARDS.length)])
  );

  const pickCard = (i) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(i);
    setCard(spread[i]);
    setTimeout(() => setPhase("flipped"), 700);
    setTimeout(() => { setPhase("done"); onComplete(spread[i], category); }, 2200);
  };

  const getMeaning = (c) => {
    if (!c) return "";
    if (category === "love") return c.meaning_love;
    if (category === "work") return c.meaning_work;
    return c.meaning_self;
  };

  return (
    <div style={{ marginTop: 16 }}>
      {phase === "pick" && (
        <>
          <div style={{ fontSize: 13, color: "rgba(139,92,246,0.8)", marginBottom: 14, letterSpacing: 1 }}>
            ✦ 마음을 비우고 끌리는 카드를 선택하세요
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            {spread.map((c, i) => (
              <motion.div key={i} onClick={() => pickCard(i)}
                whileHover={{ y: -10, scale: 1.04 }}
                style={{ cursor: "pointer", perspective: 600, width: 80, height: 130 }}>
                <motion.div
                  animate={{ rotateY: selectedIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.7 }}
                  style={{ width:"100%", height:"100%", position:"relative", transformStyle:"preserve-3d" }}>
                  {/* 뒷면 */}
                  <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden",
                    background:"linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)",
                    borderRadius:10, border:"1px solid rgba(139,92,246,0.5)",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <div style={{ fontSize:20, opacity:0.5 }}>✦</div>
                    <div style={{ fontSize:9, color:"rgba(196,181,253,0.5)", letterSpacing:2 }}>AURA</div>
                  </div>
                  {/* 앞면 */}
                  <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", transform:"rotateY(180deg)",
                    background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius:10,
                    border:"1.5px solid rgba(139,92,246,0.9)",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:8 }}>
                    <div style={{ fontSize:24 }}>{c.symbol}</div>
                    <div style={{ fontSize:8, color:"#c4b5fd", textAlign:"center", fontWeight:700, lineHeight:1.3 }}>{c.name}</div>
                    <div style={{ fontSize:7, color:"#7c3aed" }}>{c.korean}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {(phase === "flipped" || phase === "done") && card && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ display:"flex", gap:14, padding:"16px", background:"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.06))",
            borderRadius:14, border:"1px solid rgba(139,92,246,0.35)" }}>
          <div style={{ width:64, height:100, borderRadius:9, flexShrink:0,
            background:"linear-gradient(145deg,#0f172a,#1e1b4b)", border:"1.5px solid rgba(139,92,246,0.8)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:6 }}>
            <div style={{ fontSize:22 }}>{card.symbol}</div>
            <div style={{ fontSize:7, color:"#c4b5fd", textAlign:"center", fontWeight:700, lineHeight:1.3 }}>{card.name}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#c4b5fd", marginBottom:4 }}>{card.name}</div>
            <div style={{ fontSize:13, color:"rgba(139,92,246,0.7)", marginBottom:8 }}>{card.korean}</div>
            {phase === "done" && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
                style={{ fontSize:14, color:"#d1d5db", lineHeight:1.8 }}>
                {getMeaning(card)}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── 메인 타로 결과 화면 ── */
export default function TarotResult({ onRestart, onGoFusion }) {
  const [step, setStep] = useState("category"); // category → question → reading → result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);
  const [additionalCards, setAdditionalCards] = useState([]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setStep("question");
  };

  const handleQuestionSelect = (q) => {
    setSelectedQuestion(q);
    setStep("reading");
  };

  const handleCardComplete = (card, category) => {
    setDrawnCard(card);
    setTimeout(() => setStep("result"), 500);
  };

  const cat = QUESTION_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div style={{ background:"#020209", minHeight:"100vh", fontFamily:"'Apple SD Gothic Neo',system-ui,sans-serif", color:"#e2e8f0" }}>

      {/* 헤더 */}
      <div style={{ padding:"18px 22px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(2,2,9,0.97)", display:"flex", alignItems:"center", gap:12,
        position:"sticky", top:0, zIndex:10 }}>
        {step !== "category" && (
          <button onClick={() => {
            if (step === "question") setStep("category");
            else if (step === "reading") setStep("question");
            else if (step === "result") setStep("reading");
          }} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:8,
            width:32, height:32, cursor:"pointer", color:"#9ca3af", fontSize:18 }}>←</button>
        )}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, letterSpacing:4, color:"rgba(139,92,246,0.7)" }}>AURA TAROT</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>
            {step==="category"?"오늘의 타로 질문":step==="question"?cat?.label:step==="reading"?"카드를 선택하세요":"타로 리딩 결과"}
          </div>
        </div>
        <div style={{ fontSize:22, letterSpacing:3, color:"rgba(139,92,246,1)", fontWeight:900 }}>AURA</div>
      </div>

      <div style={{ padding:"0 0 100px" }}>

        {/* ── STEP 1: 카테고리 선택 ── */}
        {step === "category" && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{padding:"28px 22px 0"}}>
            <div style={{ marginBottom:28, textAlign:"center" }}>
              <div style={{ fontSize:28 }}>🃏</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9", marginTop:10 }}>무엇이 궁금하신가요?</div>
              <div style={{ fontSize:14, color:"#6b7280", marginTop:6 }}>카드는 당신이 마음을 여는 순간 말을 걸어옵니다</div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {QUESTION_CATEGORIES.map((cat, i) => (
                <motion.div key={cat.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
                  transition={{delay:i*0.1}} whileHover={{x:4}} whileTap={{scale:0.98}}
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"20px 22px",
                    background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.22)",
                    borderRadius:16, cursor:"pointer" }}>
                  <div style={{ fontSize:28, width:52, height:52, borderRadius:14, flexShrink:0,
                    background:"rgba(139,92,246,0.12)", border:"0.5px solid rgba(139,92,246,0.3)",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>{cat.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9", marginBottom:4 }}>{cat.label}</div>
                    <div style={{ fontSize:12, color:"#6b7280" }}>{cat.questions[0].slice(0,22)}... 외 {cat.questions.length-1}개</div>
                  </div>
                  <div style={{ fontSize:20, color:"rgba(139,92,246,0.5)" }}>›</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: 질문 선택 ── */}
        {step === "question" && cat && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{padding:"28px 22px 0"}}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <span style={{ fontSize:24 }}>{cat.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>{cat.label}</div>
                <div style={{ fontSize:13, color:"#6b7280" }}>질문을 선택하거나 직접 입력하세요</div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {cat.questions.map((q, i) => (
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  transition={{delay:i*0.08}} whileTap={{scale:0.98}}
                  onClick={() => handleQuestionSelect(q)}
                  style={{ padding:"16px 18px", background:"rgba(255,255,255,0.03)",
                    border:"0.5px solid rgba(139,92,246,0.2)", borderRadius:12, cursor:"pointer",
                    display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(139,92,246,0.15)",
                    border:"0.5px solid rgba(139,92,246,0.4)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, color:"rgba(139,92,246,0.9)", fontWeight:700, flexShrink:0, marginTop:1 }}>
                    {i+1}
                  </div>
                  <div style={{ fontSize:14, color:"#d1d5db", lineHeight:1.6 }}>{q}</div>
                </motion.div>
              ))}
            </div>

            {/* 직접 입력 */}
            <DirectInput onSubmit={handleQuestionSelect} />
          </motion.div>
        )}

        {/* ── STEP 3: 카드 선택 ── */}
        {step === "reading" && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{padding:"28px 22px 0"}}>
            {/* 질문 표시 */}
            <div style={{ padding:"16px 18px", background:"rgba(139,92,246,0.08)",
              border:"1px solid rgba(139,92,246,0.25)", borderRadius:12, marginBottom:24 }}>
              <div style={{ fontSize:11, color:"rgba(139,92,246,0.7)", letterSpacing:2, marginBottom:6 }}>✦ 오늘의 질문</div>
              <div style={{ fontSize:15, color:"#e2e8f0", lineHeight:1.7, fontWeight:600 }}>{selectedQuestion}</div>
            </div>

            <div style={{ textAlign:"center", marginBottom:8 }}>
              <div style={{ fontSize:14, color:"#9ca3af" }}>아스트라가 카드를 준비하고 있습니다...</div>
            </div>

            <TarotFlipFull question={selectedQuestion} category={selectedCategory}
              onComplete={handleCardComplete} />
          </motion.div>
        )}

        {/* ── STEP 4: 결과 ── */}
        {step === "result" && drawnCard && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:"28px 22px 0"}}>

            {/* 질문 */}
            <div style={{ padding:"14px 16px", background:"rgba(139,92,246,0.08)",
              border:"1px solid rgba(139,92,246,0.22)", borderRadius:12, marginBottom:22 }}>
              <div style={{ fontSize:11, color:"rgba(139,92,246,0.7)", letterSpacing:2, marginBottom:5 }}>✦ 오늘의 질문</div>
              <div style={{ fontSize:15, color:"#e2e8f0", lineHeight:1.6, fontWeight:600 }}>{selectedQuestion}</div>
            </div>

            {/* 카드 결과 크게 */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:3, repeat:Infinity }}
                style={{ display:"inline-flex", width:120, height:190, borderRadius:14,
                  background:"linear-gradient(145deg,#0f172a,#1e1b4b)", border:"2px solid rgba(139,92,246,0.8)",
                  flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:12,
                  boxShadow:"0 0 40px rgba(139,92,246,0.3)" }}>
                <div style={{ fontSize:42 }}>{drawnCard.symbol}</div>
                <div style={{ fontSize:11, color:"#c4b5fd", textAlign:"center", fontWeight:700, lineHeight:1.4 }}>{drawnCard.name}</div>
                <div style={{ fontSize:10, color:"rgba(139,92,246,0.7)" }}>{drawnCard.korean}</div>
              </motion.div>
            </div>

            {/* 카드 해석 */}
            <div style={{ marginBottom:20, padding:"20px", background:"rgba(139,92,246,0.07)",
              borderLeft:"3px solid rgba(139,92,246,0.6)", borderRadius:"0 12px 12px 0" }}>
              <div style={{ fontSize:13, color:"rgba(139,92,246,0.8)", marginBottom:10, letterSpacing:1 }}>
                ✦ {cat?.label} 리딩
              </div>
              <div style={{ fontSize:16, color:"#e2e8f0", lineHeight:2.0 }}>
                {selectedCategory==="love" ? drawnCard.meaning_love
                 : selectedCategory==="work" ? drawnCard.meaning_work
                 : drawnCard.meaning_self}
              </div>
            </div>

            {/* 심층 메시지 */}
            <div style={{ marginBottom:28, padding:"18px", background:"rgba(255,255,255,0.03)",
              border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:12 }}>
              <div style={{ fontSize:13, color:"#6b7280", marginBottom:10, letterSpacing:1 }}>✦ 아스트라의 말</div>
              <div style={{ fontSize:15, color:"#9ca3af", lineHeight:1.9 }}>
                {selectedCategory==="love"
                  ? `"${selectedQuestion}"에 대한 답으로 ${drawnCard.name} 카드가 왔습니다. 지금 이 관계에서 당신이 가장 먼저 해야 할 것은 자신의 마음을 먼저 솔직하게 들여다보는 것입니다.`
                  : selectedCategory==="work"
                  ? `"${selectedQuestion}"에 대한 답으로 ${drawnCard.name} 카드가 왔습니다. 지금 당신의 에너지는 이 방향을 지지하고 있습니다. 두려움보다 직관을 믿으세요.`
                  : `"${selectedQuestion}"에 대한 답으로 ${drawnCard.name} 카드가 왔습니다. 지금 이 순간 당신에게 가장 필요한 것이 무엇인지, 이 카드가 조용히 말해주고 있습니다.`}
              </div>
            </div>

            {/* 다른 질문 / 사주도 보기 유도 */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <motion.div whileTap={{scale:0.98}} onClick={() => { setStep("category"); setDrawnCard(null); setSelectedCategory(null); setSelectedQuestion(null); }}
                style={{ padding:"16px 18px", background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:22 }}>🃏</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#f1f5f9" }}>다른 질문 타로 보기</div>
                  <div style={{ fontSize:12, color:"#6b7280" }}>새로운 질문으로 카드를 다시 뽑아보세요</div>
                </div>
                <div style={{ fontSize:18, color:"rgba(139,92,246,0.5)" }}>›</div>
              </motion.div>

              <motion.div whileTap={{scale:0.98}} onClick={onGoFusion}
                style={{ padding:"16px 18px", background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.3)", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:22 }}>✦</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#f1f5f9" }}>사주 + 타로 융합 분석</div>
                  <div style={{ fontSize:12, color:"#6b7280" }}>생년월일로 더 깊은 운명 읽기</div>
                </div>
                <div style={{ fontSize:18, color:"rgba(236,72,153,0.5)" }}>›</div>
              </motion.div>

              <motion.div whileTap={{scale:0.98}} onClick={onRestart}
                style={{ padding:"16px 18px", background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:22 }}>✦</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#f1f5f9" }}>처음으로</div>
                  <div style={{ fontSize:12, color:"#6b7280" }}>새로운 아우라 분석 시작하기</div>
                </div>
                <div style={{ fontSize:18, color:"rgba(255,255,255,0.2)" }}>›</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DirectInput({ onSubmit }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ marginTop:4 }}>
      <div style={{ fontSize:13, color:"#4b5563", marginBottom:8 }}>또는 직접 질문 입력</div>
      <div style={{ display:"flex", gap:10 }}>
        <input value={val} onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&val.trim()&&onSubmit(val.trim())}
          placeholder="궁금한 것을 입력하세요..."
          style={{ flex:1, background:"rgba(0,0,0,0.4)", border:"1px solid rgba(139,92,246,0.25)",
            borderRadius:10, padding:"12px 14px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"inherit" }} />
        <button onClick={()=>val.trim()&&onSubmit(val.trim())}
          style={{ padding:"12px 18px", background:"rgba(139,92,246,0.2)", border:"1px solid rgba(139,92,246,0.4)",
            borderRadius:10, color:"#a78bfa", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          ›
        </button>
      </div>
    </div>
  );
}
