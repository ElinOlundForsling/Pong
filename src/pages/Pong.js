import React, { useState, useEffect, useRef } from 'react';
import '../stylesheets/pong.css';
import PongHeader from '../components/pong/PongHeader';
import PongSidebar from '../components/pong/PongSidebar';

const PongVanilla = () => {
  const ref = useRef();

  const [canvas, setCanvas] = useState({
    width: (window.innerWidth / 10) * 8.5,
    height: (window.innerHeight / 10) * 8,
  });
  const [net, setNet] = useState({
    x: canvas.width / 2 - 4 / 2,
    y: 0,
    width: 4,
    height: canvas.height,
    color: '#FFF',
  });

  useEffect(() => {
    setCanvas(ref.current);
    const tempCanvas = ref.current;
    let context = tempCanvas.getContext('2d');
    context.fillStyle = '#181818';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paddleWidth = 10;
  const paddleHeight = 100;

  const userVelocity = 6;

  const [user, setUser] = useState({
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    velocity: userVelocity,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0,
  });

  const [ai, setAi] = useState({
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    velocity: 8,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0,
  });

  // ball
  const [ball, setBall] = useState({
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#fff',
  });

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const bgColor = '#181818';
    const tempCanvas = ref.current;
    let context = tempCanvas.getContext('2d');
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (isActive) {
      // net
      context.fillStyle = net.color;
      context.fillRect(net.x, net.y, net.width, net.height);

      // userPaddle
      context.fillStyle = user.color;
      context.fillRect(user.x, user.y, user.width, user.height);

      // opponentPaddle
      context.fillStyle = ai.color;
      context.fillRect(ai.x, ai.y, ai.width, ai.height);

      // ball
      context.fillStyle = ball.color;
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    } else {
      // net
      context.fillStyle = bgColor;
      context.fillRect(net.x, net.y, net.width, net.height);

      // userPaddle
      context.fillStyle = bgColor;
      context.fillRect(user.x, user.y, user.width, user.height);

      // opponentPaddle
      context.fillStyle = bgColor;
      context.fillRect(ai.x, ai.y, ai.width, ai.height);

      // ball
      context.fillStyle = bgColor;
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();

      // rules
      context.fillStyle = '#fff';
      context.font = '40px Roboto, sans-serif';
      context.textAlign = 'center';
      context.fillText('PONG', canvas.width / 2, canvas.height / 2 - 100);

      context.fillStyle = '#fff';
      context.font = '30px Quicksand, sans-serif';
      context.textAlign = 'center';
      context.fillText(
        'Use your up and down buttons to control the left paddle',
        canvas.width / 2,
        canvas.height / 2,
      );
      context.fillStyle = '#fff';
      context.font = '30px Quicksand, sans-serif';
      context.textAlign = 'center';
      context.fillText(
        'Click space to start. Godspeed!',
        canvas.width / 2,
        canvas.height / 2 + 50,
      );
    }
  }, [seconds, isActive]);

  const [upArrowPressed, setUpArrowPressed] = useState(false);
  const [downArrowPressed, setDownArrowPressed] = useState(false);

  const keyDownHandler = event => {
    event.preventDefault();
    switch (event.keyCode) {
      case 38:
        setUpArrowPressed(true);
        break;
      case 40:
        setDownArrowPressed(true);
        break;
      case 32:
        toggle();
        break;
    }
  };

  const keyUpHandler = event => {
    event.preventDefault();
    switch (event.keyCode) {
      case 38:
        setUpArrowPressed(false);
        resetV();
        break;
      case 40:
        setDownArrowPressed(false);
        resetV();
        break;
    }
  };

  const onRestartClick = () => {
    setUser(user => ({
      ...user,
      score: 0,
    }));
    setAi(ai => ({
      ...ai,
      score: 0,
    }));
    reset();
  };

  const onPauseClick = () => {
    toggle();
  };

  const resetV = () => {
    setUser(user => ({
      ...user,
      velocity: userVelocity,
    }));
  };

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setBall(ball => ({
      ...ball,
      x: canvas.width / 2,
      y: canvas.height / 2,
      velocityX: 5,
      velocityY: 5,
      speed: 7,
    }));
  }

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    if (isActive) {
      const timer = window.setInterval(() => {
        setBall(ball => ({
          ...ball,
          x: ball.x + ball.velocityX,
          y: ball.y + ball.velocityY,
        }));
      }, 30);
      return () => {
        window.clearInterval(timer);
      };
    }
  }, [isActive]);

  const calculateVelocity = player => {
    let angle = 0;

    if (ball.y < player.y + player.height / 2) {
      angle = (-1 * Math.PI) / 4;
    } else if (ball.y > player.y + player.height / 2) {
      angle = Math.PI / 4;
    }

    setBall(ball => ({
      ...ball,
      velocityX: (player === user ? 1 : -1) * ball.speed * Math.cos(angle),
      velocityY: ball.speed * Math.sin(angle),
      speed: player === user ? ball.speed + player.velocity - 6 : ball.speed,
    }));
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (ball.y + ball.radius >= canvas.height) {
          setBall(ball => ({
            ...ball,
            velocityY: -Math.abs(ball.velocityY),
          }));
        } else if (ball.y - ball.radius <= 0) {
          setBall(ball => ({
            ...ball,
            velocityY: Math.abs(ball.velocityY),
          }));
        }
        if (ball.x + ball.radius >= canvas.width) {
          reset();
          setUser(user => ({
            ...user,
            score: user.score + 1,
          }));
          setBall(ball => ({
            ...ball,
            velocityX: -Math.abs(ball.velocityX),
          }));
        } else if (ball.x - ball.radius <= 0) {
          reset();
          setAi(ai => ({
            ...ai,
            score: ai.score + 1,
          }));
          setBall(ball => ({
            ...ball,
            velocityX: Math.abs(ball.velocityX),
          }));
        }
        if (
          ball.x - ball.radius <= 20 &&
          Math.abs(user.y + 50 - ball.y) < 50 + ball.radius
        ) {
          setBall(ball => ({
            ...ball,
            velocityX: Math.abs(ball.velocityX),
          }));
          calculateVelocity(user);
        } else if (
          ball.x + ball.radius >= canvas.width - 20 &&
          Math.abs(ai.y + 50 - ball.y) < 50 + ball.radius
        ) {
          setBall(ball => ({
            ...ball,
            velocityX: -Math.abs(ball.velocityX),
          }));
          calculateVelocity(ai);
        }
        if (upArrowPressed && user.y > 0) {
          setUser(user => ({
            ...user,
            velocity: user.velocity + 0.2,
            y: user.y - user.velocity,
          }));
        } else if (downArrowPressed && user.y < canvas.height - user.height) {
          setUser(user => ({
            ...user,
            velocity: user.velocity + 0.2,
            y: user.y + user.velocity,
          }));
        }
        setAi(ai => ({
          ...ai,
          y: (ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.06),
        }));
        setSeconds(seconds => seconds + 1);
      }, 10);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <main className='pong-game'>
      <PongHeader userScore={user.score} opponentScore={ai.score} />
      <PongSidebar
        onPauseClick={onPauseClick}
        onRestartClick={onRestartClick}
      />
      <canvas
        className='pong-board'
        ref={ref}
        id='canvas'
        width={canvas.width}
        height={canvas.height}></canvas>
    </main>
  );
};

export default PongVanilla;
