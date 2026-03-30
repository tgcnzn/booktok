import { useNavigate } from 'react-router-dom';
import { Dumbbell, ChevronRight } from 'lucide-react';
import type { Workout } from '../data/workouts';

interface Props {
  workout: Workout;
}

export default function WorkoutCard({ workout }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/treino/${workout.id}`)}
      className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, ${workout.color}22, ${workout.color}11)`,
        border: `1px solid ${workout.color}33`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-black"
            style={{ backgroundColor: workout.color, color: '#fff' }}
          >
            {workout.letter}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{workout.name}</h2>
            <p className="text-sm text-gray-400">{workout.muscleGroups}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <Dumbbell size={12} />
              <span>{workout.exercises.length} exercícios</span>
            </div>
          </div>
        </div>
        <ChevronRight size={24} className="text-gray-500" />
      </div>
    </button>
  );
}
