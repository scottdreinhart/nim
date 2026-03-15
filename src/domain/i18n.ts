export type Locale = 'en' | 'es'

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es']

export type TranslationKey =
  | 'app.splashEyebrow'
  | 'app.splashSubtitle'
  | 'app.backToMenu'
  | 'app.backButtonTitle'
  | 'app.headerTitle'
  | 'app.quickDifficulty'
  | 'app.quickRules'
  | 'app.openFullSettings'
  | 'menu.open'
  | 'menu.close'
  | 'menu.title'
  | 'mainMenu.title'
  | 'mainMenu.subtitle'
  | 'mainMenu.playVsAi'
  | 'mainMenu.twoPlayer'
  | 'mainMenu.settings'
  | 'mainMenu.wins'
  | 'mainMenu.losses'
  | 'mainMenu.bestStreak'
  | 'mainMenu.hintLine1'
  | 'mainMenu.hintLine2'
  | 'settings.title'
  | 'settings.initialPiles'
  | 'settings.difficulty'
  | 'settings.rules'
  | 'settings.theme'
  | 'settings.language'
  | 'settings.cancel'
  | 'settings.confirm'
  | 'settings.pileAria'
  | 'settings.pileHint'
  | 'settings.themeAria'
  | 'settings.locale.en'
  | 'settings.locale.es'
  | 'settings.preset.classic'
  | 'settings.preset.simple'
  | 'settings.preset.challenge'
  | 'settings.preset.quick'
  | 'settings.preset.grand'
  | 'settings.theme.chiba'
  | 'settings.theme.classic'
  | 'settings.theme.ocean'
  | 'settings.theme.sunset'
  | 'settings.theme.forest'
  | 'settings.theme.rose'
  | 'settings.theme.midnight'
  | 'settings.theme.highcontrast'
  | 'difficulty.groupAria'
  | 'difficulty.easy'
  | 'difficulty.medium'
  | 'difficulty.hard'
  | 'rules.groupAria'
  | 'rules.normal'
  | 'rules.misere'
  | 'game.player1Turn'
  | 'game.player2Turn'
  | 'game.yourTurn'
  | 'game.cpuThinking'
  | 'game.player1Wins'
  | 'game.player2Wins'
  | 'game.youWon'
  | 'game.youLost'
  | 'game.takeAllFromPile'
  | 'game.playAgain'
  | 'game.endTurn'
  | 'game.liveStatus'
  | 'offline.banner'
  | 'loading.text'
  | 'error.title'
  | 'error.unexpected'
  | 'error.retry'
  | 'error.details'
  | 'error.noStack'
  | 'error.attempt'
  | 'nim.coinAria'

const TRANSLATIONS: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    'app.splashEyebrow': 'Stack. Remove. Win.',
    'app.splashSubtitle': 'Take the last stone, or force your opponent to',
    'app.backToMenu': 'Back to menu',
    'app.backButtonTitle': 'Back',
    'app.headerTitle': 'Game of Nim',
    'app.quickDifficulty': 'Difficulty',
    'app.quickRules': 'Rules',
    'app.openFullSettings': 'Open Full Settings',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'menu.title': 'Game settings',
    'mainMenu.title': 'Game of Nim',
    'mainMenu.subtitle': 'A classic strategy game',
    'mainMenu.playVsAi': 'Play vs AI',
    'mainMenu.twoPlayer': '2 Player',
    'mainMenu.settings': 'Settings',
    'mainMenu.wins': 'Wins',
    'mainMenu.losses': 'Losses',
    'mainMenu.bestStreak': 'Best Streak',
    'mainMenu.hintLine1': 'Remove objects from heaps.',
    'mainMenu.hintLine2': 'Choose Normal or Misère rules in Settings.',
    'settings.title': 'Settings',
    'settings.initialPiles': 'Initial Piles',
    'settings.difficulty': 'Difficulty',
    'settings.rules': 'Rules',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.cancel': 'Cancel',
    'settings.confirm': 'OK',
    'settings.pileAria': 'Pile {index} count',
    'settings.pileHint': 'Set counts for the 3 piles (1–15).',
    'settings.themeAria': 'Use theme {theme}',
    'settings.locale.en': 'English',
    'settings.locale.es': 'Spanish',
    'settings.preset.classic': 'Classic',
    'settings.preset.simple': 'Simple',
    'settings.preset.challenge': 'Challenge',
    'settings.preset.quick': 'Quick',
    'settings.preset.grand': 'Grand',
    'settings.theme.chiba': 'Chiba City',
    'settings.theme.classic': 'Neon Core',
    'settings.theme.ocean': 'Neon Arcade',
    'settings.theme.sunset': 'Night District',
    'settings.theme.forest': 'Gridline',
    'settings.theme.rose': 'Vaporwave',
    'settings.theme.midnight': 'Synthwave',
    'settings.theme.highcontrast': 'High Contrast',
    'difficulty.groupAria': 'CPU difficulty',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'rules.groupAria': 'Game rules variant',
    'rules.normal': 'Normal',
    'rules.misere': 'Misère',
    'game.player1Turn': 'PLAYER 1',
    'game.player2Turn': 'PLAYER 2',
    'game.yourTurn': 'YOUR TURN',
    'game.cpuThinking': 'CPU THINKING',
    'game.player1Wins': 'PLAYER 1 WINS!',
    'game.player2Wins': 'PLAYER 2 WINS!',
    'game.youWon': 'YOU WON!',
    'game.youLost': 'YOU LOST',
    'game.takeAllFromPile': 'Take all from pile {pile}',
    'game.playAgain': 'PLAY AGAIN',
    'game.endTurn': 'End Turn',
    'game.liveStatus': 'Game status',
    'offline.banner': 'You are offline — game continues locally',
    'loading.text': 'Loading...',
    'error.title': 'Something went wrong',
    'error.unexpected': 'An unexpected error occurred.',
    'error.retry': 'Try Again',
    'error.details': 'Error details',
    'error.noStack': 'No stack trace available',
    'error.attempt': 'Attempt {count}',
    'nim.coinAria': 'Nim coin',
  },
  es: {
    'app.splashEyebrow': 'Apila. Quita. Gana.',
    'app.splashSubtitle': 'Toma la última ficha, o fuerza a tu rival',
    'app.backToMenu': 'Volver al menú',
    'app.backButtonTitle': 'Volver',
    'app.headerTitle': 'Juego de Nim',
    'app.quickDifficulty': 'Dificultad',
    'app.quickRules': 'Reglas',
    'app.openFullSettings': 'Abrir ajustes completos',
    'menu.open': 'Abrir menú',
    'menu.close': 'Cerrar menú',
    'menu.title': 'Ajustes del juego',
    'mainMenu.title': 'Juego de Nim',
    'mainMenu.subtitle': 'Un juego clásico de estrategia',
    'mainMenu.playVsAi': 'Jugar vs IA',
    'mainMenu.twoPlayer': '2 jugadores',
    'mainMenu.settings': 'Ajustes',
    'mainMenu.wins': 'Victorias',
    'mainMenu.losses': 'Derrotas',
    'mainMenu.bestStreak': 'Mejor racha',
    'mainMenu.hintLine1': 'Quita objetos de las pilas.',
    'mainMenu.hintLine2': 'Elige reglas Normal o Misère en Ajustes.',
    'settings.title': 'Ajustes',
    'settings.initialPiles': 'Pilas iniciales',
    'settings.difficulty': 'Dificultad',
    'settings.rules': 'Reglas',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.cancel': 'Cancelar',
    'settings.confirm': 'Aceptar',
    'settings.pileAria': 'Cantidad de la pila {index}',
    'settings.pileHint': 'Define la cantidad de las 3 pilas (1–15).',
    'settings.themeAria': 'Usar tema {theme}',
    'settings.locale.en': 'Inglés',
    'settings.locale.es': 'Español',
    'settings.preset.classic': 'Clásico',
    'settings.preset.simple': 'Simple',
    'settings.preset.challenge': 'Desafío',
    'settings.preset.quick': 'Rápido',
    'settings.preset.grand': 'Grande',
    'settings.theme.chiba': 'Ciudad Chiba',
    'settings.theme.classic': 'Núcleo Neón',
    'settings.theme.ocean': 'Arcade Neón',
    'settings.theme.sunset': 'Distrito Nocturno',
    'settings.theme.forest': 'Cuadrícula',
    'settings.theme.rose': 'Vaporwave',
    'settings.theme.midnight': 'Synthwave',
    'settings.theme.highcontrast': 'Alto Contraste',
    'difficulty.groupAria': 'Dificultad de CPU',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Media',
    'difficulty.hard': 'Difícil',
    'rules.groupAria': 'Variante de reglas',
    'rules.normal': 'Normal',
    'rules.misere': 'Misère',
    'game.player1Turn': 'JUGADOR 1',
    'game.player2Turn': 'JUGADOR 2',
    'game.yourTurn': 'TU TURNO',
    'game.cpuThinking': 'CPU PENSANDO',
    'game.player1Wins': '¡GANA JUGADOR 1!',
    'game.player2Wins': '¡GANA JUGADOR 2!',
    'game.youWon': '¡GANASTE!',
    'game.youLost': 'PERDISTE',
    'game.takeAllFromPile': 'Tomar todo de la pila {pile}',
    'game.playAgain': 'JUGAR DE NUEVO',
    'game.endTurn': 'Terminar turno',
    'game.liveStatus': 'Estado de la partida',
    'offline.banner': 'Sin conexión — la partida continúa localmente',
    'loading.text': 'Cargando...',
    'error.title': 'Algo salió mal',
    'error.unexpected': 'Ocurrió un error inesperado.',
    'error.retry': 'Reintentar',
    'error.details': 'Detalles del error',
    'error.noStack': 'No hay traza de pila disponible',
    'error.attempt': 'Intento {count}',
    'nim.coinAria': 'Ficha de Nim',
  },
}

export type TranslationParams = Record<string, string | number>

export const translate = (
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string => {
  const template = TRANSLATIONS[locale][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key
  if (!params) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}
