import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { workouts } from '../data/workouts';
import ExerciseSlide from '../components/ExerciseSlide';

export default function WorkoutPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workout = workouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Treino não encontrado
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Close button */}
      <button
        onClick={() => navigate(`/treino/${workout.id}`)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white"
      >
        <X size={22} />
      </button>

      {/* Snap scroll container */}
      <div className="snap-container no-scrollbar">
        {workout.exercises.map((exercise, index) => (
          <ExerciseSlide
            key={exercise.id}
            exercise={exercise}
            index={index}
            total={workout.exercises.length}
            workoutColor={workout.color}
            workoutLetter={workout.letter}
          />
        ))}
      </div>
    </div>
  );
}
