"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Brain, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MovingBackground: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={2} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.005}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

interface LLMInputProps {
  onSuggest: (suggestion: string) => void;
}

const LLMInput: React.FC<LLMInputProps> = ({ onSuggest }) => {
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSuggest = useCallback(async () => {
    setIsThinking(true);
    // Simulating LLM response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // In a real application, you would make an API call to your LLM here
    const suggestion = `LLM suggestion based on: ${prompt}`;
    onSuggest(suggestion);
    setPrompt("");
    setIsThinking(false);
  }, [prompt, onSuggest]);

  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg space-y-2">
      <Label htmlFor="llm-prompt" className="text-sm font-medium text-white">
        Ask LLM for suggestions
      </Label>
      <div className="flex space-x-2">
        <Textarea
          id="llm-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Improve this question..."
          className="flex-grow bg-white bg-opacity-20 border-none text-white placeholder-gray-400"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSuggest}
                disabled={isThinking || !prompt}
                className={`${
                  isThinking
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white`}
              >
                {isThinking ? (
                  <Brain className="animate-pulse" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get LLM suggestions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionProps {
  question: Question;
  updateQuestion: (newQuestion: Question) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  updateQuestion,
}) => {
  const handleLLMSuggest = useCallback(
    (suggestion: string) => {
      updateQuestion({ ...question, text: suggestion });
    },
    [question, updateQuestion]
  );

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg space-y-4 mb-6">
      <Input
        value={question.text}
        onChange={(e) => updateQuestion({ ...question, text: e.target.value })}
        className="text-xl font-semibold bg-transparent border-none focus:ring-0 w-full"
        placeholder="Enter question..."
      />
      <LLMInput onSuggest={handleLLMSuggest} />
      <RadioGroup
        value={question.correctAnswer}
        onValueChange={(value: any) =>
          updateQuestion({ ...question, correctAnswer: value })
        }
      >
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="flex items-center space-x-2 bg-white bg-opacity-5 p-2 rounded"
          >
            <RadioGroupItem value={option} id={`option${optionIndex}`} />
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[optionIndex] = e.target.value;
                updateQuestion({ ...question, options: newOptions });
              }}
              className="flex-grow bg-transparent border-none focus:ring-0"
              placeholder={`Option ${optionIndex + 1}`}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

const QuizPreview: React.FC = () => {
  const [quizTitle, setQuizTitle] = useState("Common Sense Quiz");
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      text: "Which planet is known as the Red Planet?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      text: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
    },
  ]);

  const updateQuestion = useCallback((index: number, newQuestion: Question) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = newQuestion;
      return newQuestions;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-600 text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <MovingBackground />
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="text-4xl font-bold text-center bg-transparent border-none focus:ring-0"
          />

          {questions.map((question, index) => (
            <QuestionComponent
              key={index}
              question={question}
              updateQuestion={(newQuestion) =>
                updateQuestion(index, newQuestion)
              }
            />
          ))}

          <div className="flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <Sparkles className="mr-2" />
              Finalize Quiz
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPreview;