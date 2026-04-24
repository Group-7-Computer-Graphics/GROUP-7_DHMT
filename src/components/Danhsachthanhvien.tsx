import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const TEAM_MEMBERS = [
  { name: "Nguyễn Hồng Đăng", github: "https://github.com/", masinhvien: ""},
  { name: "Phạm Thanh Vân", github: "https://github.com/", masinhvien: ""},
  { name: "Trần Thùy Trang", github: "https://github.com/", masinhvien: ""},
  { name: "Nguyễn Anh Đức", github: "https://github.com/", masinhvien: ""},
  { name: "Nguyễn Phương Anh", github: "https://github.com/", masinhvien: "" },
];

// Link repository GitHub của cả team
export const GITHUB_REPO_URL = "https://github.com/";


interface MembersDropdownProps {
  members: typeof TEAM_MEMBERS;
}

const MembersDropdown: React.FC<MembersDropdownProps> = ({ members }) => {
  const [open, setOpen] = useState(false);

  return (
        <div style={{ position: "relative" }}>
          {/* Nút mở dropdown */}
          <button
            onClick={() => setOpen(!open)}
            style={styles.membersButton}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(239, 243, 255, 0.2)")
            }
            onMouseLeave={(e) => {
              if (!open)
                (e.currentTarget as HTMLElement).style.background = "transparent";
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
                animate={{ opacity: 1, y: 1, scaleY: 1 }}
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
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "rgba(250, 251, 255, 0.15)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "transparent")
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
  );
};
const styles: Record<string, React.CSSProperties> = {
  // Nút "Thành Viên" (mở dropdown)
  membersButton: {
    // --- HAI DÒNG QUAN TRỌNG NHẤT ---
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "12px 14px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    textTransform: "uppercase",
  },
    dropdownItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    color: "#ccc",
    fontSize: 9,
    letterSpacing: "1.5px",
    textDecoration: "none",
    textTransform: "uppercase",
    transition: "background 0.15s",
    cursor: "pointer",
  },
}
export default MembersDropdown;