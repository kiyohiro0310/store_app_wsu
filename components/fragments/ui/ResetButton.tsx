import Image from "next/image";
import React from "react";

interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer bg-yellow-400 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center p-2"
    >
      <Image src="/imgs/icons/reset.png" alt="Reset" width={15} height={15} />
    </button>
  );
};

export default ResetButton;
