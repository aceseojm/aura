import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, X } from "lucide-react";

const OHANG_DATA = [
  { label: "수(水)", pct: 72, color: "#3b82f6", tag: "주도" },
  { label: "목(木)", pct: 51, color: "#22c55e" },
  { label: "금(金)", pct: 38, color: "#9ca3af" },
  { label: "화(火)", pct: 24, color: "#ef4444", tag: "보충 필요" },
  { label: "토(土)", pct: 15, color: "#f59e0b" },
];

const MONTHS = [
  { m: "7월", stars: 3, key: "준비기" },
  { m: "8월", stars: 5, key: "대전환", peak: true },
  { m: "9월", stars: 4, key: "수확기" },
  { m: "10월", stars: 3, key: "안정기" },
  { m: "11월", stars: 4, key: "재도약" },
  { m: "12월", stars: 3, key: "마무리" },
];

/* 결제 모달 */
function PaywallModal({ guardianColor, onClose, onPaid }) {
  const [r, g, b] = guardianColor;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }} transition={{ type: "spring", damping: 22 }}
        style={{
          background: "linear-gradient(145deg, #0a0a1a, #0f0f2a)",
          border: `1px solid rgba(${r},${g},${b},0.4)`,
          borderRadius: 20, padding: "32px 24px", maxWidth: 380, width: "100%",
          position: "relative", boxShadow: `0 0 60px rgba(${r},${g},${b},0.18)`,
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.08)", border: "none",
          borderRadius: 8, width: 32, height: 32, cursor: "pointer",
          color: "#9ca3af", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
        }}><X size={16} /></button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 44, display: "block" }}>✦</motion.div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 8, letterSpacing: 1 }}>
            심층 운명 리포트
          </div>
          <div style={{ fontSize: 11, color: `rgba(${r},${g},${b},0.9)`, marginTop: 4, letterSpacing: 2 }}>
            AURA DEEP ANALYSIS
          </div>
        </div>

        {[
          "고화질 아우라 부적 이미지 (A4 인쇄용)",
          "30페이지 사주 + 타로 융합 리포트 PDF",
          "2026년 월별 운세 캘린더 전체 공개",
          "AI 수호신과 1:1 심층 대화 (무제한)",
          "아우라 변화 추적 앱 3개월 이용권",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: `rgba(${r},${g},${b},0.2)`,
              border: `1px solid rgba(${r},${g},${b},0.5)`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: `rgb(${r},${g},${b})` }} />
            </div>
            <span style={{ fontSize: 13, color: "#d1d5db" }}>{item}</span>
          </div>
        ))}

        <div style={{
          background: `rgba(${r},${g},${b},0.08)`,
          border: `1px solid rgba(${r},${g},${b},0.2)`,
          borderRadius: 12, padding: "14px 16px", margin: "16px 0", textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#6b7280", textDecoration: "line-through", marginBottom: 2 }}>정가 ₩49,000</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>
            ₩<span style={{ color: `rgb(${r},${g},${b})` }}>9,900</span>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>첫 분석 한정 특가 · 오늘만</div>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={onPaid} style={{
          width: "100%", padding: "15px 0", background: "#FEE500",
          border: "none", borderRadius: 12, color: "#000", fontWeight: 800,
          fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, marginBottom: 10, fontFamily: "inherit"
        }}>💛 카카오페이로 결제</motion.button>

        <motion.button whileTap={{ scale: 0.98 }} onClick={onPaid} style={{
          width: "100%", padding: "15px 0", background: "#0064FF",
          border: "none", borderRadius: 12, color: "#fff", fontWeight: 800,
          fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, fontFamily: "inherit"
        }}>💙 토스로 간편결제</motion.button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
          <Lock size={12} style={{ color: "#4b5563" }} />
          <span style={{ fontSize: 11, color: "#4b5563" }}>256bit SSL 암호화 · 언제든 환불 가능</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* 메인 미리보기 컴포넌트 */
export default function ResultPreview({ drawnCard, birthDate, chatType, guardianColor, onPaid }) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [r, g, b] = guardianColor || [139, 92, 246];

  const auraType = chatType === "saju" ? "토(土)·금(金) 혼합형" : chatType === "tarot" ? "수(水)·달 공명형" : "보라·수(水) 혼합형";
  const auraDesc = chatType === "saju" ? "안정과 결단의 에너지를 품은 영혼" : chatType === "tarot" ? "직관이 운명을 이끄는 달의 영혼" : "직관과 창조의 경계를 걷는 심연의 영혼";

  return (
    <div style={{
      background: "#020209", minHeight: "100vh",
      fontFamily: "'Apple SD Gothic Neo', system-ui, sans-serif", color: "#e2e8f0",
      position: "relative",
    }}>
      {/* 헤더 */}
      <div style={{
        padding: "18px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(2,2,9,0.97)", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 5, color: `rgba(${r},${g},${b},0.7)` }}>A U R A</span>
        <span style={{ fontSize: 12, color: "#4b5563", flex: 1 }}>운명 분석 결과</span>
        <span style={{
          background: `rgba(${r},${g},${b},0.15)`, border: `1px solid rgba(${r},${g},${b},0.35)`,
          borderRadius: 20, padding: "3px 11px", fontSize: 9, color: `rgba(${r},${g},${b},1)`,
          fontWeight: 700, letterSpacing: 2,
        }}>PREVIEW</span>
      </div>

      <div style={{ padding: "0 0 140px" }}>

        {/* ── 커버: 공개 ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "28px 22px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "relative", overflow: "hidden",
          }}>
          <div style={{
            position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
            width: 300, height: 180,
            background: `radial-gradient(ellipse, rgba(${r},${g},${b},0.2) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
            <motion.div
              animate={{ boxShadow: [`0 0 0 0 rgba(${r},${g},${b},0)`, `0 0 0 14px rgba(${r},${g},${b},0.07)`, `0 0 0 0 rgba(${r},${g},${b},0)`] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: 84, height: 84, borderRadius: "50%", flexShrink: 0,
                background: `radial-gradient(circle at 33% 33%, rgba(196,181,253,0.85) 0%, rgba(${r},${g},${b},0.65) 40%, rgba(76,29,149,0.4) 100%)`,
                border: `1px solid rgba(${r},${g},${b},0.6)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
              }}>✦</motion.div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: `rgba(${r},${g},${b},0.6)`, marginBottom: 7 }}>YOUR AURA TYPE</div>
              <div style={{ fontSize: 19, fontWeight: 900, color: "#c4b5fd", lineHeight: 1.2, marginBottom: 6 }}>{auraType}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>{auraDesc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { text: "수(水) 72%", c: `rgba(${r},${g},${b},0.15)`, bc: `rgba(${r},${g},${b},0.4)`, tc: `rgb(${r},${g},${b})` },
                  drawnCard && { text: `${drawnCard.korean} · ${drawnCard.name}`, c: "rgba(59,130,246,0.12)", bc: "rgba(59,130,246,0.35)", tc: "#93c5fd" },
                  { text: chatType === "fusion" ? "융합 분석" : chatType === "tarot" ? "타로 분석" : "사주 분석", c: "rgba(236,72,153,0.12)", bc: "rgba(236,72,153,0.35)", tc: "#f9a8d4" },
                ].filter(Boolean).map((t, i) => (
                  <span key={i} style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                    background: t.c, border: `0.5px solid ${t.bc}`, color: t.tc,
                  }}>{t.text}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 핵심 메시지: 공개 ── */}
        <Section title="핵심 메시지" color={[r, g, b]}>
          <div style={{
            background: `rgba(${r},${g},${b},0.07)`,
            borderLeft: `3px solid rgba(${r},${g},${b},0.6)`,
            borderRadius: "0 12px 12px 0", padding: "18px 20px",
            fontSize: 13, color: "#d1d5db", lineHeight: 1.95,
          }}>
            당신은 <Hl c={[r,g,b]}>깊은 물처럼 고요하되 강력한 힘</Hl>을 품고 있습니다. 오랫동안 스스로를 작게 여겨왔지만, 우주는 당신이 그 그릇보다 훨씬 크다는 것을 알고 있습니다.<br /><br />
            2026년 <Hl c={[r,g,b]}>8월을 기점</Hl>으로 당신의 잠재된 에너지가 표면으로 올라오기 시작합니다. 지금 당장의 불확실함은 그 전조일 뿐, 두려워하지 마세요.
          </div>
        </Section>

        <Divider />

        {/* ── 오행 분포: 공개 ── */}
        <Section title="오행 에너지 분포" color={[r, g, b]}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {OHANG_DATA.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, width: 46, flexShrink: 0, color: "#9ca3af" }}>{o.label}</span>
                <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${o.pct}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    style={{ height: "100%", borderRadius: 3, background: o.color }}
                  />
                </div>
                <span style={{ fontSize: 10, width: 30, textAlign: "right", color: "#6b7280", flexShrink: 0 }}>{o.pct}%</span>
                {o.tag && (
                  <span style={{
                    fontSize: 9, padding: "2px 7px", borderRadius: 20,
                    background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.15)",
                    color: "#9ca3af",
                  }}>{o.tag}</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── 분야별 운세: 부분 공개 (1개만, 나머지 블러) ── */}
        <Section title="분야별 운세" color={[r, g, b]}>
          {/* 연애만 공개 */}
          <div style={{
            borderRadius: 11, padding: "15px 14px", marginBottom: 10,
            background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>💜</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: "#6b7280", marginBottom: 5 }}>연애 · 관계</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>감춰진 인연의 실</div>
            <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>지금 곁에 있는 사람을 다시 보세요. 새로운 만남보다 깊어질 관계가 더 중요한 시기입니다.</div>
            <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
              {[1,2,3,4,5].map(s => <div key={s} style={{ width: 7, height: 7, borderRadius: "50%", background: s <= 4 ? `rgb(${r},${g},${b})` : "rgba(255,255,255,0.1)" }} />)}
            </div>
          </div>

          {/* 커리어·재물 — 블러 잠금 */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
              {[
                { icon: "⚡", label: "직업 · 커리어", title: "전환점의 전야", score: 5 },
                { icon: "🌊", label: "재물 · 건강", title: "흐름을 타면 따라옵니다", score: 3 },
              ].map((f, i) => (
                <div key={i} style={{ borderRadius: 11, padding: "15px 14px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#6b7280", marginBottom: 5 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>상세 내용은 심층 리포트에서 확인하세요.</div>
                  <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                    {[1,2,3,4,5].map(s => <div key={s} style={{ width: 7, height: 7, borderRadius: "50%", background: s <= f.score ? `rgb(${r},${g},${b})` : "rgba(255,255,255,0.1)" }} />)}
                  </div>
                </div>
              ))}
            </div>
            {/* 잠금 오버레이 */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(2,2,9,0.5)", borderRadius: 11,
            }}>
              <Lock size={20} style={{ color: `rgba(${r},${g},${b},0.8)` }} />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>심층 리포트에서 전체 공개</span>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── 타로 결과: 공개 ── */}
        {drawnCard && (
          <>
            <Section title="타로 · 융합 인사이트" color={[r, g, b]}>
              <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                <div style={{
                  flexShrink: 0, width: 70, height: 112, borderRadius: 9,
                  background: "linear-gradient(145deg, #0f172a, #1e1b4b)",
                  border: `1px solid rgba(${r},${g},${b},0.7)`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 5, padding: 8,
                }}>
                  <div style={{ fontSize: 24 }}>☽</div>
                  <div style={{ fontSize: 7.5, color: "#c4b5fd", textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>{drawnCard.name}</div>
                  <div style={{ fontSize: 7, color: "#7c3aed" }}>{drawnCard.korean}</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#c4b5fd", marginBottom: 5 }}>{drawnCard.name} — {drawnCard.korean}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.7, marginBottom: 8 }}>{drawnCard.meaning}</div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                    background: "rgba(52,211,153,0.12)", border: "0.5px solid rgba(52,211,153,0.35)", color: "#6ee7b7",
                  }}>✓ 수(水) 기운과 공명</span>
                </div>
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* ── 월별 운세: 3개만 공개, 나머지 블러 ── */}
        <Section title="2026 하반기 월별 운세" color={[r, g, b]}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
            {MONTHS.map((mo, i) => (
              <div key={i} style={{
                borderRadius: 8, padding: "9px 4px", textAlign: "center",
                background: mo.peak ? `rgba(${r},${g},${b},0.09)` : "rgba(255,255,255,0.03)",
                border: `0.5px solid ${mo.peak ? `rgba(${r},${g},${b},0.4)` : "rgba(255,255,255,0.07)"}`,
                ...(i >= 3 ? { filter: "blur(4px)", userSelect: "none" } : {}),
                position: "relative",
              }}>
                <div style={{ fontSize: 10, color: mo.peak ? `rgb(${r},${g},${b})` : "#6b7280", marginBottom: 5 }}>{mo.m}</div>
                <div style={{ fontSize: 9, color: `rgb(${r},${g},${b})`, letterSpacing: -1 }}>{"★".repeat(mo.stars)}{"☆".repeat(5 - mo.stars)}</div>
                <div style={{ fontSize: 8, color: mo.peak ? "#7c6fb5" : "#4b5563", marginTop: 4 }}>{mo.key}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#4b5563" }}>
            <Lock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            10월~12월 운세는 심층 리포트에서 공개됩니다
          </div>
        </Section>

        <Divider />

        {/* ── 부적: 블러 잠금 ── */}
        <Section title="나의 아우라 부적" color={[r, g, b]}>
          <div style={{ position: "relative" }}>
            <div style={{
              display: "flex", gap: 14, alignItems: "center",
              background: `rgba(${r},${g},${b},0.05)`, border: `1px solid rgba(${r},${g},${b},0.16)`,
              borderRadius: 12, padding: "16px 18px",
              filter: "blur(5px)", userSelect: "none", pointerEvents: "none",
            }}>
              <div style={{
                width: 70, height: 70, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #1e1b4b, #4c1d95, #1e1b4b)",
                border: `1px solid rgba(${r},${g},${b},0.5)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>🔮</div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: `rgba(${r},${g},${b},0.6)`, marginBottom: 4 }}>AURA TALISMAN</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>수(水) · 달의 부적</div>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>고화질 A4 인쇄용 맞춤 부적</div>
              </div>
            </div>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Lock size={20} style={{ color: `rgba(${r},${g},${b},0.8)` }} />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>결제 후 즉시 다운로드</span>
            </div>
          </div>
        </Section>

      </div>

      {/* ── 하단 고정 결제 CTA ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        padding: "16px 20px 24px",
        background: "linear-gradient(to top, #020209 60%, transparent)",
      }}>
        <div style={{
          background: `rgba(${r},${g},${b},0.08)`,
          border: `1px solid rgba(${r},${g},${b},0.2)`,
          borderRadius: 14, padding: "12px 16px", marginBottom: 12, textAlign: "center",
        }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            <Lock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            분야별 운세·월별 캘린더·아우라 부적이 잠겨 있습니다
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowPaywall(true)}
          style={{
            width: "100%", padding: "16px 0",
            background: `linear-gradient(90deg, rgb(${r},${g},${b}), rgba(${r},${g},${b},0.75))`,
            border: "none", borderRadius: 14, color: "#fff",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "inherit", letterSpacing: 1,
          }}
        >
          <Sparkles size={16} /> 전체 결과 열기 · ₩9,900
        </motion.button>
      </div>

      {/* 페이월 모달 */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallModal
            guardianColor={guardianColor || [139, 92, 246]}
            onClose={() => setShowPaywall(false)}
            onPaid={onPaid}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children, color }) {
  const [r, g, b] = color || [139, 92, 246];
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
function Hl({ children, c }) {
  const [r, g, b] = c || [196, 181, 253];
  return <span style={{ color: `rgb(${r},${g},${b})`, fontWeight: 700 }}>{children}</span>;
}
