"use client";

import * as React from "react";
import {
    AnimatePresence,
    motion,
    type HTMLMotionProps,
    type Transition,
} from "motion/react";

function cn(...classes: Array<string | undefined | false>) {
    return classes.filter(Boolean).join(" ");
}

type RotatingTextProps = {
    text: string[];
    colors?: (string | undefined)[];
    durationMs?: number;
    slideOffset?: number;
    transition?: Transition;
    className?: string;
} & Omit<HTMLMotionProps<"div">, "children">;

function RotatingText({
    text,
    colors,
    durationMs = 2500,
    slideOffset = 40,
    transition = { duration: 0.35, ease: "easeOut" },
    className,
    ...props
}: RotatingTextProps) {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (!text || text.length === 0) return;
        const interval = setInterval(
            () => setIndex((prev) => (prev + 1) % text.length),
            durationMs
        );
        return () => clearInterval(interval);
    }, [text, durationMs]);

    if (!text || text.length === 0) return null;

    const current = text[index];
    const currentColor = colors?.[index];

    return (
        <div className={cn("overflow-hidden py-1", className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, y: -slideOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: slideOffset }}
                    transition={transition}
                    style={{ color: currentColor || "var(--foreground)" }}
                    {...(props as any)}
                >
                    {current}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export { RotatingText, type RotatingTextProps };
export default RotatingText;