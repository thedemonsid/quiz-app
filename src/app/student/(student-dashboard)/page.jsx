"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  Clock,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";

const MovingBackground = () => {
  const ref = useRef();
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const QuizCard = ({ quiz, onJoin }) => {
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
            <span>{quiz.participants} joined</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Join Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle>Join {quiz.title}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to join this quiz? Make sure you&apos;re
                prepared and have the necessary materials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <div>{quiz.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-indigo-400" />
                <div>{quiz.duration}</div>
              </div>
              <div className="flex items-center gap-4">
                <Award className="h-5 w-5 text-indigo-400" />
                <div>{quiz.marks} marks</div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => onJoin(quiz.id)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Confirm Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const QuizList = ({ quizzes, onJoin }) => {
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
            <QuizCard quiz={quiz} onJoin={onJoin} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function StudentQuizDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [quizzes, setQuizzes] = useState([
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
      title: "World History: 20th Century",
      subject: "History",
      date: "2024-03-20",
      duration: "1.5 hours",
      marks: 120,
      participants: 56,
    },
    {
      id: 4,
      title: "Organic Chemistry",
      subject: "Chemistry",
      date: "2024-03-22",
      duration: "1.5 hours",
      marks: 100,
      participants: 38,
    },
    {
      id: 5,
      title: "English Literature: Shakespeare",
      subject: "Literature",
      date: "2024-03-25",
      duration: "2 hours",
      marks: 150,
      participants: 41,
    },
    {
      id: 6,
      title: "Quantum Physics",
      subject: "Physics",
      date: "2024-03-28",
      duration: "2 hours",
      marks: 200,
      participants: 29,
    },
  ]);

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

  const handleJoinQuiz = (quizId) => {
    console.log(`Joined quiz with ID: ${quizId}`);
    // Here you would typically handle the logic for joining a quiz,
    // such as redirecting to a quiz room or updating the server
  };

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
          <h1 className="text-4xl font-bold text-center">
            Student Quiz Dashboard
          </h1>

          <div className="max-w-md mx-auto">
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

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
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
              <TabsContent value="all">
                <QuizList quizzes={filteredQuizzes} onJoin={handleJoinQuiz} />
              </TabsContent>
              <TabsContent value="upcoming">
                <QuizList quizzes={upcomingQuizzes} onJoin={handleJoinQuiz} />
              </TabsContent>
              <TabsContent value="past">
                <QuizList quizzes={pastQuizzes} onJoin={handleJoinQuiz} />
              </TabsContent>
            </ScrollArea>
          </Tabs>

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
        </motion.div>
      </div>
    </div>
  );
}
