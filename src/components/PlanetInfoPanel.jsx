// --- COMPONENT BẢNG THÔNG TIN & CÂU HỎI (Phiên bản JSX thuần) ---
function PlanetInfoPanel({ currentHash }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const data = planetData[currentHash];

  // Reset trạng thái quiz khi đổi hành tinh
  useEffect(() => {
    setShowQuiz(false);
    setSelectedAnswer(null);
  }, [currentHash]);

  if (!data) return null;

  const handleAnswerClick = (index) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={currentHash}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          position: "absolute",
          top: "15%",
          left: "40px",
          width: "320px",
          zIndex: 10,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "1px solid rgba(0, 150, 255, 0.5)", paddingBottom: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "42px", fontWeight: "bold", letterSpacing: "2px" }}>{data.name}</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#88ccff", letterSpacing: "5px" }}>{data.type}</p>
        </div>

        {!showQuiz ? (
          /* MENU MẶC ĐỊNH */
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <MenuButton text="VISIT" />
            <MenuButton text="ENCYCLOPEDIA" />
            <MenuButton text="STRUCTURE" />
            {/* NÚT KÍCH HOẠT CÂU HỎI */}
            <MenuButton 
              text="QUESTION (QUIZ)" 
              highlight 
              onClick={() => setShowQuiz(true)} 
            />
          </div>
        ) : (
          /* BẢNG CÂU HỎI */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: "rgba(0, 20, 40, 0.8)",
              border: "1px solid #0099ff",
              borderRadius: "8px",
              padding: "20px",
              backdropFilter: "blur(10px)"
            }}
          >
            <h3 style={{ marginTop: 0, color: "#00ccff", fontSize: "18px" }}>Câu hỏi:</h3>
            <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>{data.question}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.options.map((option, index) => {
                let bgColor = "rgba(255, 255, 255, 0.1)";
                let borderColor = "rgba(255, 255, 255, 0.3)";

                if (selectedAnswer !== null) {
                  if (index === data.correctAnswer) {
                    bgColor = "rgba(0, 255, 0, 0.3)"; // Màu xanh lá cho đáp án đúng
                    borderColor = "#00ff00";
                  } else if (index === selectedAnswer) {
                    bgColor = "rgba(255, 0, 0, 0.3)"; // Màu đỏ cho đáp án sai
                    borderColor = "#ff0000";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      color: "white",
                      cursor: selectedAnswer === null ? "pointer" : "default",
                      borderRadius: "4px",
                      transition: "all 0.3s",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <button
                onClick={() => { setShowQuiz(false); setSelectedAnswer(null); }}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "transparent",
                  border: "1px solid #00ccff",
                  color: "#00ccff",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                QUAY LẠI MENU
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// UI Nút bấm mang phong cách viễn tưởng (Phiên bản JSX thuần)
function MenuButton({ text, onClick, highlight = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "15px 20px",
        backgroundColor: highlight ? "rgba(0, 150, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
        border: `1px solid ${highlight ? "#00ccff" : "rgba(255, 255, 255, 0.2)"}`,
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        letterSpacing: "2px",
        cursor: "pointer",
        textAlign: "left",
        clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 150, 255, 0.4)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = highlight ? "rgba(0, 150, 255, 0.2)" : "rgba(255, 255, 255, 0.05)")}
    >
      {text}
    </button>
  );
}