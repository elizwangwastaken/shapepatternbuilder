import svgPaths from "../../imports/svg-edpkvdgudw";
import { motion } from "motion/react";

interface PatternShapeProps {
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  onClick?: () => void;
}

export function PatternShape({ x, y, rotation, color, size, onClick }: PatternShapeProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute cursor-pointer"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 316 315">
        <g clipPath="url(#clip0_1_39)">
          <path d={svgPaths.p170966c0} fill={color} />
          <path d={svgPaths.p170966c0} fill={color} />
          <path d={svgPaths.p1fe452f0} fill={color} />
          <path d={svgPaths.p1fe452f0} fill={color} />
          <path d={svgPaths.p41ece00} fill={color} />
          <path d={svgPaths.p11e253f0} fill={color} />
        </g>
        <defs>
          <clipPath id="clip0_1_39">
            <rect fill="white" height="315" width="316" />
          </clipPath>
        </defs>
      </svg>
    </motion.div>
  );
}