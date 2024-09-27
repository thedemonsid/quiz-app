"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Lightbulb, Users, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";

const NeuralNetwork = () => {
  const ref = useRef<THREE.Points>(null!);
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ThreeScene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <NeuralNetwork />
      </Canvas>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-xl"
  >
    <Icon className="w-12 h-12 text-indigo-600 mb-4" />
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-600 text-white overflow-hidden">
      <ThreeScene />

      <Navbar></Navbar>

      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              Revolutionize Learning with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                AI-Powered Quizzes
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Empower students and teachers with adaptive assessments that
              evolve with each interaction.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-900 hover:bg-indigo-100"
              >
                <Link href="/demo">Experience the Demo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white hover:bg-white text-indigo-900"
              >
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Transforming Education for Everyone
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="AI-Powered Insights"
                description="Our advanced AI analyzes learning patterns to provide personalized quiz experiences."
              />
              <FeatureCard
                icon={Lightbulb}
                title="Adaptive Learning"
                description="Quizzes evolve based on individual performance, ensuring optimal challenge levels."
              />
              <FeatureCard
                icon={Users}
                title="Collaborative Tools"
                description="Foster peer-to-peer learning with group quizzes and shared study sessions."
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-black bg-opacity-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Join the Learning Revolution
              </h2>
              <p className="text-xl mb-8">
                Be among the first to experience the future of education. Sign
                up for early access and receive exclusive benefits.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <div className="w-full sm:w-auto">
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-64 bg-white bg-opacity-20 text-white placeholder-gray-300 border-white focus:border-indigo-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-100"
                >
                  Get Early Access
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 mb-20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div style={{ y }} className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-4xl font-bold mb-6">
                  Empowering Educators
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  QuizCraft AI isn't just for students. We're revolutionizing
                  how teachers create, manage, and analyze assessments.
                </p>
                <ul className="space-y-4">
                  {[
                    "Instant quiz generation based on curriculum",
                    "Real-time performance analytics",
                    "Customizable difficulty levels",
                    "Integration with popular learning management systems",
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <Zap className="w-5 h-5 text-indigo-400" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Teacher using QuizCraft AI"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black bg-opacity-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 QuizCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
