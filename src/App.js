import React, { useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let paddle = { x: 340, y: 550, w: 120, h: 14, speed: 7 };
    let ball = { x: 400, y: 540, vx: 4, vy: -4, r: 10, stuck: true };
    let bricks = [];
    let particles = [];
    let rows = 6, cols = 10;
    let score = 0, displayScore = 0;
    let left = false, right = false;

    function initBricks() {
      bricks = [];
      for (let r = 0; r < rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < cols; c++) {
          bricks[r][c] = {
            x: c * 80,
            y: r * 25 + 50,
            w: 78,
            h: 20,
            hp: 1,
            alpha: 1
          };
        }
      }
    }
    initBricks();

    function spawnParticles(x, y) {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 30,
          color: `hsl(${Math.random() * 360},100%,60%)`
        });
      }
    }

    function update() {
      if (left) paddle.x -= paddle.speed;
      if (right) paddle.x += paddle.speed;
      paddle.x = Math.max(0, Math.min(800 - paddle.w, paddle.x));

      if (ball.stuck) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r;
      } else {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r < 0 || ball.x + ball.r > 800) ball.vx *= -1;
        if (ball.y - ball.r < 0) ball.vy *= -1;
        if (ball.y + ball.r > 600) {
          ball.stuck = true;
          score = 0;
          initBricks();
        }

        // Paddle collision
        if (
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.w &&
          ball.y + ball.r > paddle.y &&
          ball.y - ball.r < paddle.y + paddle.h
        ) {
          ball.vy *= -1;
          let hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          ball.vx = hitPos * 6;
        }

        // Brick collision
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let br = bricks[r][c];
            if (br.hp > 0) {
              if (
                ball.x > br.x &&
                ball.x < br.x + br.w &&
                ball.y > br.y &&
                ball.y < br.y + br.h
              ) {
                ball.vy *= -1;
                br.hp = 0;
                spawnParticles(ball.x, ball.y);
                score += 10;
              }
            } else if (br.alpha > 0) {
              br.alpha -= 0.05;
            }
          }
        }
      }

      // Animate score display
      displayScore += (score - displayScore) * 0.1;

      // Update particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });
      particles = particles.filter(p => p.life > 0);
    }

    function draw() {
      ctx.clearRect(0, 0, 800, 600);

      // Paddle with glow
      let paddleGrad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.w, paddle.y);
      paddleGrad.addColorStop(0, "#0ff");
      paddleGrad.addColorStop(1, "#0f0");
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#0ff";
      ctx.fillStyle = paddleGrad;
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.shadowBlur = 0;

      // Ball glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#fff";
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bricks with fade animation
      bricks.forEach(row =>
        row.forEach(br => {
          if (br.hp > 0 || br.alpha > 0) {
            ctx.globalAlpha = br.alpha;
            ctx.fillStyle = "#ff0066";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ff3399";
            ctx.fillRect(br.x, br.y, br.w, br.h);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          }
        })
      );

      // Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Score
      ctx.fillStyle = "#fff";
      ctx.font = "20px Orbitron, sans-serif";
      ctx.fillText("Score: " + Math.round(displayScore), 10, 25);
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();

    // Controls
    const handleKeyDown = e => {
      if (e.key === "ArrowLeft" || e.key === "a") left = true;
      if (e.key === "ArrowRight" || e.key === "d") right = true;
      if (e.key === " ") ball.stuck = false;
    };
    const handleKeyUp = e => {
      if (e.key === "ArrowLeft" || e.key === "a") left = false;
      if (e.key === "ArrowRight" || e.key === "d") right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="app-container">
      <h1>🌌 Neon Brick Breaker</h1>
      <div className="game-container">
        <canvas ref={canvasRef} width={800} height={600}></canvas>
      </div>
      <footer>
        <p>
          Use <b>← / →</b> or <b>A / D</b> to move | Press <b>Space</b> to launch
        </p>
      </footer>
    </div>
  );
}
