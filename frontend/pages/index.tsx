/* pages/index.tsx */
'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function MainPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mounted, setMounted] = useState(false);

    const title = 'Visual Circuit Designer';

    /* --------- плавное появление левой колонки --------- */
    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 150);
        return () => clearTimeout(id);
    }, []);

    /* ---------- анимация «электрических» частиц ---------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
        }

        const particles: Particle[] = Array.from({ length: 80 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            /* точки */
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

            /* линии */
            ctx.strokeStyle = 'rgba(100,150,255,0.1)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* --------------------------- разметка --------------------------- */
    return (
        <>
            {/* подключаем Nunito локально */}
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className={`
          relative w-full h-screen overflow-hidden bg-[#f9fafb]
          flex items-center justify-center lg:justify-between px-8
        `}
            >
                <canvas ref={canvasRef} className="absolute inset-0 z-0" />

                {/* -------- левая колонка -------- */}
                <div className="relative z-10 flex flex-col items-start text-left space-y-5 max-w-[620px]">
                    <p
                        className={`
                            text-[80px] font-extrabold leading-[88px]
                            [font-family:'Nunito',_sans-serif]
                            transition-all duration-700 ease-out will-change-[opacity,transform]
                            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                      `}
                    >
                      <span className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] bg-clip-text text-transparent">
                        {title}
                      </span>
                    </p>

                    <p
                        className={`
              text-xl font-medium text-[#808080]
              [font-family:'Nunito',_sans-serif]
              transition-all duration-700 ease-out delay-150 will-change-[opacity,transform]
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
                    >
                        Streamlined platform for designing and compiling&nbsp;digital&nbsp;circuits
                        directly in&nbsp;the&nbsp;browser
                    </p>

                    <Link href="/login">
                        <div
                            className={`
                bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5]
                text-white text-[26px] w-[242px] h-[57px]
                font-bold rounded-xl shadow-md cursor-pointer
                flex items-center justify-center
                animate-pulse-gradient transition-all duration-75 ease-in-out
                will-change-[opacity,transform] delay-300
                ${mounted ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-2'}
                [font-family:'Nunito',_sans-serif]
              `}
                        >
                            Let’s design!
                        </div>
                    </Link>
                </div>

                {/* -------- правый логотип c переливом -------- */}
                <div className="relative z-10 hidden lg:block lg:translate-x-16">
                    <div
                        className="logo-anim w-[580px] h-[580px]"
                        aria-label="Visual Circuit Designer logo"
                    />
                </div>
            </div>

            {/* локальные стили: перелив градиента через mask */}
            <style jsx>{`
        @keyframes gradientShift {
          0%   { background-position:   0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position:   0% 50%; }
        }

        .logo-anim {
          /* 1. анимируемый фон-градиент */
          background: linear-gradient(45deg, #1c3bd5 0%, #63cbff 50%, #1c3bd5 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease-in-out infinite;

          /* 2. SVG-маска: показываем фон только внутри контура логотипа */
          mask:         url('/Icons/Logos/logo-blue.svg') center / contain no-repeat;
          -webkit-mask: url('/Icons/Logos/logo-blue.svg') center / contain no-repeat;
        }
      `}</style>
        </>
    );
}
