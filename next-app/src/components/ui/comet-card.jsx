"use client";
import React, { useRef, useContext, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SoundsContext } from "@/components/SoundsContext";

export const CometCard = ({
  rotateDepth = 12,
  translateDepth = 15,
  className,
  children,
  borderColor = "rgba(199, 32, 113, 0.35)",
  glowColor = "rgba(199, 32, 113, 0.2)",
}) => {
  const ref = useRef(null);
  const sounds = useContext(SoundsContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);

  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(199, 32, 113, 0.3) 0%, rgba(199, 32, 113, 0.15) 40%, rgba(199, 32, 113, 0) 70%)`;

  // Idle floating animation for desktop to hint at interactivity
  useEffect(() => {
    if (isMobile || isHovered) return;

    let animationFrame;
    let startTime = Date.now();

    const animateFloat = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const value = Math.sin(elapsed * 1.5) * 0.06;
      x.set(value);
      y.set(value * 0.5);
      animationFrame = requestAnimationFrame(animateFloat);
    };

    animateFloat();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isMobile, isHovered, x, y]);

  const handleMouseMove = (e) => {
    if (!ref.current || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (sounds?.hover) {
      sounds.hover.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    if (!isMobile || !ref.current) return;
    setIsHovered(true);
    if (sounds?.hover) {
      sounds.hover.play();
    }

    const touch = e.touches[0];
    const rect = ref.current.getBoundingClientRect();
    const xPct = (touch.clientX - rect.left) / rect.width - 0.5;
    const yPct = (touch.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct * 0.5);
    y.set(yPct * 0.5);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !ref.current) return;
    const touch = e.touches[0];
    const rect = ref.current.getBoundingClientRect();
    const xPct = (touch.clientX - rect.left) / rect.width - 0.5;
    const yPct = (touch.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct * 0.5);
    y.set(yPct * 0.5);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{
          scale: 1.03,
          z: 30,
          transition: { duration: 0.3 },
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.1 },
        }}
        className="relative rounded-2xl"
      >
        {/* Content container */}
        <div className="relative rounded-2xl" style={{ zIndex: 2 }}>
          {children}
        </div>
      </motion.div>

      {/* Glare circle - REMOVED */}
    </div>
  );
};
