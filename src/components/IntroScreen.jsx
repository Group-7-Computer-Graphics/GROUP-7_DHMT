"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const SITE_NAME = "Solar System"

const MAIN_TITLE = "SOLAR SYSTEM\nEDUCATION"

const SUBTITLE = "AN INTERACTIVE 3D JOURNEY THROUGH THE COSMOS"

const CTA_TEXT = "EXPLORE THE UNIVERSE"
const TEAM_MEMBERS = [
  { name: "Nguyễn Hồng Đăng", github: "https://github.com/" },
  { name: "Phạm Thanh Vân", github: "https://github.com/" },
  { name: "Trần Thùy Trang", github: "https://github.com/" },
  { name: "Nguyễn Anh Đức", github: "https://github.com/" },
  { name: "Nguyễn Phương Anh", github: "https://github.com/" }
]

const GITHUB_REPO_URL = "https://github.com/"

const IntroScreen = ({ onEnter }) => {
  // State để kiểm soát hiệu ứng mờ dần khi bấm nút
  const [isExiting, setIsExiting] = useState(false)

  // Khi bấm nút, chạy animation mờ dần rồi gọi onEnter()
  const handleEnter = () => {
    setIsExiting(true)
    // Đợi animation kết thúc (1.5 giây) rồi chuyển sang 3D
    setTimeout(() => {
      onEnter()
    }, 1500)
  }

  return (
    <motion.div
      // Toàn bộ màn hình intro mờ dần khi isExiting = true
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={styles.wrapper}
    >
      {/* ── Lớp nền: ảnh sao + gradient ──────────────────── */}
      <div style={styles.background} />
      <div style={styles.backgroundGradient} />

      {/* ── Các hạt sao nhấp nháy bằng CSS animation ─────── */}
      <StarField />

      {/* ── TASKBAR (thanh trên cùng) ─────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={styles.taskbar}
      >
        {/* Góc trái: Tên trang */}
        <div style={styles.taskbarLeft}>
          <span style={styles.taskbarLogo}>⬡</span>
          <span style={styles.taskbarSiteName}>{SITE_NAME}</span>
        </div>

        {/* Góc phải: Nút thành viên + Nút GitHub */}
        <div style={styles.taskbarRight}>
          {/* Nút dropdown tên thành viên */}
          <MembersDropdown members={TEAM_MEMBERS} />

          {/* Nút GitHub dẫn tới repo */}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.githubButton}
            onMouseEnter={e =>
              (e.currentTarget.style.background = "rgba(77,127,255,0.2)")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* Icon GitHub SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: 8 }}
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </motion.nav>

      {/* ── NỘI DUNG TRUNG TÂM ───────────────────────────── */}
      <main style={styles.mainContent}>
        {/* Đường kẻ trang trí phía trên */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={styles.decorLine}
        />

        {/* Dòng subtitle nhỏ */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={styles.subtitle}
        >
          {SUBTITLE}
        </motion.p>

        {/* Tiêu đề chính lớn */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={styles.mainTitle}
        >
          {MAIN_TITLE.split("\n").map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </motion.h1>

        {/* Đường kẻ trang trí phía dưới tiêu đề */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={styles.decorLine}
        />

        {/* Nút CTA - bấm vào chuyển sang 3D */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          onClick={handleEnter}
          style={styles.ctaButton}
          onMouseEnter={e => {
            const btn = e.currentTarget
            btn.style.background = "#4D7FFF"
            btn.style.color = "#000"
            btn.style.boxShadow = "0 0 40px rgba(77,127,255,0.6)"
            btn.style.letterSpacing = "5px"
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget
            btn.style.background = "transparent"
            btn.style.color = "#fff"
            btn.style.boxShadow = "0 0 20px rgba(77,127,255,0.2)"
            btn.style.letterSpacing = "4px"
          }}
        >
          {CTA_TEXT}
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ marginLeft: 12, display: "inline-block" }}
          >
            →
          </motion.span>
        </motion.button>

        {/* Chú thích nhỏ dưới nút */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={styles.hint}
        >
          Scroll • Drag • Zoom to navigate
        </motion.p>
      </main>

      {/* ── Phần footer nhỏ dưới cùng ───────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1, delay: 2 }}
        style={styles.footer}
      >
        <span>Solar System Education © 2024</span>
        <span>Built with Three.js · Next.js · React</span>
      </motion.footer>
    </motion.div>
  )
}

const MembersDropdown = ({ members }) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      {/* Nút mở dropdown */}
      <button
        onClick={() => setOpen(!open)}
        style={styles.membersButton}
        onMouseEnter={e =>
          (e.currentTarget.style.background = "rgba(77,127,255,0.2)")
        }
        onMouseLeave={e => {
          if (!open) e.currentTarget.style.background = "transparent"
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ marginRight: 8 }}
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        Thành Viên
        <span style={{ marginLeft: 6, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.8 }}
            transition={{ duration: 0.2 }}
            style={styles.dropdownMenu}
          >
            {members.map((member, index) => (
              <a
                key={index}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.dropdownItem}
                onMouseEnter={e =>
                  (e.currentTarget.style.background = "rgba(77,127,255,0.15)")
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={styles.dropdownDot}>◆</span>
                {member.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// Component: Hiệu ứng sao nhấp nháy
// ============================================================
const StarField = () => {
  // Tạo ngẫu nhiên 80 ngôi sao
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    // Delay ngẫu nhiên để sao không nhấp nháy cùng lúc
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2
  }))

  return (
    <div style={styles.starField}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: "white"
          }}
        />
      ))}
    </div>
  )
}

// ============================================================
// Styles - tập trung toàn bộ style ở đây cho dễ chỉnh
// ============================================================
const styles = {
  // Lớp bao ngoài cùng - phủ toàn màn hình
  wrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    cursor: "default",
    fontFamily: "system-ui, sans-serif"
  },

  // Nền tối với ảnh sao
  background: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#02020a",
    backgroundImage: 'url("/starry_background.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.6,
    zIndex: 0
  },

  // Gradient overlay tạo chiều sâu
  backgroundGradient: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 50% 40%, rgba(10,20,60,0.7) 0%, rgba(0,0,5,0.95) 70%)",
    zIndex: 1
  },

  // Layer sao nhấp nháy
  starField: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    pointerEvents: "none"
  },

  // ── TASKBAR ──────────────────────────────────────────────
  taskbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    background: "rgba(2, 5, 20, 0.7)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(77, 127, 255, 0.2)",
    zIndex: 10
  },

  taskbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  taskbarLogo: {
    fontSize: 22,
    color: "#4D7FFF",
    lineHeight: 1
  },

  taskbarSiteName: {
    fontFamily: "'Nasalization', var(--font-nasa), monospace",
    color: "#fff",
    fontSize: 15,
    letterSpacing: "3px",
    fontWeight: 400,
    textTransform: "uppercase"
  },

  taskbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },

  // Nút "Thành Viên" (mở dropdown)
  membersButton: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 4,
    color: "#ccc",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "7px 14px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    textTransform: "uppercase"
  },

  // Nút "GitHub"
  githubButton: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "1px solid rgba(77,127,255,0.4)",
    borderRadius: 4,
    color: "#4D7FFF",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "7px 14px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s",
    textTransform: "uppercase"
  },

  // Dropdown menu
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "rgba(5, 8, 25, 0.95)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(77,127,255,0.25)",
    borderRadius: 6,
    minWidth: 200,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    zIndex: 100,
    transformOrigin: "top right"
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    color: "#ccc",
    fontSize: 12,
    letterSpacing: "1.5px",
    textDecoration: "none",
    textTransform: "uppercase",
    transition: "background 0.15s",
    cursor: "pointer"
  },

  dropdownDot: {
    color: "#4D7FFF",
    fontSize: 8,
    marginRight: 10
  },

  // ── NỘI DUNG TRUNG TÂM ───────────────────────────────────
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    zIndex: 5,
    textAlign: "center",
    padding: "0 20px",
    maxWidth: 900
  },

  // Đường kẻ trang trí ngang
  decorLine: {
    width: 120,
    height: 1,
    background: "linear-gradient(90deg, transparent, #4D7FFF, transparent)"
  },

  // Dòng chữ nhỏ phía trên tiêu đề
  subtitle: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "5px",
    color: "#4D7FFF",
    margin: 0,
    textTransform: "uppercase"
  },

  // Tiêu đề chính lớn
  mainTitle: {
    fontFamily: "'Nasalization', var(--font-nasa), monospace",
    fontSize: "clamp(36px, 7vw, 88px)",
    fontWeight: 400,
    color: "#ffffff",
    letterSpacing: "6px",
    lineHeight: 1.15,
    margin: 0,
    textTransform: "uppercase",
    // Hiệu ứng glow nhẹ
    textShadow: "0 0 60px rgba(77,127,255,0.3), 0 0 120px rgba(77,127,255,0.1)"
  },

  // Nút CTA
  ctaButton: {
    marginTop: 16,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: "4px",
    padding: "16px 40px",
    cursor: "pointer",
    textTransform: "uppercase",
    borderRadius: 2,
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(77,127,255,0.2)",
    display: "flex",
    alignItems: "center"
  },

  // Chú thích nhỏ dưới nút
  hint: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "3px",
    color: "rgba(255,255,255,0.4)",
    margin: 0,
    textTransform: "uppercase"
  },

  // ── FOOTER ───────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.35)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    zIndex: 10
  }
}

export default IntroScreen
