/* pages/index.tsx */
'use client';

import Head from 'next/head';
import Link from 'next/link';

export default function MainPage() {
  const title = 'Visual Circuit Designer';
  const subtitle =
    'A streamlined web platform for designing and compiling digital logic circuits.';

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
        <title>Visual Circuit Designer</title>
      </Head>

      <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
        {/* Animated blue gradient background */}
        <div className="absolute inset-0 z-0 animate-gradientMove bg-gradient-to-br from-[#0099FF] via-[#fff] to-[#0099FF] opacity-20" />

        {/* Animated Logo */}
        <div className="z-10 flex flex-col items-center">
          <div className="mb-8 animate-logoFadeIn">
            <img
              src="/Icons/Logos/VCD-Logo.svg"
              alt="Visual Circuit Designer logo"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>

          <h1
            className="text-[48px] md:text-[64px] font-extrabold text-center leading-tight [font-family:'Nunito',_sans-serif] text-[#222] mb-4"
          >
            <span className="bg-gradient-to-r from-[#0099FF] to-[#63CBFF] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-[#555] text-center max-w-xl mb-8 [font-family:'Nunito',_sans-serif]">
            {subtitle}
          </p>

          <Link href="/login">
            <div
              className="bg-[#0099FF] hover:bg-[#007acc] transition-colors duration-200 text-white text-xl px-10 py-4 rounded-xl font-bold shadow-lg cursor-pointer [font-family:'Nunito',_sans-serif] focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:ring-offset-2"
              tabIndex={0}
            >
              Let’s design!
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white flex flex-col items-center w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-[#0099FF] [font-family:'Nunito',_sans-serif]">Why Choose Visual Circuit Designer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          {/* Feature Card 1 */}
          <div className="feature-card animate-fadeInUp">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0099FF] bg-opacity-10 mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" stroke="#0099FF" strokeWidth="3"/><path d="M10 16l4 4 8-8" stroke="#0099FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#222]">Intuitive Interface</h3>
            <p className="text-[#555]">Design logic circuits visually with drag-and-drop simplicity. No steep learning curve.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="feature-card animate-fadeInUp delay-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0099FF] bg-opacity-10 mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="5" stroke="#0099FF" strokeWidth="3"/><path d="M10 16h12" stroke="#0099FF" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#222]">Real-Time Simulation</h3>
            <p className="text-[#555]">Instantly see how your circuits behave, with live feedback and error checking.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="feature-card animate-fadeInUp delay-200">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0099FF] bg-opacity-10 mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 6v20M6 16h20" stroke="#0099FF" strokeWidth="3" strokeLinecap="round"/><circle cx="16" cy="16" r="14" stroke="#0099FF" strokeWidth="3"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#222]">Export & Share</h3>
            <p className="text-[#555]">Save, export, and share your designs easily. Collaborate with your team in the cloud.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 bg-[#F7FBFF] flex flex-col items-center w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-[#0099FF] [font-family:'Nunito',_sans-serif]">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl w-full px-4">
          {/* Step 1 */}
          <div className="how-step animate-fadeInUp">
            <div className="step-circle">1</div>
            <h4 className="font-bold text-lg mb-1 text-[#222]">Create</h4>
            <p className="text-[#555] text-center">Start a new project and drag components onto the canvas.</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:block text-[#0099FF] text-3xl">→</div>
          {/* Step 2 */}
          <div className="how-step animate-fadeInUp delay-100">
            <div className="step-circle">2</div>
            <h4 className="font-bold text-lg mb-1 text-[#222]">Simulate</h4>
            <p className="text-[#555] text-center">Test your logic in real time and debug instantly.</p>
          </div>
          <div className="hidden md:block text-[#0099FF] text-3xl">→</div>
          {/* Step 3 */}
          <div className="how-step animate-fadeInUp delay-200">
            <div className="step-circle">3</div>
            <h4 className="font-bold text-lg mb-1 text-[#222]">Export</h4>
            <p className="text-[#555] text-center">Download or share your finished circuit with a click.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-16 bg-white flex flex-col items-center w-full">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#0099FF] [font-family:'Nunito',_sans-serif]">Ready to start designing?</h2>
        <Link href="/login">
          <div
            className="bg-[#0099FF] hover:bg-[#007acc] transition-colors duration-200 text-white text-lg px-8 py-3 rounded-xl font-bold shadow-lg cursor-pointer [font-family:'Nunito',_sans-serif] focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:ring-offset-2 animate-fadeInUp"
            tabIndex={0}
          >
            Let’s design!
          </div>
        </Link>
      </section>

      {/* Animations and custom styles */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes logoFadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-logoFadeIn {
          animation: logoFadeIn 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s both;
        }
        /* Feature cards animation */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-100 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.3s; }
        .feature-card {
          background: #fff;
          border-radius: 1.25rem;
          box-shadow: 0 4px 24px 0 rgba(0,153,255,0.08);
          padding: 2rem 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .feature-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 8px 32px 0 rgba(0,153,255,0.16);
        }
        .how-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fff;
          border-radius: 1.25rem;
          box-shadow: 0 2px 12px 0 rgba(0,153,255,0.06);
          padding: 1.5rem 1.25rem;
          min-width: 180px;
          max-width: 220px;
        }
        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0099FF 60%, #63CBFF 100%);
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 8px 0 rgba(0,153,255,0.10);
        }
      `}</style>
    </>
  );
}
