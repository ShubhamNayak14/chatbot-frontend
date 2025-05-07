import React from "react";
import SearchInput from "./SearchInput";
import { Bot } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="text-center max-w-4xl mx-auto px-8">
      <div className="flex justify-center mb-8">
        <Bot className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-pulse" />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
        HeyAI: Intelligent Conversations, Always at Your Service 
        </span>
       
      </h1>

      <p className="text-gray-400 text-lg mb-12 ">
      Speak freely — our AI will craft the perfect response for you
      </p>

      <div className="mt-16 sm:mt-28 md:mt-36 lg:mt-40">
        <SearchInput />
      </div>
    </section>
  );
};

export default HeroSection;
