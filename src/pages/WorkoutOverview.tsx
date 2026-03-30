import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Dumbbell } from 'lucide-react';
import { workouts } from '../data/workouts';

export default function WorkoutOverview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workout = workouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        Treino não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div
        className="px-4 pb-6 pt-8"
        style={{
          background: `linear-gradient(180deg, ${workout.color}22, transparent)`,
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-1 text-sm text-gray-400"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black"
            style={{ backgroundColor: workout.color, color: '#fff' }}
          >
            {workout.letter}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{workout.name}</h1>
            <p className="text-sm text-gray-400">{workout.muscleGroups}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <Dumbbell size={12} />
              <span>{workout.exercises.length} exercícios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-4 pb-28">
        <div className="flex flex-col gap-3">
          {workout.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="rounded-xl p-4"
              style={{
                background: `${workout.color}0D`,
                border: `1px solid ${workout.color}1A`,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ backgroundColor: `${workout.color}33`, color: workout.color }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{exercise.name}</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {exercise.sets} séries
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exercise.reps.map((rep, i) => (
                      <span
                        key={i}
                        className="rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-300"
                        style={{ backgroundColor: `${workout.color}1A` }}
                      >
                        S{i + 1}: {rep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent px-4 pb-6 pt-8">
        <button
          onClick={() => navigate(`/treino/${workout.id}/play`)}
          className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white transition-all active:scale-[0.97]"
          style={{ backgroundColor: workout.color }}
        >
          <Play size={22} fill="white" />
          Começar Treino
        </button>
      </div>
    </div>
  );
}
