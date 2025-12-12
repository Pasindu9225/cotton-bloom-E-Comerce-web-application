// components/HeroCarousel.tsx
"use client";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

interface HeroCarouselProps {
    images: string[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
    // 🛡️ SAFETY CHECK: If images is undefined, use an empty array
    const safeImages = images || [];

    if (safeImages.length === 0) {
        return <div className="h-full w-full bg-gray-200 animate-pulse" />;
    }

    return (
        <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            showArrows={false}
            interval={5000}
            transitionTime={1000}
            stopOnHover={false}
            animationHandler="fade"
            className="h-full"
        >
            {safeImages.map((src, index) => (
                <div key={index} className="relative h-full w-full">
                    <Image
                        src={src}
                        alt={`Hero slide ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
                </div>
            ))}
        </Carousel>
    );
}