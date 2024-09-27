"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Upload, Sparkles, Send, Zap } from "lucide-react";

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

const PdfUploader: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setErrorMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("filepond", file); // Ensure the field name matches the multer configuration

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setExtractedText(response.data.text); // Store the extracted text
      setFileName(file.name);
      setErrorMessage(null); // Clear any previous error messages
    } catch (error) {
      setErrorMessage("Error uploading file.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && <p>Uploaded file: {fileName}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
};
export default function QuizUploadPage() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiInteraction, setAiInteraction] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quizLength, setQuizLength] = useState(10);
  const [file, setFile] = useState<File | null>(null);
  // const [chunks, setChunks] = useState<{ range: string; content: string }[]>([]); // State to hold the PDF chunks

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ aiPrompt, aiInteraction, difficulty, quizLength, file });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-600 text-white overflow-hidden">
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
          <PdfUploader onFileChange={setFile} />

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
