import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5SudokuEffects = ({ 
  board, 
  selectedCell, 
  lastMove, 
  isComplete, 
  containerRef,
  onEffectComplete 
}) => {
  const sketchRef = useRef();
  const p5Instance = useRef();
  const effectsQueue = useRef([]);

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];
      let ripples = [];
      let sparkles = [];
      let completionFireworks = [];
      let time = 0;

      p.setup = () => {
        if (!containerRef?.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const canvas = p.createCanvas(rect.width, rect.height);
        canvas.style('position', 'absolute');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('pointer-events', 'none');
        canvas.style('z-index', '10');
      };

      p.draw = () => {
        p.clear();
        time += 0.016;

        // Update and draw all effects
        updateRipples(p);
        updateSparkles(p);
        updateParticles(p);
        updateCompletionFireworks(p);

        // Draw selection glow
        if (selectedCell && containerRef?.current) {
          drawSelectionGlow(p, selectedCell);
        }

        // Process effects queue
        processEffectsQueue(p);
      };

      const processEffectsQueue = (p) => {
        while (effectsQueue.current.length > 0) {
          const effect = effectsQueue.current.shift();
          switch (effect.type) {
            case 'numberPlace':
              createNumberPlaceEffect(p, effect.row, effect.col, effect.number);
              break;
            case 'completion':
              createCompletionEffect(p);
              break;
            case 'error':
              createErrorEffect(p, effect.row, effect.col);
              break;
            case 'hint':
              createHintEffect(p, effect.row, effect.col);
              break;
          }
        }
      };

      const getCellPosition = (row, col) => {
        if (!containerRef?.current) return { x: 0, y: 0 };
        
        const rect = containerRef.current.getBoundingClientRect();
        const cellSize = rect.width / 9;
        const padding = 4; // Account for border padding
        
        return {
          x: padding + col * cellSize + cellSize / 2,
          y: padding + row * cellSize + cellSize / 2,
          size: cellSize * 0.8
        };
      };

      const drawSelectionGlow = (p, cell) => {
        const pos = getCellPosition(cell.row, cell.col);
        
        p.push();
        p.translate(pos.x, pos.y);
        
        // Pulsing glow effect
        let glowIntensity = p.sin(time * 3) * 0.3 + 0.7;
        let glowSize = pos.size * (1 + glowIntensity * 0.2);
        
        // Multiple glow layers
        for (let i = 0; i < 3; i++) {
          let alpha = (30 - i * 8) * glowIntensity;
          let size = glowSize + i * 10;
          
          p.fill(255, 193, 7, alpha);
          p.noStroke();
          p.ellipse(0, 0, size);
        }
        
        p.pop();
      };

      const createNumberPlaceEffect = (p, row, col, number) => {
        const pos = getCellPosition(row, col);
        
        // Create ripple effect
        ripples.push({
          x: pos.x,
          y: pos.y,
          radius: 0,
          maxRadius: pos.size * 1.5,
          life: 60,
          color: p.color(50, 205, 50, 100)
        });

        // Create sparkle particles
        for (let i = 0; i < 8; i++) {
          sparkles.push({
            x: pos.x + p.random(-20, 20),
            y: pos.y + p.random(-20, 20),
            vx: p.random(-2, 2),
            vy: p.random(-3, -1),
            size: p.random(3, 8),
            life: 30,
            color: p.color(255, 215, 0, 200),
            rotation: p.random(p.TWO_PI),
            rotationSpeed: p.random(-0.1, 0.1)
          });
        }

        // Create number pop effect
        particles.push({
          x: pos.x,
          y: pos.y,
          scale: 0,
          targetScale: 1.5,
          life: 30,
          type: 'numberPop',
          number: number,
          color: p.color(50, 205, 50)
        });
      };

      const createErrorEffect = (p, row, col) => {
        const pos = getCellPosition(row, col);
        
        // Red shake effect
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: pos.x + p.random(-15, 15),
            y: pos.y + p.random(-15, 15),
            vx: p.random(-3, 3),
            vy: p.random(-3, 3),
            size: p.random(4, 10),
            life: 40,
            type: 'error',
            color: p.color(220, 20, 60, 150)
          });
        }

        // Error ripple
        ripples.push({
          x: pos.x,
          y: pos.y,
          radius: 0,
          maxRadius: pos.size,
          life: 30,
          color: p.color(220, 20, 60, 80)
        });
      };

      const createHintEffect = (p, row, col) => {
        const pos = getCellPosition(row, col);
        
        // Golden hint effect
        for (let i = 0; i < 12; i++) {
          let angle = (i / 12) * p.TWO_PI;
          sparkles.push({
            x: pos.x + p.cos(angle) * 20,
            y: pos.y + p.sin(angle) * 20,
            vx: p.cos(angle) * 1.5,
            vy: p.sin(angle) * 1.5,
            size: p.random(4, 8),
            life: 45,
            color: p.color(255, 215, 0, 200),
            rotation: angle,
            rotationSpeed: 0.05
          });
        }

        // Hint glow
        particles.push({
          x: pos.x,
          y: pos.y,
          scale: 0,
          targetScale: 2,
          life: 60,
          type: 'hintGlow',
          color: p.color(255, 215, 0, 100)
        });
      };

      const createCompletionEffect = (p) => {
        // Create fireworks across the board
        for (let i = 0; i < 20; i++) {
          let x = p.random(p.width * 0.2, p.width * 0.8);
          let y = p.random(p.height * 0.2, p.height * 0.8);
          
          completionFireworks.push({
            x: x,
            y: y,
            particles: [],
            life: 120,
            delay: i * 3
          });

          // Create firework particles
          for (let j = 0; j < 15; j++) {
            let angle = (j / 15) * p.TWO_PI;
            let speed = p.random(2, 6);
            
            completionFireworks[i].particles.push({
              x: x,
              y: y,
              vx: p.cos(angle) * speed,
              vy: p.sin(angle) * speed,
              size: p.random(3, 8),
              life: 60,
              color: p.random([
                p.color(255, 215, 0),
                p.color(255, 20, 147),
                p.color(50, 205, 50),
                p.color(30, 144, 255),
                p.color(255, 69, 0)
              ])
            });
          }
        }

        // Trigger completion callback
        if (onEffectComplete) {
          setTimeout(() => onEffectComplete('completion'), 2000);
        }
      };

      const updateRipples = (p) => {
        for (let i = ripples.length - 1; i >= 0; i--) {
          let ripple = ripples[i];
          ripple.radius += (ripple.maxRadius - ripple.radius) * 0.1;
          ripple.life--;
          
          if (ripple.life > 0) {
            let alpha = p.map(ripple.life, 0, 60, 0, 100);
            ripple.color.setAlpha(alpha);
            
            p.push();
            p.noFill();
            p.stroke(ripple.color);
            p.strokeWeight(2);
            p.ellipse(ripple.x, ripple.y, ripple.radius * 2);
            p.pop();
          } else {
            ripples.splice(i, 1);
          }
        }
      };

      const updateSparkles = (p) => {
        for (let i = sparkles.length - 1; i >= 0; i--) {
          let sparkle = sparkles[i];
          sparkle.x += sparkle.vx;
          sparkle.y += sparkle.vy;
          sparkle.vy += 0.1; // gravity
          sparkle.rotation += sparkle.rotationSpeed;
          sparkle.life--;
          
          if (sparkle.life > 0) {
            let alpha = p.map(sparkle.life, 0, 30, 0, 200);
            sparkle.color.setAlpha(alpha);
            
            p.push();
            p.translate(sparkle.x, sparkle.y);
            p.rotate(sparkle.rotation);
            p.fill(sparkle.color);
            p.noStroke();
            p.star(0, 0, sparkle.size/2, sparkle.size, 5);
            p.pop();
          } else {
            sparkles.splice(i, 1);
          }
        }
      };

      const updateParticles = (p) => {
        for (let i = particles.length - 1; i >= 0; i--) {
          let particle = particles[i];
          particle.life--;
          
          if (particle.life > 0) {
            if (particle.type === 'numberPop') {
              particle.scale += (particle.targetScale - particle.scale) * 0.1;
              
              p.push();
              p.translate(particle.x, particle.y);
              p.scale(particle.scale);
              p.fill(particle.color);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(24);
              p.text(particle.number, 0, 0);
              p.pop();
              
            } else if (particle.type === 'hintGlow') {
              particle.scale += (particle.targetScale - particle.scale) * 0.05;
              let alpha = p.map(particle.life, 0, 60, 0, 100);
              particle.color.setAlpha(alpha);
              
              p.push();
              p.translate(particle.x, particle.y);
              p.fill(particle.color);
              p.noStroke();
              p.ellipse(0, 0, 40 * particle.scale);
              p.pop();
              
            } else if (particle.type === 'error') {
              particle.x += particle.vx;
              particle.y += particle.vy;
              particle.vx *= 0.95;
              particle.vy *= 0.95;
              
              let alpha = p.map(particle.life, 0, 40, 0, 150);
              particle.color.setAlpha(alpha);
              
              p.push();
              p.fill(particle.color);
              p.noStroke();
              p.ellipse(particle.x, particle.y, particle.size);
              p.pop();
            }
          } else {
            particles.splice(i, 1);
          }
        }
      };

      const updateCompletionFireworks = (p) => {
        for (let i = completionFireworks.length - 1; i >= 0; i--) {
          let firework = completionFireworks[i];
          
          if (firework.delay > 0) {
            firework.delay--;
            continue;
          }
          
          firework.life--;
          
          for (let j = firework.particles.length - 1; j >= 0; j--) {
            let particle = firework.particles[j];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.vx *= 0.98; // air resistance
            particle.life--;
            
            if (particle.life > 0) {
              let alpha = p.map(particle.life, 0, 60, 0, 255);
              particle.color.setAlpha(alpha);
              
              p.push();
              p.fill(particle.color);
              p.noStroke();
              p.ellipse(particle.x, particle.y, particle.size);
              p.pop();
            } else {
              firework.particles.splice(j, 1);
            }
          }
          
          if (firework.life <= 0 || firework.particles.length === 0) {
            completionFireworks.splice(i, 1);
          }
        }
      };

      // Helper function to draw star
      p.star = function(x, y, radius1, radius2, npoints) {
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

      p.windowResized = () => {
        if (containerRef?.current) {
          const rect = containerRef.current.getBoundingClientRect();
          p.resizeCanvas(rect.width, rect.height);
        }
      };
    };

    if (sketchRef.current && containerRef?.current) {
      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [containerRef]);

  // Add effects to queue when props change
  useEffect(() => {
    if (lastMove) {
      effectsQueue.current.push({
        type: 'numberPlace',
        row: lastMove.row,
        col: lastMove.col,
        number: lastMove.number
      });
    }
  }, [lastMove]);

  useEffect(() => {
    if (isComplete) {
      effectsQueue.current.push({ type: 'completion' });
    }
  }, [isComplete]);

  // Public methods to trigger effects
  const triggerErrorEffect = (row, col) => {
    effectsQueue.current.push({ type: 'error', row, col });
  };

  const triggerHintEffect = (row, col) => {
    effectsQueue.current.push({ type: 'hint', row, col });
  };

  // Expose methods to parent component
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.triggerErrorEffect = triggerErrorEffect;
      containerRef.current.triggerHintEffect = triggerHintEffect;
    }
  }, []);

  return <div ref={sketchRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />;
};

export default P5SudokuEffects;

