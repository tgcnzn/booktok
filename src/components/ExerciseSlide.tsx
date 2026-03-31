import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import type { Exercise } from '../data/workouts';
import YouTubeBackground from './YouTubeBackground';

interface Props {
  exercise: Exercise;
  index: number;
  total: number;
  workoutColor: string;
  workoutLetter: string;
}

export default function ExerciseSlide({ exercise, index, total, workoutColor, workoutLetter }: Props) {
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
          {exercise.reps.map((rep, i) => (
            <div
              key={i}
              className="rounded-xl px-4 py-3 backdrop-blur-sm"
              style={{
                backgroundColor: `${workoutColor}25`,
                border: `1px solid ${workoutColor}40`,
              }}
            >
              <div className="text-[10px] font-medium uppercase text-gray-400">
                Série {i + 1}
              </div>
              <div className="text-sm font-bold text-white">{rep}</div>
            </div>
          ))}
        </motion.div>

        {/* Swipe hint */}
        {index < total - 1 && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-6 flex flex-col items-center text-gray-500"
          >
            <ChevronUp size={20} />
            <span className="text-xs">Próximo exercício</span>
          </motion.div>
        )}

        {index === total - 1 && (
          <div className="mt-6 text-center text-sm font-semibold text-green-400">
            Último exercício! Bora finalizar!
          </div>
        )}
      </div>
    </div>
  );
}
