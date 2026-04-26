import Planet from "./Planet";

interface SunProps {
    isActive: boolean; 
    onClick?: () => void; 
}

const Sun: React.FC<SunProps> = ({ isActive, onClick }) => {
    // Tọa độ gốc cho Mặt trời
    const pos: [number, number, number] = [0, 0, 0];

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU MẶT TRỜI KHỔNG LỒ */}
            <Planet
                position={pos}
                meshMaterialPath="/sun.jpeg"
                spinSpeed={0.03} 
                size={50} 
                onClick={onClick} 
            />

            {/* ĐÃ XÓA TOÀN BỘ LỜI CHÀO VÀ SOCIAL ICONS Ở ĐÂY */}
        </group>
    );
};

export default Sun;