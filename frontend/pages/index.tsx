<<<<<<< HEAD
'use client';


import {useEffect, useRef, useState} from 'react';
=======
'use client';  // для Next.js App Router

import { useEffect, useRef, useState } from 'react';
>>>>>>> develop
import Link from 'next/link';

export default function MainPage() {
    const [typedText, setTypedText] = useState('');
<<<<<<< HEAD
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
=======
    const canvasRef = useRef(null);
>>>>>>> develop
    const fullText = 'Visual Circuit Designer';

    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            setTypedText(fullText.substring(0, index + 1));
            index++;
            if (index === fullText.length) {
                clearInterval(typingInterval);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, []);

<<<<<<< HEAD

    // Анимация точек/линий (эффект "электрической цепи")
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')
        if (!ctx) return;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
        }

        const particles: Particle[] = Array.from({length: 80}, () => ({
=======
    // Анимация точек/линий (эффект "электрической цепи")
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = Array.from({ length: 80 }, () => ({
>>>>>>> develop
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        }));
<<<<<<< HEAD
=======

>>>>>>> develop
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(100,150,255,0.2)';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.strokeStyle = 'rgba(100,150,255,0.1)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
<<<<<<< HEAD
=======

>>>>>>> develop
            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#f9fafb] flex items-center justify-center">
<<<<<<< HEAD
            <canvas ref={canvasRef} className="absolute inset-0 z-0"/>
            {/* Контент */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 animate-fade-in-slide">
                <p className="text-[80px] font-bold text-center text-[#262626]">
                    <span
                        className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] bg-clip-text text-transparent inline-block">
=======
            {/* Фоновый Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Контент */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 animate-fade-in-slide">
                <p className="text-[80px] font-bold text-center text-[#262626]">
                    <span className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] bg-clip-text text-transparent inline-block">
>>>>>>> develop
                        {typedText}
                    </span>
                </p>

                <p className="text-2xl font-medium text-center text-[#808080] max-w-[700px]">
                    Streamlined platform for designing and compiling digital circuits directly in the browser
                </p>

                <Link href="/login">
                    <div
                        className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] text-white text-[26px] w-[242px] h-[57px]
                        font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center
                        animate-pulse-gradient transition-all duration-500 ease-in-out"
                    >
                        <span>Let’s design!</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
