import React from "react";
import { Box, Text, Heading, CloseButton, VStack } from "@chakra-ui/react";

interface PlaceholderProps {
  onClose: () => void;
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ onClose, title }) => {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="400px" // Độ rộng bảng
      bg="rgba(0, 0, 0, 0.9)" // Màu nền đen trong suốt
      color="white"
      p={8}
      borderRadius="20px"
      border="1px solid rgba(255, 255, 255, 0.2)"
      backdropFilter="blur(10px)" // Hiệu ứng mờ nền
      zIndex={2000}
    >
      <CloseButton 
        position="absolute" 
        right={4} 
        top={4} 
        onClick={onClose} 
        _hover={{ bg: "white", color: "black" }}
      />
      <VStack align="start" spacing={4}>
        <Heading size="md" color="#4D7FFF">{title}</Heading>
        <Text fontSize="sm">
          Project này đang trong quá trình bay từ vũ trụ về Trái Đất. 
          Vui lòng quay lại sau để xem chi tiết nội dung!
        </Text>
      </VStack>
    </Box>
  );
};

export default Placeholder;