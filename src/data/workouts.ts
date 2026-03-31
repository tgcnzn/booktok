export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string[];
  youtubeId: string;
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
        youtubeId: 'UHa9U-O09_U',
      },
      {
        id: 2,
        name: 'Supino Inclinado + Crucifixo',
        sets: 4,
        reps: ['15 + FALHA', '12 + FALHA', '10 + FALHA', '8 + FALHA'],
        youtubeId: 'hV21YJFt6MI',
      },
      {
        id: 3,
        name: 'Cross Over',
        sets: 3,
        reps: ['10+10', '10+10', '10+10'],
        youtubeId: 'poe7X02U2qw',
      },
      {
        id: 4,
        name: 'Pullover',
        sets: 3,
        reps: ['10 a 15', '10 a 15', '10 a 15'],
        youtubeId: 'vKCQHaG0Rj0',
      },
      {
        id: 5,
        name: 'Triceps Banco / Paralela',
        sets: 3,
        reps: ['FALHA', 'FALHA', 'FALHA'],
        youtubeId: 'Q07t33qOow0',
      },
      {
        id: 6,
        name: 'Testa + Supinado',
        sets: 3,
        reps: ['10 + FALHA', '10 + FALHA', '10 + FALHA'],
        youtubeId: '1sUU9zqs3LA',
      },
      {
        id: 7,
        name: 'Triceps Corda',
        sets: 3,
        reps: ['8+8+8 (DROP)', '8+8+8 (DROP)', '8+8+8 (DROP)'],
        youtubeId: '-QGC1cL6ETE',
      },
      {
        id: 8,
        name: 'Desenvolvimento + Lateral',
        sets: 3,
        reps: ['10 + 10', '10 + 10', '10 + 10'],
        youtubeId: 'ot9nwSC1JnA',
      },
      {
        id: 9,
        name: 'Elevação Frontal',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'GqZRmCow0rw',
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
        youtubeId: '0_rJ7VEIcUA',
      },
      {
        id: 2,
        name: 'Pulley Frente + Supinado',
        sets: 4,
        reps: ['15 + FALHA', '12 + FALHA', '10 + FALHA', '8 + FALHA'],
        youtubeId: 'oPC_QP2SS0I',
      },
      {
        id: 3,
        name: 'Remada Unilateral no Cross',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'TGjm2GZ_i8s',
      },
      {
        id: 4,
        name: 'Serrote',
        sets: 4,
        reps: ['10', '10', '10'],
        youtubeId: 'L2FuijYFTvE',
      },
      {
        id: 5,
        name: 'Rosca Direta Barra W',
        sets: 3,
        reps: ['15', '10', '10'],
        youtubeId: 'dc330H9yN3Y',
      },
      {
        id: 6,
        name: 'Rosca Scott c/ Halter Unilateral',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'qhRLio6bCRo',
      },
      {
        id: 7,
        name: 'Rosca Simultânea no Banco',
        sets: 3,
        reps: ['10+10', '10+10', '10+10'],
        youtubeId: 't5c2Te0vqDY',
      },
      {
        id: 8,
        name: 'Crucifixo Inverso no Cross',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'n-SdGbGgDw0',
      },
      {
        id: 9,
        name: 'Encolhimento',
        sets: 3,
        reps: ['FALHA', 'FALHA', 'FALHA'],
        youtubeId: 'x9Im5d1H-Xw',
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
        youtubeId: '1oipoiTpbJA',
      },
      {
        id: 2,
        name: 'Terra',
        sets: 4,
        reps: ['10', '10', '10', '10'],
        youtubeId: 'ZPsUi8zwCQ8',
      },
      {
        id: 3,
        name: 'Búlgaro',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'bW9nLPZebdI',
      },
      {
        id: 4,
        name: 'Pistols no TRX',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'YQJes_iaCUU',
      },
      {
        id: 5,
        name: 'Agachamento com Salto',
        sets: 3,
        reps: ['10', '10', '10'],
        youtubeId: 'CSLRw-YDHkc',
      },
      {
        id: 6,
        name: 'Passada',
        sets: 3,
        reps: ['5 ida e 5 volta', '5 ida e 5 volta', '5 ida e 5 volta'],
        youtubeId: 'WYV6RuLKeng',
      },
    ],
  },
];
