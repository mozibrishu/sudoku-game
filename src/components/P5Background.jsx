import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Background = ({ gameState, isActive = true }) => {
  const sketchRef = useRef();
  const p5Instance = useRef();

  useEffect(() => {
    if (!isActive) return;

    const sketch = (p) => {
      let particles = [];
      let colorPalette = [];
      let time = 0;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        canvas.style('pointer-events', 'none');
        
        // Create a warm, wood-inspired color palette with vibrant accents
        colorPalette = [
          p.color(255, 193, 7, 100),   // Amber
          p.color(255, 152, 0, 100),   // Orange
          p.color(139, 69, 19, 80),    // Saddle Brown
          p.color(205, 133, 63, 90),   // Peru
          p.color(222, 184, 135, 70),  // Burlywood
          p.color(255, 215, 0, 120),   // Gold
          p.color(255, 140, 0, 110),   // Dark Orange
          p.color(178, 34, 34, 60),    // Fire Brick (accent)
          p.color(50, 205, 50, 80),    // Lime Green (accent)
          p.color(30, 144, 255, 90)    // Dodger Blue (accent)
        ];

        // Initialize particles
        for (let i = 0; i < 50; i++) {
          particles.push(createParticle(p));
        }
      };

      const createParticle = (p) => {
        return {
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5),
          size: p.random(3, 12),
          color: p.random(colorPalette),
          life: p.random(100, 255),
          maxLife: 255,
          rotation: p.random(p.TWO_PI),
          rotationSpeed: p.random(-0.02, 0.02),
          pulseSpeed: p.random(0.01, 0.03),
          pulseOffset: p.random(p.TWO_PI)
        };
      };

      p.draw = () => {
        // Create gradient background
        drawGradientBackground(p);
        
        time += 0.01;
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          let particle = particles[i];
          updateParticle(p, particle);
          drawParticle(p, particle);
          
          // Remove dead particles and create new ones
          if (particle.life <= 0) {
            particles.splice(i, 1);
            particles.push(createParticle(p));
          }
        }
        
        // Draw floating geometric shapes
        drawFloatingShapes(p);
        
        // Add subtle grid pattern
        if (gameState === 'playing') {
          drawSubtleGrid(p);
        }
      };

      const drawGradientBackground = (p) => {
        // Create animated gradient background
        for (let y = 0; y < p.height; y += 2) {
          let inter = p.map(y, 0, p.height, 0, 1);
          let wave = p.sin(time + y * 0.01) * 0.1;
          inter += wave;
          
          let c1 = p.color(252, 248, 227); // Light cream
          let c2 = p.color(245, 222, 179); // Wheat
          let c3 = p.color(238, 203, 173); // Peach Puff
          
          let c = p.lerpColor(c1, p.lerpColor(c2, c3, inter), inter);
          p.stroke(c);
          p.line(0, y, p.width, y);
        }
      };

      const updateParticle = (p, particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.life -= 0.5;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = p.width;
        if (particle.x > p.width) particle.x = 0;
        if (particle.y < 0) particle.y = p.height;
        if (particle.y > p.height) particle.y = 0;
        
        // Add some drift based on time
        particle.vx += p.sin(time + particle.x * 0.01) * 0.001;
        particle.vy += p.cos(time + particle.y * 0.01) * 0.001;
      };

      const drawParticle = (p, particle) => {
        p.push();
        p.translate(particle.x, particle.y);
        p.rotate(particle.rotation);
        
        // Pulsing effect
        let pulse = p.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7;
        let size = particle.size * pulse;
        
        // Set alpha based on life
        let alpha = p.map(particle.life, 0, particle.maxLife, 0, 255);
        particle.color.setAlpha(alpha);
        
        p.fill(particle.color);
        p.noStroke();
        
        // Draw different shapes based on particle properties
        let shapeType = Math.floor(particle.size) % 4;
        switch (shapeType) {
          case 0:
            p.ellipse(0, 0, size);
            break;
          case 1:
            p.rect(-size/2, -size/2, size, size);
            break;
          case 2:
            drawStar(p, 0, 0, size/2, size/4, 5);
            break;
          case 3:
            drawDiamond(p, 0, 0, size);
            break;
        }
        
        p.pop();
      };

      const drawStar = (p, x, y, radius1, radius2, npoints) => {
        let angle = p.TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        p.beginShape();
        for (let a = 0; a < p.TWO_PI; a += angle) {
          let sx = x + p.cos(a) * radius2;
          let sy = y + p.sin(a) * radius2;
          p.vertex(sx, sy);
          sx = x + p.cos(a + halfAngle) * radius1;
          sy = y + p.sin(a + halfAngle) * radius1;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      };

      const drawDiamond = (p, x, y, size) => {
        p.beginShape();
        p.vertex(x, y - size/2);
        p.vertex(x + size/2, y);
        p.vertex(x, y + size/2);
        p.vertex(x - size/2, y);
        p.endShape(p.CLOSE);
      };

      const drawFloatingShapes = (p) => {
        p.push();
        p.noFill();
        p.strokeWeight(1);
        
        for (let i = 0; i < 5; i++) {
          let x = p.width * 0.2 + p.sin(time + i) * p.width * 0.6;
          let y = p.height * 0.3 + p.cos(time * 0.7 + i * 2) * p.height * 0.4;
          let size = 30 + p.sin(time * 2 + i) * 20;
          
          let alpha = 30 + p.sin(time + i) * 20;
          p.stroke(139, 69, 19, alpha);
          
          p.push();
          p.translate(x, y);
          p.rotate(time + i);
          p.rect(-size/2, -size/2, size, size);
          p.pop();
        }
        p.pop();
      };

      const drawSubtleGrid = (p) => {
        p.push();
        p.stroke(139, 69, 19, 15);
        p.strokeWeight(0.5);
        
        let spacing = 50;
        for (let x = 0; x < p.width; x += spacing) {
          p.line(x, 0, x, p.height);
        }
        for (let y = 0; y < p.height; y += spacing) {
          p.line(0, y, p.width, y);
        }
        p.pop();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    if (sketchRef.current) {
      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [gameState, isActive]);

  if (!isActive) return null;

  return <div ref={sketchRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default P5Background;

