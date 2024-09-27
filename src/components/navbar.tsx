"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import KindeLink from "./KindeButton";
import Image from "next/image";
const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400"
          >
            QuizCraft AI
          </Link>
          <div className="space-x-4">
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Button
              asChild
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black"
              disabled={isLoading as boolean}
            >
              {isAuthenticated && user?.picture ? (
                <Image
                  src={user?.picture}
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt="User profile picture"
                />
              ) : (
                <KindeLink type="login" text="Sign In" />
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
