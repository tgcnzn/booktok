import { Flame } from 'lucide-react';
import { workouts } from '../data/workouts';
import WorkoutCard from '../components/WorkoutCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame size={28} className="text-orange-500" />
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Treino Mosquito
            </h1>
          </div>
          <p className="text-sm text-gray-500">Mês 1 - Selecione seu treino</p>
        </div>

        {/* Workout cards */}
        <div className="flex flex-col gap-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  );
}
