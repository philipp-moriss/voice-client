import { useEffect, useRef } from 'react';
import styles from './NotFoundPage.module.css';

interface WordItem {
  x: number;
  y: number;
  text: string;
  size: number;
}

function random(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
}

function rangeMap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const NotFoundPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keypressRef = useRef(false);
  const wordArrRef = useRef<WordItem[]>([]);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Установка размеров canvas
    const updateCanvasSize = () => {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      canvas.width = widthRef.current;
      canvas.height = heightRef.current;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Инициализация массива слов
    const txtMinSize = 5;
    const txtMaxSize = 25;
    const wordArr: WordItem[] = [];

    for (let i = 0; i < 25; i++) {
      wordArr.push({
        x: random(0, widthRef.current),
        y: random(0, heightRef.current),
        text: '404',
        size: random(txtMinSize, txtMaxSize),
      });

      wordArr.push({
        x: random(0, widthRef.current),
        y: random(0, heightRef.current),
        text: 'page',
        size: random(txtMinSize, txtMaxSize),
      });

      wordArr.push({
        x: random(0, widthRef.current),
        y: random(0, heightRef.current),
        text: 'not found',
        size: random(txtMinSize, txtMaxSize),
      });

      wordArr.push({
        x: random(0, widthRef.current),
        y: random(0, heightRef.current),
        text: '404',
        size: Math.floor(random(txtMinSize, txtMaxSize)),
      });
    }

    wordArrRef.current = wordArr;

    // Функция рендеринга
    const render = () => {
      const width = widthRef.current;
      const height = heightRef.current;
      const accelerate = 2;
      const txtMinSize = 5;
      const txtMaxSize = 25;

      // Очистка canvas
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, width, height);

      // Рендеринг текста
      ctx.fillStyle = '#fff';
      for (let i = 0; i < wordArrRef.current.length; i++) {
        const word = wordArrRef.current[i];
        ctx.font = `${word.size}px sans-serif`;
        const textWidth = ctx.measureText(word.text).width;
        ctx.fillText(word.text, word.x, word.y);

        // Движение текста
        if (keypressRef.current) {
          word.x +=
            rangeMap(word.size, txtMinSize, txtMaxSize, 2, 4) * accelerate;
        } else {
          word.x += rangeMap(word.size, txtMinSize, txtMaxSize, 2, 3);
        }

        // Перемещение текста в начало при достижении края
        if (word.x >= width) {
          word.x = -textWidth * 2;
          word.y = random(0, height);
          word.size = Math.floor(random(txtMinSize, txtMaxSize));
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Обработчики событий клавиатуры
    const handleKeyDown = () => {
      keypressRef.current = true;
    };

    const handleKeyUp = () => {
      keypressRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    // Очистка
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

