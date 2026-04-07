import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CursorVariant = "default" | "link" | "card" | "text" | "hidden";

export default function CustomCursor() {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [variant, setVariant] = useState<CursorVariant>("default");
    const [isDark, setIsDark] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const ringX = useSpring(mouseX, { damping: 24, stiffness: 260, mass: 0.7 });
    const ringY = useSpring(mouseY, { damping: 24, stiffness: 260, mass: 0.7 });

    const trailX = useSpring(mouseX, { damping: 18, stiffness: 140, mass: 1.15 });
    const trailY = useSpring(mouseY, { damping: 18, stiffness: 140, mass: 1.15 });

    const dotX = useSpring(mouseX, { damping: 38, stiffness: 520, mass: 0.45 });
    const dotY = useSpring(mouseY, { damping: 38, stiffness: 520, mass: 0.45 });

    useEffect(() => {
        const media = window.matchMedia("(pointer: fine)");

        const updateDevice = () => setIsDesktop(media.matches);
        updateDevice();

        const html = document.documentElement;

        const syncTheme = () => {
            setIsDark(html.classList.contains("dark"));
        };

        syncTheme();

        const observer = new MutationObserver(syncTheme);
        observer.observe(html, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });

        const handleMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setIsVisible(true);

            const target = e.target as HTMLElement | null;

            if (!target) {
                setVariant("default");
                return;
            }

            if (target.closest("[data-cursor='hidden']")) {
                setVariant("hidden");
                return;
            }

            if (target.closest("[data-cursor='card']")) {
                setVariant("card");
                return;
            }

            if (
                target.closest(
                    "a, button, [role='button'], input, textarea, select, label"
                )
            ) {
                setVariant("link");
                return;
            }

            if (target.closest("p, h1, h2, h3, h4, h5, h6, span")) {
                setVariant("text");
                return;
            }

            setVariant("default");
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const related = e.relatedTarget as Node | null;
            if (!related) setIsVisible(false);
        };

        media.addEventListener("change", updateDevice);
        window.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseout", handleMouseLeave);

        return () => {
            media.removeEventListener("change", updateDevice);
            window.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseout", handleMouseLeave);
            observer.disconnect();
        };
    }, [mouseX, mouseY]);

    const variants = useMemo(
        () => ({
            default: {
                ringSize: 32,
                dotSize: 8,
                trailSize: 54,
                ringOpacity: isDark ? 0.9 : 0.78,
                dotOpacity: isDark ? 1 : 0.96,
                trailOpacity: isDark ? 0.18 : 0.11,
                ringScale: 1,
                showLabel: false,
                label: "",
            },
            link: {
                ringSize: 56,
                dotSize: 10,
                trailSize: 78,
                ringOpacity: isDark ? 1 : 0.86,
                dotOpacity: 1,
                trailOpacity: isDark ? 0.24 : 0.14,
                ringScale: 1.06,
                showLabel: false,
                label: "",
            },
            card: {
                ringSize: 82,
                dotSize: 10,
                trailSize: 120,
                ringOpacity: isDark ? 0.98 : 0.9,
                dotOpacity: 1,
                trailOpacity: isDark ? 0.28 : 0.18,
                ringScale: 1.1,
                showLabel: true,
                label: "View",
            },
            text: {
                ringSize: 22,
                dotSize: 6,
                trailSize: 38,
                ringOpacity: isDark ? 0.6 : 0.42,
                dotOpacity: isDark ? 0.95 : 0.88,
                trailOpacity: isDark ? 0.12 : 0.06,
                ringScale: 0.92,
                showLabel: false,
                label: "",
            },
            hidden: {
                ringSize: 0,
                dotSize: 0,
                trailSize: 0,
                ringOpacity: 0,
                dotOpacity: 0,
                trailOpacity: 0,
                ringScale: 0.5,
                showLabel: false,
                label: "",
            },
        }),
        [isDark]
    );

    if (!isDesktop) return null;

    const current = variants[variant];

    const trailStyle = isDark
        ? {
            background:
                "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.03) 60%, transparent 100%)",
            boxShadow:
                "0 0 38px rgba(255,255,255,0.16), 0 0 80px rgba(255,255,255,0.08)",
        }
        : {
            background:
                "radial-gradient(circle, rgba(196,144,160,0.20) 0%, rgba(181,126,145,0.12) 36%, rgba(181,126,145,0.05) 62%, transparent 100%)",
            boxShadow:
                "0 0 24px rgba(181,126,145,0.14), 0 0 56px rgba(196,144,160,0.10)",
        };

    const ringStyle = isDark
        ? {
            border: "1px solid rgba(255,255,255,0.82)",
            background:
                "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0.02) 72%, transparent 100%)",
            boxShadow:
                "0 0 18px rgba(255,255,255,0.26), 0 0 42px rgba(255,255,255,0.16), inset 0 0 12px rgba(255,255,255,0.08)",
        }
        : {
            border: "1px solid rgba(181,126,145,0.72)",
            background:
                "radial-gradient(circle, rgba(214,186,196,0.16) 0%, rgba(196,144,160,0.09) 42%, rgba(181,126,145,0.03) 70%, transparent 100%)",
            boxShadow:
                "0 0 14px rgba(181,126,145,0.14), 0 0 34px rgba(181,126,145,0.10), inset 0 0 10px rgba(255,255,255,0.08)",
        };

    const dotStyle = isDark
        ? {
            background: "#ffffff",
            boxShadow: "0 0 14px rgba(255,255,255,0.95)",
        }
        : {
            background: "#b57e91",
            boxShadow: "0 0 10px rgba(181,126,145,0.34)",
        };

    const labelStyle = isDark
        ? {
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
        }
        : {
            background: "rgba(248,241,243,0.92)",
            color: "rgba(101,72,82,0.96)",
            border: "1px solid rgba(196,144,160,0.36)",
            boxShadow: "0 8px 20px rgba(181,126,145,0.10)",
        };

    return (
        <>
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9997]"
                style={{
                    x: trailX,
                    y: trailY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: current.trailSize,
                    height: current.trailSize,
                    opacity: isVisible ? current.trailOpacity : 0,
                    scale: current.ringScale,
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                }}
            >
                <div
                    className="h-full w-full rounded-full"
                    style={{
                        ...trailStyle,
                        filter: "blur(2px)",
                    }}
                />
            </motion.div>

            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9998]"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    mixBlendMode: isDark ? "screen" : "normal",
                }}
                animate={{
                    width: current.ringSize,
                    height: current.ringSize,
                    opacity: isVisible ? current.ringOpacity : 0,
                    scale: current.ringScale,
                }}
                transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 24,
                }}
            >
                <div
                    className="relative h-full w-full rounded-full"
                    style={{
                        ...ringStyle,
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2"
                        style={{ y: "155%" }}
                        animate={{
                            opacity: current.showLabel && isVisible ? 1 : 0,
                            scale: current.showLabel && isVisible ? 1 : 0.92,
                            y: current.showLabel && isVisible ? "145%" : "155%",
                        }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
                            style={labelStyle}
                        >
                            {current.label}
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999]"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: current.dotSize,
                    height: current.dotSize,
                    opacity: isVisible ? current.dotOpacity : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 32,
                }}
            >
                <div className="h-full w-full rounded-full" style={dotStyle} />
            </motion.div>
        </>
    );
}