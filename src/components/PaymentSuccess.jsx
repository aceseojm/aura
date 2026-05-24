import { motion } from "framer-motion";

export default function PaymentSuccess({ onOpenReport }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#020209",
      fontFamily: "'Apple SD Gothic Neo', system-ui, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "52px 24px", textAlign: "center",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 300,
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 16 }}
        style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(139,92,246,0.12)", border: "1.5px solid rgba(139,92,246,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, marginBottom: 20
        }}
      >✦</motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ fontSize: 10, letterSpacing: 4, color: "rgba(139,92,246,0.8)", marginBottom: 10 }}>
        PAYMENT COMPLETE
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>
        결제가 완료되었습니다
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ fontSize: 12, color: "#6b7280" }}>
        아우라 심층 리포트가 언락되었습니다
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{
          margin: "28px 0", width: "100%", maxWidth: 340,
          background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.22)",
          borderRadius: 14, padding: 20
        }}
      >
        {[
          ["결제 수단", "💛 카카오페이"],
          ["주문 번호", "AURA-20260512-8841"],
          ["상품", "심층 운명 리포트 + 아우라 부적"],
          ["결제 일시", "2026.05.12 오후 11:24"],
          ["상태", "✓ 승인 완료"],
        ].map(([k, v], i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: i < 4 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
            fontSize: 12
          }}>
            <span style={{ color: "#6b7280" }}>{k}</span>
            <span style={{ color: k === "주문 번호" ? "#a78bfa" : k === "상태" ? "#34d399" : "#d1d5db", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(139,92,246,0.25)"
        }}>
          <span style={{ color: "#9ca3af", fontWeight: 600, fontSize: 14 }}>결제 금액</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#a78bfa" }}>₩9,900</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpenReport}
        style={{
          width: "100%", maxWidth: 340, padding: "15px 0",
          background: "linear-gradient(90deg, #7c3aed, #9333ea)",
          border: "none", borderRadius: 12, color: "#fff",
          fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: 1
        }}
      >
        ✦ 나의 아우라 리포트 열기
      </motion.button>
    </div>
  );
}
