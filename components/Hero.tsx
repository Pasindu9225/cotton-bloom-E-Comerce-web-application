// components/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "/hero-1.png",
        title: "Pure Comfort, Naturally.",
        subtitle: "Experience the softness of 100% organic cotton.",
        color: "text-white",
    },
    {
        id: 2,
        image: "/hero-2.png",
        title: "Summer Collection 2025",
        subtitle: "Breathable fabrics designed for the heat.",
        color: "text-white",
    },
    {
        id: 3,
        image: "/hero-3.png",
        title: "Essentials for Everyone",
        subtitle: "Timeless styles for men and women.",
        color: "text-white",
    },
];

export default function Hero() {
    const [current, setCurrent] = useState(0);

    // Auto-advance slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
            {/* Background Images */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover opacity-60" // opacity-60 darkens image for better text readability
                        priority={index === 0}
                        unoptimized
                    />
                </div>
            ))}

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 animate-fade-in-up">
                    New Season Arrivals
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-lg max-w-4xl">
                    {slides[current].title}
                </h1>
                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl drop-shadow-md">
                    {slides[current].subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/new-arrivals"
                        className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        Shop Collection <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/men"
                        className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
                    >
                        Explore Men
                    </Link>
                </div>
            </div>

            {/* Slide Indicators (Dots) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${current === index ? "w-8 bg-white" : "w-2 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}