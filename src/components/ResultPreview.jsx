import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

export default function ResultPreview({ drawnCard, birthDate, chatType, sajuData, guardianColor, onPaid }) {
  const [r, g, b] = guardianColor || [139, 92, 246];

  // sajuData 없으면 로딩 fallback
  if (!sajuData) return (
    <div style={{ background:"#020209", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#a78bfa", fontSize:16 }}>아우라 분석 중...</div>
    </div>
  );

  const { dominant, auraType, ohangDist, coreMessage, domainFortune, monthlyFortune, cardRelation, zodiacAnimal, yearPillar, monthPillar, dayPillar } = sajuData;
  const auraColor = auraType.color || [r, g, b];
  const [ar, ag, ab] = auraColor;

  return (
    <div style={{ background:"#020209", minHeight:"100vh", fontFamily:"'Apple SD Gothic Neo', system-ui, sans-serif", color:"#e2e8f0", paddingBottom:140 }}>

      {/* 헤더 */}
      <div style={{ padding:"18px 22px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(2,2,9,0.97)", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:26, letterSpacing:3, color:`rgba(${ar},${ag},${ab},1)`, fontWeight:900 }}>AURA</span>
        <span style={{ fontSize:15, color:"#9ca3af", fontWeight:600, flex:1 }}>운명 분석 결과</span>
        <span style={{ background:`rgba(${ar},${ag},${ab},0.15)`, border:`1px solid rgba(${ar},${ag},${ab},0.35)`, borderRadius:20, padding:"3px 11px", fontSize:9, color:`rgb(${ar},${ag},${ab})`, fontWeight:700, letterSpacing:2 }}>PREVIEW</span>
      </div>

      {/* 커버 */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        style={{ padding:"28px 22px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:300, height:180, background:`radial-gradient(ellipse, rgba(${ar},${ag},${ab},0.22) 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ display:"flex", gap:20, alignItems:"flex-start", position:"relative" }}>
          <motion.div
            animate={{ boxShadow:[`0 0 0 0 rgba(${ar},${ag},${ab},0)`,`0 0 0 14px rgba(${ar},${ag},${ab},0.08)`,`0 0 0 0 rgba(${ar},${ag},${ab},0)`] }}
            transition={{ duration:3, repeat:Infinity }}
            style={{ width:84, height:84, borderRadius:"50%", flexShrink:0, background:`radial-gradient(circle at 33% 33%, rgba(${ar},${ag},${ab},0.85) 0%, rgba(${ar},${ag},${ab},0.45) 50%, rgba(${ar},${ag},${ab},0.15) 100%)`, border:`1.5px solid rgba(${ar},${ag},${ab},0.7)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>
            ✦
          </motion.div>
          <div>
            <div style={{ fontSize:13, letterSpacing:4, color:`rgba(${ar},${ag},${ab},0.9)`, fontWeight:600, marginBottom:7 }}>YOUR AURA TYPE</div>
            <div style={{ fontSize:25, fontWeight:900, color:"#c4b5fd", lineHeight:1.2, marginBottom:8 }}>{auraType.type}</div>
            <div style={{ fontSize:16, color:"#9ca3af", marginBottom:14, lineHeight:1.6 }}>{auraType.desc}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {[
                { text:`${dominant.name} ${dominant.pct}%`, bg:`rgba(${ar},${ag},${ab},0.15)`, bc:`rgba(${ar},${ag},${ab},0.4)`, tc:`rgb(${ar},${ag},${ab})` },
                { text:`${zodiacAnimal}띠 · ${yearPillar.gan}년`, bg:"rgba(59,130,246,0.12)", bc:"rgba(59,130,246,0.35)", tc:"#93c5fd" },
                drawnCard && { text:`${drawnCard.korean} · ${drawnCard.name}`, bg:"rgba(236,72,153,0.12)", bc:"rgba(236,72,153,0.35)", tc:"#f9a8d4" },
              ].filter(Boolean).map((t,i)=>(
                <span key={i} style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700, background:t.bg, border:`0.5px solid ${t.bc}`, color:t.tc }}>{t.text}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 핵심 메시지 — 공개 */}
      <Section title="핵심 메시지" color={[ar,ag,ab]}>
        <div style={{ background:`rgba(${ar},${ag},${ab},0.07)`, borderLeft:`3px solid rgba(${ar},${ag},${ab},0.6)`, borderRadius:"0 12px 12px 0", padding:"18px 20px", fontSize:17, color:"#e2e8f0", lineHeight:2.1 }}>
          {coreMessage.split('\n\n').map((para, i) => (
            <p key={i} style={{ margin: i>0?"14px 0 0":0 }}>{para}</p>
          ))}
        </div>
      </Section>

      <Divider />

      {/* 사주 팔자 — 공개 */}
      <Section title="사주 기본 정보" color={[ar,ag,ab]}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[
            { label:"연주(年柱)", gan:yearPillar.gan, ji:yearPillar.ji, sub:`${zodiacAnimal}띠` },
            { label:"월주(月柱)", gan:monthPillar.gan, ji:monthPillar.ji, sub:"월주" },
            { label:"일주(日柱)", gan:dayPillar.gan, ji:dayPillar.ji, sub:"일간" },
          ].map((p,i)=>(
            <div key={i} style={{ borderRadius:10, padding:"14px 12px", background:`rgba(${ar},${ag},${ab},0.06)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.2)`, textAlign:"center" }}>
              <div style={{ fontSize:13, color:"#9ca3af", letterSpacing:1, marginBottom:8, fontWeight:600 }}>{p.label}</div>
              <div style={{ fontSize:22, fontWeight:900, color:`rgb(${ar},${ag},${ab})` }}>{p.gan}</div>
              <div style={{ fontSize:19, fontWeight:700, color:"#c4b5fd", marginTop:5 }}>{p.ji}</div>
              <div style={{ fontSize:13, color:"#6b7280", marginTop:7 }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* 오행 분포 — 공개 */}
      <Section title="오행 에너지 분포" color={[ar,ag,ab]}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ohangDist.map((o,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:15, width:58, flexShrink:0, color:"#e2e8f0", fontWeight:600 }}>{o.name}</span>
              <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                <motion.div initial={{width:0}} animate={{width:`${o.pct}%`}} transition={{delay:i*0.1,duration:0.9}}
                  style={{ height:"100%", borderRadius:3, background:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }} />
              </div>
              <span style={{ fontSize:15, width:40, textAlign:"right", color:"#9ca3af", fontWeight:700, flexShrink:0 }}>{o.pct}%</span>
              {i===0 && <span style={{ fontSize:12, padding:"4px 11px", borderRadius:20, background:`rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.15)`, border:`0.5px solid rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.4)`, color:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }}>주도</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)", fontSize:15, color:"#9ca3af", lineHeight:1.8 }}>
          <span style={{ color:`rgb(${ar},${ag},${ab})`, fontWeight:700 }}>{dominant.name}</span> 기운이 가장 강한 당신 — {dominant.trait}
        </div>
      </Section>

      <Divider />

      {/* 타로 결과 — 공개 (있을 때만) */}
      {drawnCard && (
        <>
          <Section title="타로 · 오행 융합" color={[ar,ag,ab]}>
            <div style={{ display:"flex", gap:14, marginBottom:12 }}>
              <div style={{ flexShrink:0, width:70, height:112, borderRadius:9, background:"linear-gradient(145deg,#0f172a,#1e1b4b)", border:`1px solid rgba(${ar},${ag},${ab},0.7)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:8 }}>
                <div style={{ fontSize:24 }}>☽</div>
                <div style={{ fontSize:8, color:"#c4b5fd", textAlign:"center", fontWeight:700, lineHeight:1.3 }}>{drawnCard.name}</div>
                <div style={{ fontSize:7, color:"#7c3aed" }}>{drawnCard.korean}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#c4b5fd", marginBottom:6 }}>{drawnCard.name} — {drawnCard.korean}</div>
                <div style={{ fontSize:15, color:"#9ca3af", lineHeight:1.8, marginBottom:10 }}>{drawnCard.meaning}</div>
                {cardRelation && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700,
                    background: cardRelation.rel.includes("상생") ? "rgba(52,211,153,0.12)" : cardRelation.rel.includes("상극") ? "rgba(239,68,68,0.12)" : "rgba(139,92,246,0.12)",
                    border: `0.5px solid ${cardRelation.rel.includes("상생") ? "rgba(52,211,153,0.35)" : cardRelation.rel.includes("상극") ? "rgba(239,68,68,0.35)" : "rgba(139,92,246,0.35)"}`,
                    color: cardRelation.rel.includes("상생") ? "#6ee7b7" : cardRelation.rel.includes("상극") ? "#fca5a5" : "#c4b5fd" }}>
                    {cardRelation.rel.includes("상생") ? "✓" : cardRelation.rel.includes("상극") ? "⚡" : "◎"} {dominant.name} × {drawnCard.element} — {cardRelation.rel}
                  </span>
                )}
                {cardRelation && <div style={{ marginTop:10, fontSize:15, color:"#9ca3af", lineHeight:1.8 }}>{cardRelation.desc}</div>}
              </div>
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* 연애운 — 공개 1개 */}
      <Section title="분야별 운세" color={[ar,ag,ab]}>
        <div style={{ borderRadius:11, padding:"15px 14px", marginBottom:10, background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:20, marginBottom:8 }}>💜</div>
          <div style={{ fontSize:13, letterSpacing:2, color:"#9ca3af", fontWeight:700, marginBottom:6 }}>연애 · 관계</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#f1f5f9", marginBottom:8 }}>{domainFortune.love.title}</div>
          <div style={{ fontSize:15, color:"#b0a8c8", lineHeight:1.75 }}>{domainFortune.love.desc}</div>
          <div style={{ display:"flex", gap:3, marginTop:9 }}>
            {[1,2,3,4,5].map(s=><div key={s} style={{ width:7, height:7, borderRadius:"50%", background:s<=domainFortune.love.score?`rgb(${ar},${ag},${ab})`:"rgba(255,255,255,0.1)" }} />)}
          </div>
        </div>

        {/* 커리어·재물 블러 잠금 */}
        <div style={{ position:"relative" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, filter:"blur(5px)", userSelect:"none", pointerEvents:"none" }}>
            {[
              { icon:"⚡", label:"직업 · 커리어", title:domainFortune.work.title, score:domainFortune.work.score },
              { icon:"🌊", label:"재물 · 건강",  title:domainFortune.money.title, score:domainFortune.money.score },
            ].map((f,i)=>(
              <div key={i} style={{ borderRadius:11, padding:"15px 14px", background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:20, marginBottom:8 }}>{f.icon}</div>
                <div style={{ fontSize:13, letterSpacing:2, color:"#9ca3af", fontWeight:700, marginBottom:6 }}>{f.label}</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#f1f5f9", marginBottom:7 }}>{f.title}</div>
                <div style={{ display:"flex", gap:3, marginTop:8 }}>
                  {[1,2,3,4,5].map(s=><div key={s} style={{ width:7, height:7, borderRadius:"50%", background:s<=f.score?`rgb(${ar},${ag},${ab})`:"rgba(255,255,255,0.1)" }} />)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Lock size={20} style={{ color:`rgba(${ar},${ag},${ab},0.8)` }} />
            <span style={{ fontSize:15, color:"#9ca3af", fontWeight:600 }}>전체 결과에서 공개</span>
          </div>
        </div>
      </Section>

      <Divider />

      {/* 월별 운세 앞 3개 공개, 나머지 블러 */}
      <Section title="2026 하반기 월별 운세" color={[ar,ag,ab]}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
          {monthlyFortune.map((mo,i)=>(
            <div key={i} style={{ borderRadius:8, padding:"10px 4px", textAlign:"center",
              background: mo.peak ? `rgba(${ar},${ag},${ab},0.09)` : "rgba(255,255,255,0.03)",
              border:`0.5px solid ${mo.peak ? `rgba(${ar},${ag},${ab},0.4)` : "rgba(255,255,255,0.07)"}`,
              ...(i>=3?{filter:"blur(4px)",userSelect:"none"}:{}) }}>
              <div style={{ fontSize:14, fontWeight:700, color:mo.peak?`rgb(${ar},${ag},${ab})`:"#9ca3af", marginBottom:5 }}>{mo.m}</div>
              <div style={{ fontSize:13, color:`rgb(${ar},${ag},${ab})`, letterSpacing:-1 }}>{"★".repeat(mo.stars)}{"☆".repeat(5-mo.stars)}</div>
              <div style={{ fontSize:12, fontWeight:600, color:mo.peak?"#c4b5fd":"#6b7280", marginTop:5 }}>{mo.key}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:10, fontSize:14, color:"#6b7280", fontWeight:500 }}>
          <Lock size={11} style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />
          10월~12월 운세는 전체 결과에서 확인하세요
        </div>
      </Section>

      {/* 하단 고정 CTA */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, padding:"16px 20px 28px", background:"linear-gradient(to top, #020209 60%, transparent)" }}>
        <motion.button whileTap={{ scale:0.97 }} onClick={onPaid}
          style={{ width:"100%", padding:"17px 0", background:`linear-gradient(90deg, rgb(${ar},${ag},${ab}), rgba(${ar},${ag},${ab},0.75))`, border:"none", borderRadius:14, color:"#fff", fontSize:18, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit", letterSpacing:1 }}>
          <Sparkles size={18} /> 전체 결과 보기 →
        </motion.button>
      </div>
    </div>
  );
}

function Section({ title, children, color }) {
  return (
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ fontSize:11, letterSpacing:4, color:"#4b5563", display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        {title}<div style={{ flex:1, height:0.5, background:"rgba(255,255,255,0.07)" }} />
      </div>
      {children}
    </div>
  );
}
function Divider() { return <div style={{ height:0.5, background:"rgba(255,255,255,0.05)", margin:"22px 22px 0" }} />; }
