import { AllowedTableNumber, TableInfo, Badge } from '../types/math';

export const TABLES_INFO: Record<AllowedTableNumber, TableInfo> = {
  1: {
    number: 1,
    title: 'Tabuada do 1',
    themeColor: 'from-amber-400 to-orange-400',
    accentColor: 'text-amber-700 bg-amber-100 border-amber-300',
    iconName: 'Sparkles',
    trickTitle: 'O Espelho Mágico',
    trickDescription: 'Qualquer número multiplicado por 1 fica exatamente igual a si próprio! É como se o número se olhasse a um espelho.',
    example: '1 × 7 = 7  |  1 × 9 = 9',
    realLifeExample: 'Se tiveres 1 prato com 5 bolachas, continuas a ter 5 bolachas no total!',
    audioPhrase: 'Tabuada do 1: Qualquer número vezes 1 é igual a ele próprio.',
  },
  2: {
    number: 2,
    title: 'Tabuada do 2',
    themeColor: 'from-emerald-400 to-teal-500',
    accentColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    iconName: 'Copy',
    trickTitle: 'O Segredo do Dobro',
    trickDescription: 'Multiplicar por 2 é calcular o dobro (somar o número a ele mesmo)! Todos os resultados são números pares e terminam em 0, 2, 4, 6 ou 8.',
    example: '2 × 4 = 4 + 4 = 8  |  2 × 6 = 6 + 6 = 12',
    realLifeExample: 'Se comprares 2 pares de sapatilhas, ficas com 4 sapatilhas no total.',
    audioPhrase: 'Tabuada do 2: É sempre o dobro! Termina sempre num número par.',
  },
  3: {
    number: 3,
    title: 'Tabuada do 3',
    themeColor: 'from-blue-400 to-indigo-500',
    accentColor: 'text-blue-700 bg-blue-100 border-blue-300',
    iconName: 'TrendingUp',
    trickTitle: 'O Triplo e os Saltos de 3',
    trickDescription: 'Multiplicar por 3 é encontrar o triplo. Imagina um canguru saltitão que dá saltos de 3 em 3 na reta numérica: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30!',
    example: '3 × 4 = 4 + 4 + 4 = 12',
    realLifeExample: 'O João tem 3 estojos com 5 lápis de cor cada um. Tem 3 vezes 5 = 15 lápis!',
    audioPhrase: 'Tabuada do 3: É o triplo! Dá saltos de três em três.',
  },
  4: {
    number: 4,
    title: 'Tabuada do 4',
    themeColor: 'from-purple-400 to-pink-500',
    accentColor: 'text-purple-700 bg-purple-100 border-purple-300',
    iconName: 'Zap',
    trickTitle: 'O Dobro do Dobro',
    trickDescription: 'Para multiplicar por 4, faz o dobro e depois volta a fazer o dobro! Por exemplo, para fazer 4 × 3: o dobro de 3 é 6, e o dobro de 6 é 12!',
    example: '4 × 5 = o dobro de 10 = 20',
    realLifeExample: 'Um carro tem 4 rodas. 3 carros têm 4 × 3 = 12 rodas no total!',
    audioPhrase: 'Tabuada do 4: É o dobro do dobro! Faz o dobro duas vezes.',
  },
  5: {
    number: 5,
    title: 'Tabuada do 5',
    themeColor: 'from-rose-400 to-red-500',
    accentColor: 'text-rose-700 bg-rose-100 border-rose-300',
    iconName: 'Clock',
    trickTitle: 'O Relógio dos 5 Minutos',
    trickDescription: 'Todos os resultados da tabuada do 5 terminam sempre em 0 ou 5, de forma alternada: 5, 10, 15, 20, 25, 30... É exatamente como os minutos do relógio de ponteiros!',
    example: '5 × 2 = 10, 5 × 3 = 15, 5 × 4 = 20',
    realLifeExample: 'Cada mão tem 5 dedos. Se juntares 4 amigos com as duas mãos levantadas, são muitos cincos!',
    audioPhrase: 'Tabuada do 5: Termina sempre em zero ou cinco, como os minutos do relógio!',
  },
  6: {
    number: 6,
    title: 'Tabuada do 6',
    themeColor: 'from-cyan-400 to-blue-500',
    accentColor: 'text-cyan-700 bg-cyan-100 border-cyan-300',
    iconName: 'Compass',
    trickTitle: 'O Dobro da Tabuada do 3',
    trickDescription: 'Sabias que o 6 é o dobro do 3? Se souberes a tabuada do 3, basta duplicar o resultado! Por exemplo: 3 × 4 = 12, logo 6 × 4 = o dobro de 12 = 24.',
    example: '6 × 3 = 18  |  6 × 5 = 30',
    realLifeExample: 'Uma caixa de ovos tem 6 ovos. Se a tua mãe comprar 3 caixas, comprou 6 × 3 = 18 ovos!',
    audioPhrase: 'Tabuada do 6: É o dobro da tabuada do três! Saltos de seis em seis.',
  },
  10: {
    number: 10,
    title: 'Tabuada do 10',
    themeColor: 'from-amber-500 to-yellow-500',
    accentColor: 'text-amber-800 bg-amber-100 border-amber-300',
    iconName: 'Award',
    trickTitle: 'A Magia do Zero',
    trickDescription: 'É a tabuada mais rápida de todas! Para multiplicar qualquer número por 10, basta escrever esse número e colar-lhe um zero (0) no final!',
    example: '10 × 4 = 40  |  10 × 8 = 80',
    realLifeExample: 'Se poupares 10 moedas de 1 euro durante 7 semanas, terás 7 × 10 = 70 euros no teu mealheiro!',
    audioPhrase: 'Tabuada do 10: O truque mágico do zero! Escreve o número e cola um zero no fim.',
  },
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_win',
    title: 'Primeiro Passo',
    description: 'Completaste o teu primeiro desafio da tabuada!',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'match_master',
    title: 'Detetive dos Pares',
    description: 'Ligaste todas as contas aos resultados corretos no jogo de correspondência!',
    icon: '🧩',
    unlocked: false,
  },
  {
    id: 'true_detective',
    title: 'Mestre da Verdade',
    description: 'Acertaste 5 afirmações seguidas no Verdadeiro ou Falso!',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'quiz_star',
    title: 'Estrela da Escolha Múltipla',
    description: 'Alcançaste nota máxima no Quiz das Tabuadas!',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'speed_runner',
    title: 'Foguetão dos Números',
    description: 'Respondeste a 10 contas no Desafio Rápido!',
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'table_master_all',
    title: 'Grande Campeão do 3.º Ano',
    description: 'Dominaste as tabuadas do 1, 2, 3, 4, 5, 6 e 10!',
    icon: '🏆',
    unlocked: false,
  },
];

// Visual objects for kids matrix representations
export const MATRIX_OBJECTS = [
  { emoji: '🍎', name: 'Maçãs' },
  { emoji: '⭐', name: 'Estrelas' },
  { emoji: '🚀', name: 'Foguetões' },
  { emoji: '🐟', name: 'Peixinhos' },
  { emoji: '🐞', name: 'Joaninhas' },
  { emoji: '⚽', name: 'Bolas' },
  { emoji: '🚗', name: 'Carros' },
];

// Encouraging Portuguese feedback messages for correct answers
export const SUCCESS_MESSAGES = [
  'Excelente! Acertaste em cheio!',
  'Espetacular! Estás a ficar um craque!',
  'Muito bem! O Pipas está muito orgulhoso!',
  'Fixe! A tabuada já não tem segredos para ti!',
  'Fantástico! Continua assim!',
  'Que rapidez! Ponto para ti!',
  'Parabéns! Resposta super certa!',
];

// Gentle encouraging messages for mistakes with learning tip
export const TRY_AGAIN_MESSAGES = [
  'Quase lá! Não faz mal, os grandes matemáticos aprendem com os erros!',
  'Boa tentativa! Vamos ver como funciona o cálculo:',
  'Tem calma e respira! Olha com atenção para a dica:',
  'O Pipas ajuda-te! Vê como se somam as parcelas:',
  'Continua a tentar! Cada tentativa torna-te mais forte na matemática!',
];
