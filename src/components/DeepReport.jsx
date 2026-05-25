import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── 아우라 부적 Canvas ── */
function AmuletCanvas({ dominant, zodiacAnimal, color }) {
  const canvasRef = useRef(null);
  const [r,g,b] = color || [139,92,246];
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 280; const H = canvas.height = 280;
    const cx = W/2, cy = H/2;
    let t = 0;

    function draw() {
      ctx.clearRect(0,0,W,H);
      // 배경 원
      const bg = ctx.createRadialGradient(cx,cy,0,cx,cy,130);
      bg.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
      bg.addColorStop(0.5, `rgba(${r},${g},${b},0.12)`);
      bg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(cx,cy,130,0,Math.PI*2);
      ctx.fillStyle=bg; ctx.fill();

      // 회전 링 3개
      for(let i=0;i<3;i++){
        const rad=60+i*22;
        const alpha=0.25-i*0.06;
        const dash=i%2===0?[8,6]:[4,8];
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(t*(0.4+i*0.15)*(i%2===0?1:-1));
        ctx.setLineDash(dash);
        ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth=1.5; ctx.stroke();
        ctx.restore();
      }

      // 파티클
      for(let i=0;i<8;i++){
        const angle=(i/8)*Math.PI*2+t*0.5;
        const dist=55+Math.sin(t*2+i)*8;
        const px=cx+Math.cos(angle)*dist, py=cy+Math.sin(angle)*dist;
        const pa=0.5+Math.sin(t+i)*0.3;
        ctx.beginPath(); ctx.arc(px,py,2,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${pa})`; ctx.fill();
      }

      // 중앙 글로우
      const inner=ctx.createRadialGradient(cx,cy,0,cx,cy,44);
      inner.addColorStop(0,`rgba(${r},${g},${b},0.9)`);
      inner.addColorStop(0.5,`rgba(${r},${g},${b},0.4)`);
      inner.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(cx,cy,44,0,Math.PI*2);
      ctx.fillStyle=inner; ctx.fill();

      // 중앙 텍스트 — 오행 한자
      const KANJI={"목(木)":"木","화(火)":"火","토(土)":"土","금(金)":"金","수(水)":"水"};
      const kanji=KANJI[dominant?.name]||"✦";
      ctx.fillStyle=`rgba(255,255,255,0.95)`;
      ctx.font=`bold 36px serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.shadowColor=`rgba(${r},${g},${b},0.8)`; ctx.shadowBlur=16;
      ctx.fillText(kanji,cx,cy-6);
      ctx.shadowBlur=0;
      ctx.font=`500 12px sans-serif`;
      ctx.fillStyle=`rgba(${r},${g},${b},0.9)`;
      ctx.fillText(zodiacAnimal+"띠",cx,cy+20);

      // 외곽 별자리 점
      for(let i=0;i<12;i++){
        const a=(i/12)*Math.PI*2-Math.PI/2;
        const px=cx+Math.cos(a)*115, py=cy+Math.sin(a)*115;
        ctx.beginPath(); ctx.arc(px,py,i%3===0?3:1.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${i%3===0?0.8:0.3})`; ctx.fill();
      }

      t+=0.018;
      animRef.current=requestAnimationFrame(draw);
    }
    animRef.current=requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(animRef.current);
  },[dominant,color]);

  return <canvas ref={canvasRef} style={{width:280,height:280,borderRadius:"50%"}}/>;
}

/* ── 공유 모달 ── */
function ShareModal({ onClose, color, birthDate, auraType }) {
  const [copied, setCopied] = useState(false);
  const [r,g,b]=color||[139,92,246];
  const shareText = `✦ AURA 운명 분석 결과\n${birthDate}생 · ${auraType?.type||"아우라 분석"}\n\naura.app에서 나의 사주+타로 융합 아우라를 확인해보세요`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };
  const handleEmail = () => {
    window.location.href=`mailto:?subject=나의 AURA 운명 분석 결과&body=${encodeURIComponent(shareText)}`;
  };
  const handlePrint = () => { window.print(); };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:"0 0 0 0" }}>
      <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
        transition={{type:"spring",damping:24}}
        onClick={e=>e.stopPropagation()}
        style={{ width:"100%",maxWidth:480,background:"linear-gradient(145deg,#0a0a1a,#0f0f2a)",
          border:`1px solid rgba(${r},${g},${b},0.3)`, borderRadius:"20px 20px 0 0",
          padding:"24px 22px 36px", boxShadow:`0 -8px 40px rgba(${r},${g},${b},0.18)` }}>

        {/* 핸들 */}
        <div style={{width:40,height:4,borderRadius:4,background:"rgba(255,255,255,0.15)",margin:"0 auto 20px"}}/>

        <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9",marginBottom:6}}>결과 공유하기</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>당신의 아우라 분석 결과를 나눠보세요</div>

        {/* 공유 미리보기 */}
        <div style={{ padding:"14px 16px",background:`rgba(${r},${g},${b},0.08)`,border:`1px solid rgba(${r},${g},${b},0.2)`,borderRadius:12,marginBottom:20,fontSize:13,color:"#d1d5db",lineHeight:1.8,whiteSpace:"pre-line" }}>
          {shareText}
        </div>

        {/* 버튼 3개 */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <motion.button whileTap={{scale:0.97}} onClick={handleCopy}
            style={{ width:"100%",padding:"14px",background:copied?`rgba(${r},${g},${b},0.3)`:`rgba(${r},${g},${b},0.12)`,
              border:`1px solid rgba(${r},${g},${b},0.4)`,borderRadius:12,
              color:`rgb(${r},${g},${b})`,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            <span>{copied?"✓":"📋"}</span> {copied?"복사됨!":"링크·텍스트 복사"}
          </motion.button>

          <motion.button whileTap={{scale:0.97}} onClick={handleEmail}
            style={{ width:"100%",padding:"14px",background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,
              color:"#d1d5db",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            <span>📧</span> 이메일로 보내기
          </motion.button>

          <motion.button whileTap={{scale:0.97}} onClick={handlePrint}
            style={{ width:"100%",padding:"14px",background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,
              color:"#d1d5db",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            <span>🖨️</span> 출력하기
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── 메인 DeepReport ── */
export default function DeepReport({ sajuData, drawnCard, chatType, onBack, onRestart }) {
  const [showShare, setShowShare] = useState(false);

  if (!sajuData) return (
    <div style={{ background:"#020209", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#a78bfa", fontSize:16 }}>리포트 생성 중...</div>
    </div>
  );

  const { dominant, auraType, ohangDist, coreMessage, domainFortune, monthlyFortune, cardRelation, zodiacAnimal, yearPillar, monthPillar, dayPillar, birthDate } = sajuData;
  const [ar,ag,ab] = auraType.color || [139,92,246];

  // 다음 추천: 타로만 → 사주 추천 / 사주만 → 타로 추천 / 융합 → 다시하기
  const nextSuggestions = chatType === "tarot"
    ? [{ type:"saju", icon:"☀️", label:"사주로 더 깊이", desc:"태어난 팔자로 운명의 큰 흐름을 읽어보세요" },
       { type:"home", icon:"✦", label:"처음으로", desc:"새로운 아우라 분석 시작하기" }]
    : chatType === "saju"
    ? [{ type:"tarot", icon:"🌙", label:"타로로 오늘을 보기", desc:"지금 이 순간 우주가 보내는 메시지를 확인하세요" },
       { type:"home", icon:"✦", label:"처음으로", desc:"새로운 아우라 분석 시작하기" }]
    : [{ type:"tarot", icon:"🌙", label:"타로 다시 뽑기", desc:"오늘의 카드 메시지를 새로 확인해보세요" },
       { type:"saju", icon:"☀️", label:"사주 다시 보기", desc:"다른 질문으로 사주를 탐구해보세요" },
       { type:"home", icon:"✦", label:"처음으로", desc:"새로운 아우라 분석 시작하기" }];

  return (
    <div style={{ background:"#020209", minHeight:"100vh", fontFamily:"'Apple SD Gothic Neo',system-ui,sans-serif", color:"#e2e8f0" }}>

      {/* 헤더 */}
      <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(2,2,9,0.97)", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", color:"#9ca3af", fontSize:18 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, letterSpacing:4, color:`rgba(${ar},${ag},${ab},0.7)` }}>AURA DEEP REPORT</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>융합 아우라 심층 분석</div>
        </div>
        <button onClick={()=>setShowShare(true)}
          style={{ padding:"8px 16px", background:`rgba(${ar},${ag},${ab},0.15)`, border:`1px solid rgba(${ar},${ag},${ab},0.4)`, borderRadius:20, color:`rgb(${ar},${ag},${ab})`, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
          ↗ 공유
        </button>
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
                <div style={{ fontSize:11, color:"#6b7280", letterSpacing:1, marginBottom:8 }}>{p.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:`rgb(${ar},${ag},${ab})` }}>{p.gan}</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#c4b5fd", marginTop:4 }}>{p.ji}</div>
                <div style={{ fontSize:12, color:"#4b5563", marginTop:6 }}>{p.sub}</div>
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
                <span style={{ fontSize:14, width:56, flexShrink:0, color:"#e2e8f0", fontWeight:600 }}>{o.name}</span>
                <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                  <motion.div initial={{width:0}} animate={{width:`${o.pct}%`}} transition={{delay:i*0.1,duration:0.9}} style={{ height:"100%", borderRadius:4, background:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }} />
                </div>
                <span style={{ fontSize:14, width:38, textAlign:"right", color:"#9ca3af", fontWeight:700, flexShrink:0 }}>{o.pct}%</span>
                {i===0 && <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:`rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.15)`, border:`0.5px solid rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.4)`, color:`rgb(${o.color[0]},${o.color[1]},${o.color[2]})` }}>주도</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)", fontSize:14, color:"#9ca3af", lineHeight:1.7 }}>
            <span style={{ color:`rgb(${ar},${ag},${ab})`, fontWeight:700 }}>{dominant.name}</span> 기운이 가장 강한 당신 — {dominant.trait}
          </div>
        </Section>

        <Divider />

        {/* 타로 융합 */}
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
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:700,
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

        {/* 분야별 운세 */}
        <Section title="분야별 운세" color={[ar,ag,ab]}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"💜", label:"연애 · 관계", ...domainFortune.love },
              { icon:"⚡", label:"직업 · 커리어", ...domainFortune.work },
              { icon:"🌊", label:"재물 · 건강", ...domainFortune.money },
            ].map((f,i)=>(
              <div key={i} style={{ borderRadius:11, padding:"16px 15px", background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{f.icon}</div>
                <div style={{ fontSize:12, letterSpacing:2, color:"#6b7280", marginBottom:5 }}>{f.label}</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#e2e8f0", marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:14, color:"#9ca3af", lineHeight:1.6, marginBottom:8 }}>{f.desc}</div>
                <div style={{ display:"flex", gap:3 }}>
                  {[1,2,3,4,5].map(s=><div key={s} style={{ width:8, height:8, borderRadius:"50%", background:s<=f.score?`rgb(${ar},${ag},${ab})`:"rgba(255,255,255,0.1)" }} />)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 월별 운세 */}
        <Section title="2026 하반기 월별 운세" color={[ar,ag,ab]}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
            {monthlyFortune.map((mo,i)=>(
              <div key={i} style={{ borderRadius:8, padding:"10px 4px", textAlign:"center", background:mo.peak?`rgba(${ar},${ag},${ab},0.09)`:"rgba(255,255,255,0.03)", border:`0.5px solid ${mo.peak?`rgba(${ar},${ag},${ab},0.4)`:"rgba(255,255,255,0.07)"}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:mo.peak?`rgb(${ar},${ag},${ab})`:"#9ca3af", marginBottom:5 }}>{mo.m}</div>
                <div style={{ fontSize:12, color:`rgb(${ar},${ag},${ab})` }}>{"★".repeat(mo.stars)}{"☆".repeat(5-mo.stars)}</div>
                <div style={{ fontSize:11, fontWeight:600, color:mo.peak?"#c4b5fd":"#6b7280", marginTop:4 }}>{mo.key}</div>
              </div>
            ))}
          </div>
          {monthlyFortune.filter(m=>m.peak).length > 0 && (
            <div style={{ marginTop:12, padding:"12px 14px", borderRadius:10, background:`rgba(${ar},${ag},${ab},0.06)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.2)`, fontSize:14, fontWeight:700, color:`rgba(${ar},${ag},${ab},1)` }}>
              ★ <span style={{ fontWeight:700 }}>{monthlyFortune.find(m=>m.peak)?.m}</span>이 2026년 하반기 최대 전환점입니다.
            </div>
          )}
        </Section>

        <Divider />

        {/* ── 아우라 부적 (Canvas 크게) ── */}
        <Section title="나의 아우라 부적" color={[ar,ag,ab]}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20,
            background:`rgba(${ar},${ag},${ab},0.05)`, border:`1px solid rgba(${ar},${ag},${ab},0.16)`,
            borderRadius:16, padding:"28px 22px" }}>

            {/* 캔버스 부적 — 크게 */}
            <motion.div animate={{ rotate:[0,1,-1,0] }} transition={{ duration:6, repeat:Infinity }}>
              <AmuletCanvas dominant={dominant} zodiacAnimal={zodiacAnimal} color={auraType.color||[ar,ag,ab]} />
            </motion.div>

            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:12, letterSpacing:4, color:`rgba(${ar},${ag},${ab},0.8)`, fontWeight:700, marginBottom:6 }}>AURA TALISMAN</div>
              <div style={{ fontSize:20, fontWeight:900, color:"#f1f5f9", marginBottom:6 }}>{dominant.name} · {zodiacAnimal}의 부적</div>
              <div style={{ fontSize:14, color:"#6b7280", lineHeight:1.6, marginBottom:16 }}>
                당신의 오행·타로를 기반으로 생성된<br />고화질 맞춤 아우라 부적
              </div>
              {/* 공유 버튼 3종 */}
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={handlePrint}
                  style={{ padding:"10px 18px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, color:"#d1d5db", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  🖨️ 출력
                </button>
                <button onClick={()=>setShowShare(true)}
                  style={{ padding:"10px 18px", background:`rgba(${ar},${ag},${ab},0.15)`, border:`1px solid rgba(${ar},${ag},${ab},0.4)`, borderRadius:20, color:`rgb(${ar},${ag},${ab})`, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  ↗ 공유
                </button>
                <button onClick={handleEmail}
                  style={{ padding:"10px 18px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, color:"#d1d5db", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  📧 이메일
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── 다음 탐험 유도 카드 ── */}
        <Section title="더 탐구하기" color={[ar,ag,ab]}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {nextSuggestions.map((s,i)=>(
              <motion.div key={i} whileHover={{x:4}} whileTap={{scale:0.98}}
                onClick={()=>onRestart(s.type)}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px",
                  background: s.type==="home"?"rgba(255,255,255,0.03)":`rgba(${ar},${ag},${ab},0.07)`,
                  border: s.type==="home"?"0.5px solid rgba(255,255,255,0.08)":`1px solid rgba(${ar},${ag},${ab},0.25)`,
                  borderRadius:14, cursor:"pointer" }}>
                <div style={{ width:46, height:46, borderRadius:12, flexShrink:0,
                  background: s.type==="home"?"rgba(255,255,255,0.06)":`rgba(${ar},${ag},${ab},0.15)`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                  {s.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#f1f5f9", marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:13, color:"#6b7280" }}>{s.desc}</div>
                </div>
                <div style={{ fontSize:18, color:`rgba(${ar},${ag},${ab},0.5)` }}>›</div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* 푸터 */}
        <div style={{ margin:"22px 22px 0", padding:"13px 16px", borderRadius:10, background:"rgba(255,255,255,0.02)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#374151" }}>AURA © 2026 · 융합 분석 v2.6<br />{birthDate}생 맞춤 분석</span>
          <button onClick={()=>setShowShare(true)}
            style={{ padding:"7px 16px", background:`rgba(${ar},${ag},${ab},0.14)`, border:`0.5px solid rgba(${ar},${ag},${ab},0.3)`, borderRadius:20, color:`rgb(${ar},${ag},${ab})`, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
            ↗ 공유하기
          </button>
        </div>
      </div>

      {/* 공유 모달 */}
      <AnimatePresence>
        {showShare && (
          <ShareModal onClose={()=>setShowShare(false)} color={auraType.color||[ar,ag,ab]}
            birthDate={birthDate} auraType={auraType} />
        )}
      </AnimatePresence>
    </div>
  );

  function handlePrint(){ window.print(); }
  function handleEmail(){
    const text=`✦ AURA 운명 분석 결과\n${birthDate}생 · ${auraType?.type}\n\naura.app에서 나의 아우라를 확인해보세요`;
    window.location.href=`mailto:?subject=나의 AURA 운명 분석 결과&body=${encodeURIComponent(text)}`;
  }
}

function Section({title,children,color}){
  const [r,g,b]=color||[139,92,246];
  return (
    <div style={{padding:"26px 22px 0"}}>
      <div style={{ fontSize:15, fontWeight:800, color:"#e2e8f0", display:"flex", alignItems:"center", gap:12, marginBottom:18, letterSpacing:0.5 }}>
        <span style={{ display:"inline-block", width:4, height:18, borderRadius:4, background:`rgb(${r},${g},${b})`, flexShrink:0, boxShadow:`0 0 8px rgba(${r},${g},${b},0.6)` }} />
        {title}
        <div style={{flex:1,height:0.5,background:`rgba(${r},${g},${b},0.2)`}} />
      </div>
      {children}
    </div>
  );
}
function Divider(){return <div style={{height:0.5,background:"rgba(255,255,255,0.05)",margin:"26px 22px 0"}} />;}
