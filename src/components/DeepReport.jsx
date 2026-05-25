import { motion } from "framer-motion";

export default function DeepReport({ sajuData, drawnCard, onBack }) {
  if (!sajuData) return (
    <div style={{ background:"#020209", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#a78bfa", fontSize:16 }}>리포트 생성 중...</div>
    </div>
  );

  const { dominant, auraType, ohangDist, coreMessage, domainFortune, monthlyFortune, cardRelation, zodiacAnimal, yearPillar, monthPillar, dayPillar, birthDate } = sajuData;
  const [ar,ag,ab] = auraType.color || [139,92,246];

  return (
    <div style={{ background:"#020209", minHeight:"100vh", fontFamily:"'Apple SD Gothic Neo',system-ui,sans-serif", color:"#e2e8f0" }}>

      {/* 헤더 */}
      <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(2,2,9,0.97)", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", color:"#9ca3af", fontSize:18 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, letterSpacing:4, color:`rgba(${ar},${ag},${ab},0.7)` }}>AURA DEEP REPORT</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>융합 아우라 심층 분석</div>
        </div>
        <div style={{ background:`rgba(${ar},${ag},${ab},0.15)`, border:`1px solid rgba(${ar},${ag},${ab},0.35)`, borderRadius:20, padding:"3px 11px", fontSize:9, color:`rgb(${ar},${ag},${ab})`, fontWeight:700, letterSpacing:2 }}>FULL</div>
      </div>

      <div style={{ padding:"0 0 32px" }}>

        {/* 커버 */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          style={{ padding:"28px 22px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:320, height:200, background:`radial-gradient(ellipse, rgba(${ar},${ag},${ab},0.22) 0%, transparent 70%)`, pointerEvents:"none" }} />
          <div style={{ display:"flex", gap:20, alignItems:"flex-start", position:"relative" }}>
            <motion.div animate={{ boxShadow:[`0 0 0 0 rgba(${ar},${ag},${ab},0)`,`0 0 0 16px rgba(${ar},${ag},${ab},0.08)`,`0 0 0 0 rgba(${ar},${ag},${ab},0)`] }} transition={{ duration:3, repeat:Infinity }}
              style={{ width:88, height:88, borderRadius:"50%", flexShrink:0, background:`radial-gradient(circle at 33% 33%, rgba(${ar},${ag},${ab},0.85) 0%, rgba(${ar},${ag},${ab},0.45) 50%, rgba(${ar},${ag},${ab},0.15) 100%)`, border:`1.5px solid rgba(${ar},${ag},${ab},0.7)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>✦</motion.div>
            <div>
              <div style={{ fontSize:11, letterSpacing:4, color:`rgba(${ar},${ag},${ab},0.6)`, marginBottom:7 }}>YOUR AURA TYPE</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#c4b5fd", lineHeight:1.2, marginBottom:5 }}>{auraType.type}</div>
              <div style={{ fontSize:14, color:"#6b7280", marginBottom:14, lineHeight:1.5 }}>{auraType.desc}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {[
                  { text:`${dominant.name} ${dominant.pct}%`, bg:`rgba(${ar},${ag},${ab},0.15)`, bc:`rgba(${ar},${ag},${ab},0.4)`, tc:`rgb(${ar},${ag},${ab})` },
                  { text:`${zodiacAnimal}띠 · ${birthDate}생`, bg:"rgba(59,130,246,0.12)", bc:"rgba(59,130,246,0.35)", tc:"#93c5fd" },
                  drawnCard && { text:`${drawnCard.korean} · ${drawnCard.name}`, bg:"rgba(236,72,153,0.12)", bc:"rgba(236,72,153,0.35)", tc:"#f9a8d4" },
                ].filter(Boolean).map((t,i)=>(
                  <span key={i} style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:t.bg, border:`0.5px solid ${t.bc}`, color:t.tc }}>{t.text}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 핵심 메시지 */}
        <Section title="핵심 메시지" color={[ar,ag,ab]}>
          <div style={{ background:`rgba(${ar},${ag},${ab},0.07)`, borderLeft:`3px solid rgba(${ar},${ag},${ab},0.6)`, borderRadius:"0 12px 12px 0", padding:"18px 20px", fontSize:15, color:"#d1d5db", lineHeight:2.0 }}>
            {coreMessage.split('\n\n').map((p,i)=><p key={i} style={{ margin:i>0?"14px 0 0":0 }}>{p}</p>)}
          </div>
        </Section>

        <Divider />

        {/* 사주 팔자 */}
        <Section title="사주 팔자" color={[ar,ag,ab]}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
            {[
              { label:"연주(年柱)", gan:yearPillar.gan, ji:yearPillar.ji, sub:`${zodiacAnimal}띠`, ohang:yearPillar.ganOhang },
              { label:"월주(月柱)", gan:monthPillar.gan, ji:monthPillar.ji, sub:"월주", ohang:monthPillar.ganOhang },
              { label:"일주(日柱)", gan:dayPillar.gan, ji:dayPillar.ji, sub:"일간", ohang:dayPillar.ganOhang },
            ].map((p,i)=>(
              <div key={i} style={{ borderRadius:10, padding:"14px 12px", background:`rgba(${ar},${ag},${ab},0.06)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.2)`, textAlign:"center" }}>
                <div style={{ fontSize:10, color:"#6b7280", letterSpacing:1, marginBottom:8 }}>{p.label}</div>
                <div style={{ fontSize:20, fontWeight:900, color:`rgb(${ar},${ag},${ab})` }}>{p.gan}</div>
                <div style={{ fontSize:17, fontWeight:700, color:"#c4b5fd", marginTop:4 }}>{p.ji}</div>
                <div style={{ fontSize:11, color:"#4b5563", marginTop:6 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 오행 분포 */}
        <Section title="오행 에너지 분포" color={[ar,ag,ab]}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {ohangDist.map((o,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:13, width:52, flexShrink:0, color:"#9ca3af" }}>{o.name}</span>
                <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                  <motion.div initial={{width:0}} animate={{width:`${o.pct}%`}} transition={{delay:i*0.1,duration:0.9}} style={{ height:"100%", borderRadius:3, background:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }} />
                </div>
                <span style={{ fontSize:12, width:34, textAlign:"right", color:"#6b7280", flexShrink:0 }}>{o.pct}%</span>
                {i===0 && <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:`rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.15)`, border:`0.5px solid rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.4)`, color:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }}>주도</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)", fontSize:13, color:"#9ca3af", lineHeight:1.7 }}>
            <span style={{ color:`rgb(${ar},${ag},${ab})`, fontWeight:700 }}>{dominant.name}</span> 기운이 가장 강한 당신 — {dominant.trait}
          </div>
        </Section>

        <Divider />

        {/* 타로 + 융합 인사이트 */}
        {drawnCard && (
          <>
            <Section title="타로 · 융합 인사이트" color={[ar,ag,ab]}>
              <div style={{ display:"flex", gap:14, marginBottom:14 }}>
                <div style={{ flexShrink:0, width:72, height:115, borderRadius:10, background:"linear-gradient(145deg,#0f172a,#1e1b4b)", border:`1px solid rgba(${ar},${ag},${ab},0.7)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:8 }}>
                  <div style={{ fontSize:26 }}>☽</div>
                  <div style={{ fontSize:8, color:"#c4b5fd", textAlign:"center", fontWeight:700, lineHeight:1.3 }}>{drawnCard.name}</div>
                  <div style={{ fontSize:7, color:"#7c3aed" }}>{drawnCard.korean}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#c4b5fd", marginBottom:5 }}>{drawnCard.name} — {drawnCard.korean}</div>
                  <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.7, marginBottom:8 }}>{drawnCard.meaning}</div>
                  {cardRelation && (
                    <>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700,
                        background:cardRelation.rel.includes("상생")?"rgba(52,211,153,0.12)":cardRelation.rel.includes("상극")?"rgba(239,68,68,0.12)":"rgba(139,92,246,0.12)",
                        border:`0.5px solid ${cardRelation.rel.includes("상생")?"rgba(52,211,153,0.35)":cardRelation.rel.includes("상극")?"rgba(239,68,68,0.35)":"rgba(139,92,246,0.35)"}`,
                        color:cardRelation.rel.includes("상생")?"#6ee7b7":cardRelation.rel.includes("상극")?"#fca5a5":"#c4b5fd" }}>
                        {cardRelation.rel.includes("상생")?"✓":cardRelation.rel.includes("상극")?"⚡":"◎"} {dominant.name} × {drawnCard.element} — {cardRelation.rel}
                      </span>
                      <div style={{ marginTop:12, padding:"14px 16px", borderRadius:10, background:"rgba(236,72,153,0.06)", border:"1px solid rgba(236,72,153,0.18)", fontSize:14, color:"#d1d5db", lineHeight:1.9 }}>
                        당신의 <span style={{ color:"#f9a8d4", fontWeight:700 }}>{dominant.name} 에너지</span>가 뽑으신 <span style={{ color:"#f9a8d4", fontWeight:700 }}>{drawnCard.name} 카드</span>와 <span style={{ color:"#f9a8d4", fontWeight:700 }}>{cardRelation.rel}</span>하고 있습니다.<br />
                        {cardRelation.desc} 2026년 하반기, <span style={{ color:"#f9a8d4", fontWeight:700 }}>{monthlyFortune.find(m=>m.peak)?.m || "8월"}</span>이 가장 강력한 전환점이 됩니다.
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* 분야별 운세 전체 공개 */}
        <Section title="분야별 운세" color={[ar,ag,ab]}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"💜", label:"연애 · 관계", ...domainFortune.love },
              { icon:"⚡", label:"직업 · 커리어", ...domainFortune.work },
              { icon:"🌊", label:"재물 · 건강", ...domainFortune.money },
            ].map((f,i)=>(
              <div key={i} style={{ borderRadius:11, padding:"16px 15px", background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:20, marginBottom:8 }}>{f.icon}</div>
                <div style={{ fontSize:11, letterSpacing:2, color:"#6b7280", marginBottom:5 }}>{f.label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.6, marginBottom:8 }}>{f.desc}</div>
                <div style={{ display:"flex", gap:3 }}>
                  {[1,2,3,4,5].map(s=><div key={s} style={{ width:7, height:7, borderRadius:"50%", background:s<=f.score?`rgb(${ar},${ag},${ab})`:"rgba(255,255,255,0.1)" }} />)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 월별 운세 전체 공개 */}
        <Section title="2026 하반기 월별 운세" color={[ar,ag,ab]}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
            {monthlyFortune.map((mo,i)=>(
              <div key={i} style={{ borderRadius:8, padding:"10px 4px", textAlign:"center", background:mo.peak?`rgba(${ar},${ag},${ab},0.09)`:"rgba(255,255,255,0.03)", border:`0.5px solid ${mo.peak?`rgba(${ar},${ag},${ab},0.4)`:"rgba(255,255,255,0.07)"}` }}>
                <div style={{ fontSize:12, color:mo.peak?`rgb(${ar},${ag},${ab})`:"#6b7280", marginBottom:5 }}>{mo.m}</div>
                <div style={{ fontSize:11, color:`rgb(${ar},${ag},${ab})`, letterSpacing:-1 }}>{"★".repeat(mo.stars)}{"☆".repeat(5-mo.stars)}</div>
                <div style={{ fontSize:10, color:mo.peak?"#a78bfa":"#4b5563", marginTop:4 }}>{mo.key}</div>
              </div>
            ))}
          </div>
          {monthlyFortune.filter(m=>m.peak).length > 0 && (
            <div style={{ marginTop:12, padding:"12px 14px", borderRadius:10, background:`rgba(${ar},${ag},${ab},0.06)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.2)`, fontSize:13, color:`rgba(${ar},${ag},${ab},0.9)` }}>
              ★ <span style={{ fontWeight:700 }}>{monthlyFortune.find(m=>m.peak)?.m}</span>이 2026년 하반기 최대 전환점입니다.
            </div>
          )}
        </Section>

        <Divider />

        {/* 아우라 부적 */}
        <Section title="나의 아우라 부적" color={[ar,ag,ab]}>
          <div style={{ display:"flex", gap:14, alignItems:"center", background:`rgba(${ar},${ag},${ab},0.05)`, border:`1px solid rgba(${ar},${ag},${ab},0.16)`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ width:72, height:72, borderRadius:10, flexShrink:0, background:`linear-gradient(135deg, rgba(${ar},${ag},${ab},0.3), rgba(${ar},${ag},${ab},0.08))`, border:`1px solid rgba(${ar},${ag},${ab},0.5)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>🔮</div>
            <div>
              <div style={{ fontSize:11, letterSpacing:3, color:`rgba(${ar},${ag},${ab},0.6)`, marginBottom:4 }}>AURA TALISMAN</div>
              <div style={{ fontSize:16, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>{dominant.name} · {zodiacAnimal}의 부적</div>
              <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.5, marginBottom:10 }}>당신의 오행·타로를 기반으로 생성된<br />고화질 A4 인쇄용 맞춤 부적</div>
              <button style={{ padding:"7px 16px", background:`rgba(${ar},${ag},${ab},0.18)`, border:`1px solid rgba(${ar},${ag},${ab},0.4)`, borderRadius:20, color:`rgb(${ar},${ag},${ab})`, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>↓ PNG 다운로드</button>
            </div>
          </div>
        </Section>

        {/* 푸터 */}
        <div style={{ margin:"22px 22px 0", padding:"13px 16px", borderRadius:10, background:"rgba(255,255,255,0.02)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#374151" }}>AURA © 2026 · 융합 분석 v2.6<br />{birthDate}생 맞춤 분석</span>
          <button style={{ padding:"7px 16px", background:`rgba(${ar},${ag},${ab},0.14)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.3)`, borderRadius:20, color:`rgb(${ar},${ag},${ab})`, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>↗ 공유하기</button>
        </div>
      </div>
    </div>
  );
}

function Section({title,children,color}){
  const [r,g,b]=color||[139,92,246];
  return (
    <div style={{padding:"22px 22px 0"}}>
      <div style={{fontSize:11,letterSpacing:4,color:"#4b5563",display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        {title}<div style={{flex:1,height:0.5,background:"rgba(255,255,255,0.07)"}} />
      </div>
      {children}
    </div>
  );
}
function Divider(){return <div style={{height:0.5,background:"rgba(255,255,255,0.05)",margin:"22px 22px 0"}} />;}
