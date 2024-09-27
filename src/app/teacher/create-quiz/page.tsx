"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Text } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Upload, Sparkles, Send, Zap } from "lucide-react";
import * as THREE from "three";

const NeuralParticles = () => {
  const ref = useRef<THREE.Points>(null!);
  const { camera } = useThree();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
    camera.position.z = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Text
        position={[0, 0, 0]}
        color="#ffffff"
        fontSize={0.1}
        maxWidth={1}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        AI-Powered Quiz Creator
      </Text>
    </group>
  );
};

const FloatingIcon: React.FC<{ icon: React.ReactNode; delay: number }> = ({
  icon,
  delay,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      },
    });
  }, [controls, delay]);

  return (
    <motion.div
      className="absolute text-indigo-300"
      style={{ fontSize: "2rem" }}
      animate={controls}
    >
      {icon}
    </motion.div>
  );
};

const AIPromptInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Label htmlFor="ai-prompt" className="text-lg font-semibold">
        AI Prompt
      </Label>
      <div className="relative">
        <Textarea
          id="ai-prompt"
          placeholder="Describe the quiz topic and any specific instructions for the AI..."
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          className="min-h-[100px] pr-10 bg-white bg-opacity-10 backdrop-blur-lg text-white placeholder-gray-400 border-indigo-400 focus:border-indigo-500 transition-all duration-300"
        />
        <Brain className="absolute right-3 top-3 text-indigo-300" />
      </div>
    </motion.div>
  );
};

const AIInteraction: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Label htmlFor="ai-interaction" className="text-lg font-semibold">
        AI Interaction
      </Label>
      <div className="relative">
        <Input
          id="ai-interaction"
          placeholder="Ask the AI about the quiz or for suggestions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10 bg-white bg-opacity-10 backdrop-blur-lg text-white placeholder-gray-400 border-indigo-400 focus:border-indigo-500 transition-all duration-300"
        />
        <Send className="absolute right-3 top-2.5 text-indigo-300" />
      </div>
    </motion.div>
  );
};

const DifficultySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Label htmlFor="difficulty" className="text-lg font-semibold">
        Difficulty Level
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="difficulty"
          className="bg-white bg-opacity-10 backdrop-blur-lg text-white border-indigo-400 focus:border-indigo-500 transition-all duration-300"
        >
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

const QuizLengthSelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Label htmlFor="quiz-length" className="text-lg font-semibold">
        Quiz Length (Number of Questions)
      </Label>
      <Slider
        id="quiz-length"
        min={5}
        max={20}
        step={5}
        value={[value]}
        onValueChange={(values: any) => onChange(values[0])}
        className="py-4"
      />
      <div className="text-center text-white">{value} questions</div>
    </motion.div>
  );
};

const FileUpload: React.FC<{
  onFileChange: (file: File | null) => void;
}> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
    setFileName(file ? file.name : null);
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Label htmlFor="file-upload" className="text-lg font-semibold">
        Upload Additional Context (Optional)
      </Label>
      <div className="relative">
        <Input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
        <Label
          htmlFor="file-upload"
          className="flex items-center justify-center px-4 py-2 bg-white bg-opacity-10 backdrop-blur-lg text-white rounded-md cursor-pointer hover:bg-opacity-20 transition-all duration-300"
        >
          <Upload className="mr-2" />
          {fileName || "Choose file"}
        </Label>
      </div>
      <AnimatePresence>
        {fileName && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-indigo-200 mt-1"
          >
            File uploaded: {fileName}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function QuizUploadPage() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiInteraction, setAiInteraction] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quizLength, setQuizLength] = useState(10);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ aiPrompt, aiInteraction, difficulty, quizLength, file });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <NeuralParticles />
        </Canvas>
      </div>

      <FloatingIcon icon={<Brain />} delay={0} />
      <FloatingIcon icon={<Zap />} delay={0.5} />
      <FloatingIcon icon={<Sparkles />} delay={1} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-pink-300">
            Create AI-Powered Quiz
          </h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-8 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-xl border border-indigo-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AIPromptInput value={aiPrompt} onChange={setAiPrompt} />
          <AIInteraction value={aiInteraction} onChange={setAiInteraction} />
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
          <QuizLengthSelector value={quizLength} onChange={setQuizLength} />
          <FileUpload onFileChange={setFile} />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
            >
              <Sparkles className="mr-2" />
              Generate AI Quiz
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
