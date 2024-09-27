"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFrame } from "@react-three/fiber";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  Clock,
  Award,
  Users,
  Edit,
  Trash2,
  BarChart,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Basic MovingBackground Component
const MovingBackground = () => {
  const ref = React.useRef();

  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() / 10;
    ref.current.rotation.y = state.clock.getElapsedTime() / 15;
  });

  const points = random.inSphere(new Float32Array(5000), { radius: 12 });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.005}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};

// QuizForm Component
const QuizForm = ({ quiz, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    quiz || {
      title: "",
      subject: "",
      date: "",
      duration: "",
      marks: 0,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          placeholder="e.g., 1 hour"
        />
      </div>
      <div>
        <Label htmlFor="marks">Total Marks</Label>
        <Input
          id="marks"
          name="marks"
          type="number"
          value={formData.marks}
          onChange={handleChange}
          required
          min={0}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Quiz</Button>
      </div>
    </form>
  );
};

// QuizCard Component
const QuizCard = ({ quiz, onEdit, onDelete, onViewResults }) => {
  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none text-white">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription className="text-gray-300">
          {quiz.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{quiz.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{quiz.duration}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>{quiz.marks} marks</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{quiz.participants} enrolled</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => onEdit(quiz)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button
          onClick={() => onViewResults(quiz.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          <BarChart className="mr-2 h-4 w-4" /> Results
        </Button>
        <Button
          onClick={() => onDelete(quiz.id)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// QuizList Component
const QuizList = ({ quizzes, onEdit, onDelete, onViewResults }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizCard
              quiz={quiz}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewResults={onViewResults}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Main TeacherQuizDashboard Component
export default function TeacherQuizDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const router = useRouter();
  // Simulated API calls
  const fetchQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockQuizzes = [
        {
          id: 1,
          title: "Introduction to AI",
          subject: "Computer Science",
          date: "2024-03-15",
          duration: "1 hour",
          marks: 100,
          participants: 45,
        },
        {
          id: 2,
          title: "Advanced Calculus",
          subject: "Mathematics",
          date: "2024-03-18",
          duration: "2 hours",
          marks: 150,
          participants: 32,
        },
        {
          id: 3,
          title: "World History",
          subject: "History",
          date: "2023-12-10",
          duration: "1.5 hours",
          marks: 120,
          participants: 28,
        },
        // ... other quiz data
      ];
      setQuizzes(mockQuizzes);
    } catch (err) {
      setError("Failed to fetch quizzes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      setIsLoading(true);
      try {
        // Simulating API call to delete quiz
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );
      } catch (err) {
        setError("Failed to delete quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewResults = (quizId) => {
    // Implement view results logic here
    console.log(`Viewing results for quiz with ID: ${quizId}`);
    // You can navigate to a results page or open a modal with results
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingQuizzes = filteredQuizzes.filter(
    (quiz) => new Date(quiz.date) > new Date()
  );
  const pastQuizzes = filteredQuizzes.filter(
    (quiz) => new Date(quiz.date) <= new Date()
  );

  // Determine which quizzes to display based on active tab
  const displayedQuizzes =
    activeTab === "all"
      ? filteredQuizzes
      : activeTab === "upcoming"
      ? upcomingQuizzes
      : pastQuizzes;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-600 text-white overflow-hidden">
      {/* 3D Moving Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <MovingBackground />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold text-center">
            Teacher Quiz Dashboard
          </h1>

          {/* Search and Create Button */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:max-w-md mb-4 md:mb-0">
              <Label htmlFor="search" className="sr-only">
                Search Quizzes
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-white bg-opacity-10 border-none placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                router.push("/teacher/create-quiz");
              }}
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Quiz
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-md">{error}</div>
          )}

          {/* Tabs for Quizzes */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white bg-opacity-10 rounded-lg">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-indigo-600"
              >
                All Quizzes
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="text-white data-[state=active]:bg-indigo-600"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="text-white data-[state=active]:bg-indigo-600"
              >
                Past
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh] mt-6 rounded-md border border-indigo-300 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                </div>
              ) : (
                <TabsContent value={activeTab}>
                  <QuizList
                    quizzes={displayedQuizzes}
                    onEdit={(quiz) => {
                      setEditingQuiz(quiz);
                      setIsFormOpen(true);
                    }}
                    onDelete={handleDeleteQuiz}
                    onViewResults={handleViewResults}
                  />
                </TabsContent>
              )}
            </ScrollArea>
          </Tabs>

          {/* Badges for Quiz Counts */}
          {!isLoading && (
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Quizzes: {filteredQuizzes.length}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Upcoming: {upcomingQuizzes.length}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Past: {pastQuizzes.length}
              </Badge>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dialog for Creating/Editing Quiz */}
    </div>
  );
}
