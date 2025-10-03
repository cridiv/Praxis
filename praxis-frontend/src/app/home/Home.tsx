'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, BookOpen, Zap } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUploadClick = () => {
    router.push('/dashboard');
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);

    // Particle network system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      
      constructor() {
        // Use non-null assertion since we already checked canvas exists
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.fill();
      }
    }

    interface ParticleArray extends Array<Particle> {}
    const particles: ParticleArray = [];
    const particleCount = 120;
    const connectionDistance = 180;
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-orange-50/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 lg:pt-10">
        {/* Move navbar outside the centered flex container */}
        <nav className="relative z-20 w-full mb-16">
          <div className="flex items-center justify-between w-full">
            {/* Logo - Far left */}
            <div className="text-2xl font-bold text-gray-900 flex-shrink-0">
              Praxis
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <a href="#about" className="text-gray-700 hover:text-black font-medium transition-colors">
                About Us
              </a>
              <a href="#demo" className="text-gray-700 hover:text-black font-medium transition-colors">
                Demo
              </a>
              <a href="#company" className="text-gray-700 hover:text-black font-medium transition-colors">
                Company
              </a>
            </div>

            {/* Sign In Button - Far right */}
            <button className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0">
              Sign In
            </button>
          </div>
        </nav>

        <div className="flex justify-center items-center min-h-[60vh]">
          {/* Centered Content */}
          <div className="space-y-8 text-center max-w-4xl">

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Validate & Classify Your Data{' '}
              <span className="bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
                Seamlessly
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Upload datasets, apply rules, and get instant quality insights. Transform raw data into trusted intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <button onClick={handleUploadClick} className="group px-8 py-4 bg-black hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Upload Your Dataset
              </button>

              <button className="px-8 py-4 bg-white border-2 border-black text-black hover:bg-orange-50 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105">
                <BookOpen className="w-5 h-5" />
                See Docs
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Enterprise Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}