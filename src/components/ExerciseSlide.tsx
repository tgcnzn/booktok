import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Play, CheckCircle, Timer, SkipForward } from 'lucide-react';
import type { Exercise } from '../data/workouts';
import YouTubeBackground from './YouTubeBackground';

type Phase = 'idle' | 'exercising' | 'resting' | 'ready' | 'done';

const REST_SECONDS = 90;

interface Props {
  exercise: Exercise;
  index: number;
  total: number;
  workoutColor: string;
  workoutLetter: string;
}

export default function ExerciseSlide({ exercise, index, total, workoutColor, workoutLetter }: Props) {
  const [currentSet, setCurrentSet] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [restTime, setRestTime] = useState(REST_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const startExercise = () => {
    setCurrentSet(0);
    setPhase('exercising');
  };

  const finishSet = () => {
    const isLastSet = currentSet >= exercise.reps.length - 1;
    if (isLastSet) {
      setPhase('done');
      clearTimer();
      return;
    }
    setPhase('resting');
    setRestTime(REST_SECONDS);
    intervalRef.current = setInterval(() => {
      setRestTime((t) => {
        if (t <= 1) {
          clearTimer();
          setPhase('ready');
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const nextSet = () => {
    setCurrentSet((s) => s + 1);
    setPhase('exercising');
  };

  const skipRest = () => {
    clearTimer();
    setPhase('ready');
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const restProgress = 1 - restTime / REST_SECONDS;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="snap-item relative flex flex-col justify-end overflow-hidden">
      <YouTubeBackground videoId={exercise.youtubeId} />

      <div className="relative z-10 p-6 pb-10">
        {/* Exercise counter */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: workoutColor, color: '#fff' }}
          >
            TREINO {workoutLetter}
          </span>
          <span className="text-sm text-gray-300">
            {index + 1} / {total}
          </span>
          {phase !== 'idle' && phase !== 'done' && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              Série {currentSet + 1}/{exercise.reps.length}
            </span>
          )}
        </div>

        {/* Exercise name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2 text-3xl font-black uppercase leading-tight text-white"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
        >
          {exercise.name}
        </motion.h1>

        {/* Sets info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <span className="text-lg font-semibold text-gray-300">
            {exercise.sets} séries
          </span>
        </motion.div>

        {/* Reps grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {exercise.reps.map((rep, i) => {
            const isActive = phase !== 'idle' && i === currentSet;
            const isDone = phase !== 'idle' && (i < currentSet || phase === 'done');
            return (
              <div
                key={i}
                className="rounded-xl px-4 py-3 backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: isDone
                    ? '#22c55e30'
                    : isActive
                      ? `${workoutColor}50`
                      : `${workoutColor}25`,
                  border: `1px solid ${isDone ? '#22c55e60' : isActive ? workoutColor : `${workoutColor}40`}`,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div className="text-[10px] font-medium uppercase text-gray-400">
                  Série {i + 1}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  {isDone && <CheckCircle size={14} className="text-green-400" />}
                  {rep}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Action area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {/* IDLE - Start button */}
            {phase === 'idle' && (
              <motion.button
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={startExercise}
                className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.97]"
                style={{ backgroundColor: workoutColor }}
              >
                <Play size={22} fill="white" />
                Iniciar Exercício
              </motion.button>
            )}

            {/* EXERCISING - Finish set button */}
            {phase === 'exercising' && (
              <motion.button
                key="finish"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={finishSet}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 py-4 text-lg font-bold text-white backdrop-blur-sm active:scale-[0.97]"
              >
                <CheckCircle size={22} />
                Finalizar Série {currentSet + 1}
              </motion.button>
            )}

            {/* RESTING - Countdown timer */}
            {phase === 'resting' && (
              <motion.div
                key="resting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Timer size={16} />
                  Descansando...
                </div>

                {/* Circular timer */}
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="absolute -rotate-90" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke={workoutColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - restProgress)}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="text-3xl font-black text-white">{formatTime(restTime)}</span>
                </div>

                <button
                  onClick={skipRest}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-gray-300 active:scale-[0.97]"
                >
                  <SkipForward size={16} />
                  Pular descanso
                </button>
              </motion.div>
            )}

            {/* READY - Next set button */}
            {phase === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-sm font-medium text-green-400">Descanso finalizado!</span>
                <button
                  onClick={nextSet}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.97]"
                  style={{ backgroundColor: workoutColor }}
                >
                  <Play size={22} fill="white" />
                  Próxima Série ({currentSet + 2}/{exercise.reps.length})
                </button>
              </motion.div>
            )}

            {/* DONE - Exercise complete */}
            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2 text-lg font-bold text-green-400">
                  <CheckCircle size={24} />
                  Exercício concluído!
                </div>
                {index < total - 1 && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-2 flex flex-col items-center text-gray-400"
                  >
                    <ChevronUp size={20} />
                    <span className="text-xs">Arraste para o próximo</span>
                  </motion.div>
                )}
                {index === total - 1 && (
                  <span className="text-sm text-green-300">Treino finalizado! Parabéns!</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swipe hint (only in idle) */}
        {phase === 'idle' && index < total - 1 && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-4 flex flex-col items-center text-gray-500"
          >
            <ChevronUp size={20} />
            <span className="text-xs">Próximo exercício</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
