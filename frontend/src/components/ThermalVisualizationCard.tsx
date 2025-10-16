import { ArrowRight } from "lucide-react";
import { useState, useRef } from "react";

const ThermalVisualizationCard = () => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <div className="relative w-[370px] max-w-md mx-auto  mt-0" style={{ perspective: "1000px" }}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative transition-transform duration-200 ease-out"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d"
                }}
            >
                {/* 🔥 Glowy blurred border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/60 via-white/40 to-white/60 blur-2xl opacity-40 pointer-events-none"></div>

                {/* Main thermal visualization card */}
                <div className="relative bg-gradient-to-b from-black/60 via-background/70 to-black/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,150,50,0.1)] h-[420px] flex flex-col justify-between overflow-hidden">

                    {/* Inner subtle glow ring */}
                    <div className="absolute inset-0 rounded-2xl border border-white/20 opacity-40 pointer-events-none" />

                    {/* Before/After comparison */}
                    <div className="space-y-4">
                        {/* Before */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm font-medium">Low Resolution (Input)</span>
                                <span className="text-white/40 text-xs font-mono">5m/pixel</span>
                            </div>
                            <div className="h-24 bg-gradient-to-br from-[hsl(14,100%,57%)]/20 via-[hsl(28,100%,50%)]/20 to-[hsl(200,80%,50%)]/20 rounded-lg border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:20px_20px]"></div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-[hsl(14,100%,67%)] via-[hsl(28,100%,60%)] to-[hsl(45,100%,60%)] p-2 rounded-full">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* After */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium text-sm">Super-Resolved (Output)</span>
                                <span className="text-[hsl(45,100%,60%)] text-xs font-mono">0.5m/pixel</span>
                            </div>
                            <div className="h-24 bg-gradient-to-br from-[hsl(14,100%,57%)] via-[hsl(28,100%,50%)] to-[hsl(200,80%,50%)] rounded-lg border border-white/20 relative overflow-hidden shadow-[0_0_30px_rgba(255,87,34,0.3)]">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[length:8px_8px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-xl font-bold text-[hsl(45,100%,60%)] mb-1">42.3 dB</div>
                            <div className="text-xs text-white/60">PSNR</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[hsl(45,100%,60%)] mb-1">0.96</div>
                            <div className="text-xs text-white/60">SSIM</div>
                        </div>
                    </div>
                </div>

                {/* Floating tech badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[hsl(125,10%,75%)] to-[hsl(28,25%,81%)] text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                    AI-Powered
                </div>
            </div>
        </div>
    );
};

export default ThermalVisualizationCard;
