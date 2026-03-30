export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string[];
  youtubeShortId: string;
}

export interface Workout {
  id: string;
  letter: string;
  name: string;
  muscleGroups: string;
  color: string;
  colorDark: string;
  exercises: Exercise[];
}

export const workouts: Workout[] = [
  {
    id: 'a',
    letter: 'A',
    name: 'TREINO A',
    muscleGroups: 'Peitoral / Triceps / Deltoides',
    color: '#EF4444',
    colorDark: '#991B1B',
    exercises: [
      {
        id: 1,
        name: 'Supino Reto',
        sets: 4,
        reps: ['15', '12', '10', '8'],
        youtubeShortId: 'IODxDxX7fkA',
      },
      {
        id: 2,
        name: 'Supino Inclinado + Crucifixo',
        sets: 4,
        reps: ['15 + FALHA', '12 + FALHA', '10 + FALHA', '8 + FALHA'],
        youtubeShortId: 'jPLdzKHTBWE',
      },
      {
        id: 3,
        name: 'Cross Over',
        sets: 3,
        reps: ['10+10', '10+10', '10+10'],
        youtubeShortId: 'KpMPBQ6IkCk',
      },
      {
        id: 4,
        name: 'Pullover',
        sets: 3,
        reps: ['10 a 15', '10 a 15', '10 a 15'],
        youtubeShortId: 'RLMkZylv1cU',
      },
      {
        id: 5,
        name: 'Triceps Banco / Paralela',
        sets: 3,
        reps: ['FALHA', 'FALHA', 'FALHA'],
        youtubeShortId: '6kALZikXxLc',
      },
      {
        id: 6,
        name: 'Testa + Supinado',
        sets: 3,
        reps: ['10 + FALHA', '10 + FALHA', '10 + FALHA'],
        youtubeShortId: 'ir5PsbniVSc',
      },
      {
        id: 7,
        name: 'Triceps Corda',
        sets: 3,
        reps: ['8+8+8 (DROP)', '8+8+8 (DROP)', '8+8+8 (DROP)'],
        youtubeShortId: 'kiuVA0gs3EI',
      },
      {
        id: 8,
        name: 'Desenvolvimento + Lateral',
        sets: 3,
        reps: ['10 + 10', '10 + 10', '10 + 10'],
        youtubeShortId: 'Gu1t7X2yq1Q',
      },
      {
        id: 9,
        name: 'Elevação Frontal',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'hRJ6tOXKNE4',
      },
    ],
  },
  {
    id: 'b',
    letter: 'B',
    name: 'TREINO B',
    muscleGroups: 'Dorsal / Biceps / Deltoides',
    color: '#3B82F6',
    colorDark: '#1E3A8A',
    exercises: [
      {
        id: 1,
        name: 'Remada Curvado',
        sets: 4,
        reps: ['15', '12', '10', '8'],
        youtubeShortId: 'FWJR5Ve8bnQ',
      },
      {
        id: 2,
        name: 'Pulley Frente + Supinado',
        sets: 4,
        reps: ['15 + FALHA', '12 + FALHA', '10 + FALHA', '8 + FALHA'],
        youtubeShortId: 'lueEJGjTuPQ',
      },
      {
        id: 3,
        name: 'Remada Unilateral no Cross',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'roCP6wCXPqo',
      },
      {
        id: 4,
        name: 'Serrote',
        sets: 4,
        reps: ['10', '10', '10'],
        youtubeShortId: 'dFzUjzfih7k',
      },
      {
        id: 5,
        name: 'Rosca Direta Barra W',
        sets: 3,
        reps: ['15', '10', '10'],
        youtubeShortId: 'kwG2ipFRgFo',
      },
      {
        id: 6,
        name: 'Rosca Scott c/ Halter Unilateral',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'VMbXlRvLnME',
      },
      {
        id: 7,
        name: 'Rosca Simultânea no Banco',
        sets: 3,
        reps: ['10+10', '10+10', '10+10'],
        youtubeShortId: 'TwD-YGVP4Bk',
      },
      {
        id: 8,
        name: 'Crucifixo Inverso no Cross',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'lPt0GqwaqEw',
      },
      {
        id: 9,
        name: 'Encolhimento',
        sets: 3,
        reps: ['FALHA', 'FALHA', 'FALHA'],
        youtubeShortId: 'g6qbq4Lf1FI',
      },
    ],
  },
  {
    id: 'c',
    letter: 'C',
    name: 'TREINO C',
    muscleGroups: 'Membros Inferiores',
    color: '#10B981',
    colorDark: '#064E3B',
    exercises: [
      {
        id: 1,
        name: 'Agachamento',
        sets: 4,
        reps: ['15', '12', '10', '8'],
        youtubeShortId: 'MVMNk0HiTMg',
      },
      {
        id: 2,
        name: 'Terra',
        sets: 4,
        reps: ['10', '10', '10', '10'],
        youtubeShortId: '1ZXobu7JvvE',
      },
      {
        id: 3,
        name: 'Búlgaro',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'TKt0-c83GSc',
      },
      {
        id: 4,
        name: 'Pistols no TRX',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'bGS_LoKrVJU',
      },
      {
        id: 5,
        name: 'Agachamento com Salto',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeShortId: 'CVaEhXotL7M',
      },
      {
        id: 6,
        name: 'Passada',
        sets: 3,
        reps: ['5 ida e 5 volta', '5 ida e 5 volta', '5 ida e 5 volta'],
        youtubeShortId: 'QOVaHwm-Q6U',
      },
    ],
  },
];
