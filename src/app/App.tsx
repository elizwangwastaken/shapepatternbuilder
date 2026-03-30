import { useState } from "react";
import { PatternShape } from "./components/PatternShape";
import { NoiseTexture } from "./components/NoiseTexture";
import { CanvasTexture } from "./components/CanvasTexture";
import { Button } from "./components/ui/button";
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { RotateCw, Trash2, Grid3x3, Sparkles, Download, Palette, Circle } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Shape {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

type TextureType = "none" | "grid" | "dots" | "bubbles" | "diagonal" | "waves";

export default function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [nextId, setNextId] = useState(0);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [hexInput, setHexInput] = useState("#000000");
  const [currentSize, setCurrentSize] = useState(80);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [gridMode, setGridMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#006aff");
  const [bgHexInput, setBgHexInput] = useState("#006aff");
  const [textureType, setTextureType] = useState<TextureType>("none");

  const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00",
    "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
  ];

  const backgroundPresets = [
    "#006aff", "#0052cc", "#FF6B6B", "#4ECDC4",
    "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E2", "#2C3E50", "#E74C3C",
    "#1ABC9C", "#F39C12", "#9B59B6", "#34495E",
  ];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.canvas-area')) {
      const rect = e.currentTarget.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      if (gridMode) {
        const gridSize = currentSize;
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }

      const newShape: Shape = {
        id: nextId,
        x,
        y,
        rotation: currentRotation,
        color: currentColor,
        size: currentSize,
      };

      setShapes([...shapes, newShape]);
      setNextId(nextId + 1);
    }
  };

  const removeShape = (id: number) => {
    setShapes(shapes.filter((shape) => shape.id !== id));
    toast.success("Shape removed");
  };

  const clearAll = () => {
    setShapes([]);
    toast.success("Canvas cleared");
  };

  const rotateAll = () => {
    if (shapes.length === 0) {
      toast.error("Add some shapes first!");
      return;
    }
    setShapes(shapes.map((shape) => ({ ...shape, rotation: shape.rotation + 60 })));
    toast.success("All shapes rotated!");
  };

  const randomizeColors = () => {
    if (shapes.length === 0) {
      toast.error("Add some shapes first!");
      return;
    }
    setShapes(shapes.map((shape) => ({
      ...shape,
      color: presetColors[Math.floor(Math.random() * presetColors.length)],
    })));
    toast.success("Colors randomized!");
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setCurrentColor(value);
    }
  };

  const handleColorPickerChange = (color: string) => {
    setCurrentColor(color);
    setHexInput(color);
  };

  const handleBgHexChange = (value: string) => {
    setBgHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setBackgroundColor(value);
    }
  };

  const handleBgColorPickerChange = (color: string) => {
    setBackgroundColor(color);
    setBgHexInput(color);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#006aff] to-[#0052cc]">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-80 bg-white/95 backdrop-blur-sm p-6 flex flex-col gap-6 overflow-auto shadow-2xl relative"
      >
        <NoiseTexture />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-black text-[#006aff] mb-1 tracking-tight">SHAPE</h1>
            <h1 className="text-4xl font-black text-[#006aff] mb-1 tracking-tight">BUILDER</h1>
            <h1 className="text-5xl font-black text-black tracking-tight">PATTERN</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#006aff] to-[#0052cc] rounded-2xl p-4 mt-4 shadow-lg"
          >
            <p className="text-white text-sm leading-relaxed">
              <strong>Click</strong> on the canvas to place shapes
              <br />
              <strong>Customize</strong> colors, size & rotation
              <br />
              <strong>Click shapes</strong> to remove them
            </p>
          </motion.div>
        </div>

        {/* Color Picker Section */}
        <div className="relative z-10">
          <label className="text-gray-800 font-bold mb-3 block flex items-center gap-2">
            <Palette className="size-5 text-[#006aff]" />
            Shape Color
          </label>
          
          <Tabs defaultValue="wheel" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="wheel">Wheel</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wheel" className="space-y-3">
              <div className="flex justify-center">
                <HexColorPicker color={currentColor} onChange={handleColorPickerChange} />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                  placeholder="#000000"
                  className="font-mono uppercase"
                  maxLength={7}
                />
                <div
                  className="w-12 h-10 rounded border-2 border-gray-300 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: currentColor }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="presets">
              <div className="grid grid-cols-4 gap-2">
                {presetColors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full aspect-square rounded-lg border-3 shadow-md transition-all ${
                      currentColor === color ? "border-[#006aff] ring-2 ring-[#006aff] ring-offset-2" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setCurrentColor(color);
                      setHexInput(color);
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Background Color Picker Section */}
        <div className="relative z-10">
          <label className="text-gray-800 font-bold mb-3 block flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🎨
            </motion.div>
            Canvas Background
          </label>
          
          <Tabs defaultValue="bg-presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="bg-wheel">Wheel</TabsTrigger>
              <TabsTrigger value="bg-presets">Presets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bg-wheel" className="space-y-3">
              <div className="flex justify-center">
                <HexColorPicker color={backgroundColor} onChange={handleBgColorPickerChange} />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={bgHexInput}
                  onChange={(e) => handleBgHexChange(e.target.value.toUpperCase())}
                  placeholder="#006aff"
                  className="font-mono uppercase"
                  maxLength={7}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-10 rounded border-2 border-gray-300 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: backgroundColor }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bg-presets">
              <div className="grid grid-cols-4 gap-2">
                {backgroundPresets.map((color) => (
                  <motion.button
                    key={`bg-${color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full aspect-square rounded-lg border-3 shadow-md transition-all ${
                      backgroundColor === color ? "border-[#006aff] ring-2 ring-[#006aff] ring-offset-2" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBackgroundColor(color);
                      setBgHexInput(color);
                      toast.success("Background updated!");
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Size Control */}
        <div className="relative z-10">
          <label className="text-gray-800 font-bold mb-2 block">
            Size: <span className="text-[#006aff]">{currentSize}px</span>
          </label>
          <Slider
            value={[currentSize]}
            onValueChange={(value) => setCurrentSize(value[0])}
            min={40}
            max={150}
            step={10}
            className="w-full"
          />
        </div>

        {/* Rotation Control */}
        <div className="relative z-10">
          <label className="text-gray-800 font-bold mb-2 block">
            Rotation: <span className="text-[#006aff]">{currentRotation}°</span>
          </label>
          <Slider
            value={[currentRotation]}
            onValueChange={(value) => setCurrentRotation(value[0])}
            min={0}
            max={360}
            step={15}
            className="w-full"
          />
        </div>

        {/* Grid Mode Toggle */}
        <motion.div whileTap={{ scale: 0.98 }} className="relative z-10">
          <Button
            variant={gridMode ? "default" : "outline"}
            onClick={() => {
              setGridMode(!gridMode);
              toast.success(gridMode ? "Snap to grid disabled" : "Snap to grid enabled!");
            }}
            className={`w-full ${gridMode ? "bg-gradient-to-r from-[#006aff] to-[#0052cc]" : ""}`}
          >
            <Grid3x3 className="mr-2 size-4" />
            {gridMode ? "Snap Grid: ON" : "Snap Grid: OFF"}
          </Button>
        </motion.div>

        {/* Canvas Texture Selector */}
        <div className="relative z-10">
          <label className="text-gray-800 font-bold mb-3 block flex items-center gap-2">
            <Sparkles className="size-5 text-[#006aff]" />
            Canvas Texture
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "none" as TextureType, label: "None", icon: "⭕" },
              { type: "grid" as TextureType, label: "Grid", icon: "⊞" },
              { type: "dots" as TextureType, label: "Dots", icon: "⋯" },
              { type: "bubbles" as TextureType, label: "Bubbles", icon: "○" },
              { type: "diagonal" as TextureType, label: "Lines", icon: "⟋" },
              { type: "waves" as TextureType, label: "Waves", icon: "〜" },
            ].map((texture) => (
              <motion.button
                key={texture.type}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTextureType(texture.type);
                  toast.success(`Texture: ${texture.label}`);
                }}
                className={`p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  textureType === texture.type
                    ? "bg-gradient-to-br from-[#006aff] to-[#0052cc] text-white border-[#006aff] shadow-lg"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#006aff]"
                }`}
              >
                <div className="text-2xl mb-1">{texture.icon}</div>
                <div>{texture.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 relative z-10">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={rotateAll} className="w-full">
              <RotateCw className="mr-2 size-4" />
              Rotate
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={randomizeColors} className="w-full">
              <Sparkles className="mr-2 size-4" />
              Colors
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-2">
            <Button variant="destructive" onClick={clearAll} className="w-full">
              <Trash2 className="mr-2 size-4" />
              Clear Canvas
            </Button>
          </motion.div>
        </div>

        <div className="text-gray-600 text-sm mt-auto flex justify-between items-center relative z-10">
          <span className="font-semibold">Shapes: <span className="text-[#006aff]">{shapes.length}</span></span>
          <motion.div
            animate={{ rotate: shapes.length > 0 ? 360 : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {shapes.length > 0 && <Sparkles className="size-4 text-[#006aff]" />}
          </motion.div>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        className="flex-1 relative overflow-hidden cursor-crosshair canvas-area"
        onClick={handleCanvasClick}
        style={{ backgroundColor }}
        animate={{ backgroundColor }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NoiseTexture />
        
        {/* Canvas Texture */}
        <CanvasTexture type={textureType} color="white" opacity={0.2} />

        {/* Snap Grid overlay */}
        <AnimatePresence>
          {gridMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <svg className="w-full h-full" style={{ opacity: 0.3 }}>
                <defs>
                  <pattern
                    id="snapGrid"
                    width={currentSize}
                    height={currentSize}
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d={`M ${currentSize} 0 L 0 0 0 ${currentSize}`}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#snapGrid)" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shapes */}
        <AnimatePresence>
          {shapes.map((shape) => (
            <PatternShape
              key={shape.id}
              x={shape.x}
              y={shape.y}
              rotation={shape.rotation}
              color={shape.color}
              size={shape.size}
              onClick={() => removeShape(shape.id)}
            />
          ))}
        </AnimatePresence>

        {/* Center guide when empty */}
        <AnimatePresence>
          {shapes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-white/60 text-7xl font-black mb-4 drop-shadow-lg"
                >
                  CLICK TO START
                </motion.div>
                <div className="text-white/40 text-2xl font-medium">Click anywhere to place a shape ✨</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}