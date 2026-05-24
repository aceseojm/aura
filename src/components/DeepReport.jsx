import { motion } from "framer-motion";

const OHANG = [
  { label: "수(水)", pct: 72, color: "#3b82f6", tag: "주도", tagColor: "rgba(59,130,246,0.15)", tagBorder: "rgba(59,130,246,0.4)", tagText: "#93c5fd" },
  { label: "목(木)", pct: 51, color: "#22c55e" },
  { label: "금(金)", pct: 38, color: "#9ca3af" },
  { label: "화(火)", pct: 24, color: "#ef4444", tag: "보충 필요", tagColor: "rgba(239,68,68,0.1)", tagBorder: "rgba(239,68,68,0.3)", tagText: "#fca5a5" },
  { label: "토(土)", pct: 15, color: "#f59e0b" },
];

const FORTUNES = [
  { icon: "💜", label: "연애 · 관계", title: "감춰진 인연의 실", desc: "지금 곁에 있는 사람을 다시 보세요. 새로운 만남보다 깊어질 관계가 더 중요한 시기입니다.", score: 4 },
  { icon: "⚡", label: "직업 · 커리어", title: "전환점의 전야", desc: "당신의 능력은 아직 충분히 보이지 않았습니다. 8월 이후 기회가 옵니다.", score: 5 },
  { icon: "🌊", label: "재물 · 건강", title: "흐름을 타면 자연히 따라옵니다", desc: "무리한 투자나 지출은 금물. 수(水) 기운이 강한 올해는 천천히 쌓아가는 전략이 최선입니다.", score: 3, wide: true },
];

const MONTHS = [
  { m: "7월", stars: 3, key: "준비기" },
  { m: "8월", stars: 5, key: "대전환", peak: true },
  { m: "9월", stars: 4, key: "수확기" },
  { m: "10월", stars: 3, key: "안정기" },
  { m: "11월", stars: 4, key: "재도약" },
  { m: "12월", stars: 3, key: "마무리" },
];

export default function DeepReport({ onBack }) {
  return (
    <div style={{ background: "#020209", fontFamily: "'Apple SD Gothic Neo', system-ui, sans-serif", color: "#e2e8f0", minHeight: "100vh" }}>
      {/* 헤더 */}
      <div style={{
        padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(2,2,9,0.97)", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 10
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8,
          width: 30, height: 30, cursor: "pointer", color: "#9ca3af", fontSize: 16
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(139,92,246,0.7)" }}>AURA DEEP REPORT</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>융합 아우라 분석 결과</div>
        </div>
        <div style={{
          background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)",
          borderRadius: 20, padding: "3px 11px", fontSize: 9, color: "#a78bfa", fontWeight: 700, letterSpacing: 2
        }}>PREMIUM</div>
      </div>

      <div style={{ padding: "0 0 24px" }}>
        {/* 커버 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "28px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
            width: 320, height: 200,
            background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "radial-gradient(circle at 33% 33%, rgba(196,181,253,0.85) 0%, rgba(139,92,246,0.65) 40%, rgba(76,29,149,0.4) 100%)",
                border: "1px solid rgba(139,92,246,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
              }}>✦</div>
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(139,92,246,0.6)", marginBottom: 7 }}>YOUR AURA TYPE</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#c4b5fd", lineHeight: 1.2, marginBottom: 5 }}>보라·수(水)<br />혼합형 아우라</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>직관과 창조의 경계를<br />걷는 심연의 영혼</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { text: "수(水) 72%", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", color: "#a78bfa" },
                  { text: "달 · The Moon", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)", color: "#93c5fd" },
                  { text: "융합 분석", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.35)", color: "#f9a8d4" },
                ].map((t, i) => (
                  <span key={i} style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                    background: t.bg, border: `0.5px solid ${t.border}`, color: t.color
                  }}>{t.text}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 핵심 메시지 */}
        <Section title="핵심 메시지">
          <div style={{
            background: "rgba(139,92,246,0.07)", borderLeft: "3px solid rgba(139,92,246,0.6)",
            borderRadius: "0 12px 12px 0", padding: "18px 20px",
            fontSize: 13, color: "#d1d5db", lineHeight: 1.95
          }}>
            당신은 <Hl>깊은 물처럼 고요하되 강력한 힘</Hl>을 품고 있습니다. 오랫동안 스스로를 작게 여겨왔지만, 우주는 당신이 그 그릇보다 훨씬 크다는 것을 알고 있습니다.<br /><br />
            2026년 <Hl>8월을 기점</Hl>으로 당신의 잠재된 에너지가 표면으로 올라오기 시작합니다. 지금 당장의 불확실함은 그 전조일 뿐, 두려워하지 마세요. <Hl>달(The Moon)이 당신 편</Hl>입니다.
          </div>
        </Section>

        <Divider />

        {/* 분야별 운세 */}
        <Section title="분야별 운세">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FORTUNES.map((f, i) => (
              <div key={i} style={{
                gridColumn: f.wide ? "1 / -1" : undefined,
                borderRadius: 11, padding: "15px 14px",
                background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)"
              }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#6b7280", marginBottom: 5 }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>{f.desc}</div>
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                  {[1,2,3,4,5].map(s => (
                    <div key={s} style={{ width: 7, height: 7, borderRadius: "50%", background: s <= f.score ? "#a78bfa" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 오행 분포 */}
        <Section title="오행 에너지 분포">
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {OHANG.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, width: 46, flexShrink: 0, color: "#9ca3af" }}>{o.label}</span>
                <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${o.pct}%`, height: "100%", borderRadius: 3, background: o.color }} />
                </div>
                <span style={{ fontSize: 10, width: 30, textAlign: "right", color: "#6b7280", flexShrink: 0 }}>{o.pct}%</span>
                {o.tag && (
                  <span style={{
                    fontSize: 9, padding: "2px 7px", borderRadius: 20, marginLeft: 4,
                    background: o.tagColor, border: `0.5px solid ${o.tagBorder}`, color: o.tagText
                  }}>{o.tag}</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 타로 + 융합 */}
        <Section title="타로 · 융합 인사이트">
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{
              flexShrink: 0, width: 70, height: 112, borderRadius: 9,
              background: "linear-gradient(145deg, #0f172a, #1e1b4b)",
              border: "1px solid rgba(139,92,246,0.7)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: 8
            }}>
              <div style={{ fontSize: 24 }}>☽</div>
              <div style={{ fontSize: 7.5, color: "#c4b5fd", textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>The Moon</div>
              <div style={{ fontSize: 7, color: "#7c3aed" }}>달 · 수(水)</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#c4b5fd", marginBottom: 5 }}>The Moon — 달</div>
              <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.7, marginBottom: 8 }}>직관과 잠재의식의 문이 열립니다. 보이지 않는 진실이 수면 위로 떠오르고 있습니다.</div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                background: "rgba(52,211,153,0.12)", border: "0.5px solid rgba(52,211,153,0.35)", color: "#6ee7b7"
              }}>✓ 수(水) 기운과 완벽 공명</span>
            </div>
          </div>
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.18)",
            fontSize: 11, color: "#d1d5db", lineHeight: 1.85
          }}>
            당신의 강한 <Hl2>수(水) 에너지</Hl2>가 <Hl2>달(The Moon) 카드</Hl2>와 완벽하게 공명합니다. 2026년 하반기, 오랫동안 억눌렸던 창조의 에너지가 분출될 전조입니다. 목(木)의 성장 기운이 이를 뒷받침하며 <Hl2>8월이 가장 강력한 전환점</Hl2>. 단, 화(火)가 약한 지금은 성급한 결정보다 내면의 목소리를 따르세요.
          </div>
        </Section>

        <Divider />

        {/* 월별 캘린더 */}
        <Section title="2026 하반기 월별 운세">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
            {MONTHS.map((mo, i) => (
              <div key={i} style={{
                borderRadius: 8, padding: "9px 4px", textAlign: "center",
                background: mo.peak ? "rgba(139,92,246,0.09)" : "rgba(255,255,255,0.03)",
                border: `0.5px solid ${mo.peak ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.07)"}`
              }}>
                <div style={{ fontSize: 10, color: mo.peak ? "#a78bfa" : "#6b7280", marginBottom: 5 }}>{mo.m}</div>
                <div style={{ fontSize: 9, color: "#a78bfa", letterSpacing: -1 }}>{"★".repeat(mo.stars)}{"☆".repeat(5-mo.stars)}</div>
                <div style={{ fontSize: 8, color: mo.peak ? "#7c6fb5" : "#4b5563", marginTop: 4 }}>{mo.key}</div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* 부적 */}
        <Section title="나의 아우라 부적">
          <div style={{
            display: "flex", gap: 14, alignItems: "center",
            background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.16)",
            borderRadius: 12, padding: "16px 18px"
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, #1e1b4b, #4c1d95, #1e1b4b)",
              border: "1px solid rgba(139,92,246,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
            }}>🔮</div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(139,92,246,0.6)", marginBottom: 4 }}>AURA TALISMAN</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>수(水) · 달의 부적</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, marginBottom: 9 }}>당신의 오행·타로를 기반으로 생성된<br />고화질 A4 인쇄용 맞춤 부적</div>
              <button style={{
                padding: "6px 14px", background: "rgba(139,92,246,0.18)",
                border: "1px solid rgba(139,92,246,0.4)", borderRadius: 20,
                color: "#a78bfa", fontSize: 10, fontWeight: 700, cursor: "pointer"
              }}>↓ PNG 다운로드</button>
            </div>
          </div>
        </Section>

        {/* 푸터 */}
        <div style={{
          margin: "22px 22px 0", padding: "13px 16px", borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontSize: 10, color: "#374151" }}>AURA © 2026 · 융합 분석 v2.6<br />AURA-20260512-8841</span>
          <button style={{
            padding: "6px 14px", background: "rgba(139,92,246,0.14)",
            border: "0.5px solid rgba(139,92,246,0.3)", borderRadius: 20,
            color: "#a78bfa", fontSize: 10, cursor: "pointer"
          }}>↗ 결과 공유하기</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: "22px 22px 0" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: "#4b5563", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {title}
        <div style={{ flex: 1, height: 0.5, background: "rgba(255,255,255,0.07)" }} />
      </div>
      {children}
    </div>
  );
}
function Divider() { return <div style={{ height: 0.5, background: "rgba(255,255,255,0.05)", margin: "22px 22px 0" }} />; }
function Hl({ children }) { return <span style={{ color: "#c4b5fd", fontWeight: 700 }}>{children}</span>; }
function Hl2({ children }) { return <span style={{ color: "#f9a8d4", fontWeight: 700 }}>{children}</span>; }
