"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type RotatingTextProps = {
    text: string[];
    colors?: (string | undefined)[];
    durationMs?: number;
    slideOffset?: number;
    className?: string;
};

export default function RotatingText({
    text,
    colors = [],
    durationMs = 2500,
    slideOffset = 10,
    className = "",
}: RotatingTextProps) {
    const items = useMemo(() => text.filter(Boolean), [text]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;

        const timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, durationMs);

        return () => window.clearInterval(timer);
    }, [items.length, durationMs]);

    if (!items.length) return null;

    const activeText = items[index];
    const activeColor = colors[index];

    return (
        <span className={`relative inline-flex min-h-[1.2em] items-center ${className}`}>
            <span className="relative inline-block">
                <span className="invisible whitespace-nowrap">
                    {items.reduce((a, b) => (a.length > b.length ? a : b), "")}
                </span>

                <AnimatePresence initial={false} mode="sync">
                    <motion.span
                        key={`${activeText}-${index}`}
                        className="absolute inset-0 whitespace-nowrap"
                        initial={{ opacity: 0, y: slideOffset, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -slideOffset, filter: "blur(8px)" }}
                        transition={{
                            duration: 0.90,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            color: activeColor || "currentColor",
                            willChange: "transform, opacity, filter",
                        }}
                    >
                        {activeText}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
}