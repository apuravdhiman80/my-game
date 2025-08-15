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
    let rows = 6, cols = 10;
    let score = 0;
    let left = false, right = false;

    function initBricks() {
      bricks = [];
      for (let r = 0; r < rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < cols; c++) {
          bricks[r][c] = { x: c * 80, y: r * 25 + 50, w: 78, h: 20, hp: 1 };
        }
      }
    }
    initBricks();

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
                score += 10;
              }
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, 800, 600);
      // Paddle
      ctx.fillStyle = "#4cafef";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      // Ball
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      // Bricks
      bricks.forEach(row =>
        row.forEach(br => {
          if (br.hp > 0) {
            ctx.fillStyle = "#ff9966";
            ctx.fillRect(br.x, br.y, br.w, br.h);
          }
        })
      );
      // Score
      ctx.fillStyle = "white";
      ctx.font = "18px sans-serif";
      ctx.fillText("Score: " + score, 10, 20);
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
      <h1>🎯 Brick Breaker Deluxe</h1>
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
