import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// CONSTANTES
// ========================================

const PROGRESS_STORAGE_KEY = '@partner_training_progress'; //..Chave de armazenamento

// ========================================
// INTERFACES
// ========================================

// Progresso de uma aula individual
export interface LessonProgress {
  lessonId: string; //.................ID da aula
  completed: boolean; //...............Se foi concluida
  watchedSeconds: number; //...........Segundos assistidos (para videos)
  lastWatchedAt?: number; //...........Timestamp da ultima visualizacao
}

// Progresso de um treinamento
export interface TrainingProgress {
  trainingId: string; //...............ID do treinamento
  status: 'not_started' | 'in_progress' | 'completed'; //..Status geral
  progress: number; //..................Porcentagem de conclusao (0-100)
  lessons: LessonProgress[]; //.........Progresso de cada aula
  lastAccessedAt: number; //............Timestamp do ultimo acesso
}

// ========================================
// FUNCOES DE ARMAZENAMENTO
// ========================================

// Carrega todo o progresso armazenado
export const loadAllProgress = async (): Promise<Record<string, TrainingProgress>> => {
  try {
    const progressJson = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
    if (progressJson) {
      return JSON.parse(progressJson);
    }
    return {};
  } catch (error) {
    console.error('[TrainingProgress] Erro ao carregar progresso:', error);
    return {};
  }
};

// Salva todo o progresso
export const saveAllProgress = async (progress: Record<string, TrainingProgress>): Promise<void> => {
  try {
    const progressJson = JSON.stringify(progress);
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, progressJson);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao salvar progresso:', error);
  }
};

// Carrega progresso de um treinamento especifico
export const loadTrainingProgress = async (trainingId: string): Promise<TrainingProgress | null> => {
  try {
    const allProgress = await loadAllProgress();
    return allProgress[trainingId] || null;
  } catch (error) {
    console.error('[TrainingProgress] Erro ao carregar progresso do treinamento:', error);
    return null;
  }
};

// Salva progresso de um treinamento especifico
export const saveTrainingProgress = async (progress: TrainingProgress): Promise<void> => {
  try {
    const allProgress = await loadAllProgress();
    allProgress[progress.trainingId] = progress;
    await saveAllProgress(allProgress);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao salvar progresso do treinamento:', error);
  }
};

// ========================================
// FUNCOES DE ATUALIZACAO DE PROGRESSO
// ========================================

// Marca uma aula como concluida
export const markLessonCompleted = async (
  trainingId: string,
  lessonId: string,
  totalLessons: number
): Promise<void> => {
  try {
    // Carrega progresso atual
    let progress = await loadTrainingProgress(trainingId);

    // Se nao existe, cria novo
    if (!progress) {
      progress = {
        trainingId,
        status: 'in_progress',
        progress: 0,
        lessons: [],
        lastAccessedAt: Date.now(),
      };
    }

    // Atualiza progresso da aula
    const lessonIndex = progress.lessons.findIndex(l => l.lessonId === lessonId);
    if (lessonIndex >= 0) {
      progress.lessons[lessonIndex].completed = true;
      progress.lessons[lessonIndex].lastWatchedAt = Date.now();
    } else {
      progress.lessons.push({
        lessonId,
        completed: true,
        watchedSeconds: 0,
        lastWatchedAt: Date.now(),
      });
    }

    // Calcula progresso geral
    const completedCount = progress.lessons.filter(l => l.completed).length;
    progress.progress = Math.round((completedCount / totalLessons) * 100);

    // Atualiza status
    if (progress.progress === 100) {
      progress.status = 'completed';
    } else if (progress.progress > 0) {
      progress.status = 'in_progress';
    } else {
      progress.status = 'not_started';
    }

    progress.lastAccessedAt = Date.now();

    // Salva
    await saveTrainingProgress(progress);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao marcar aula como concluida:', error);
  }
};

// Atualiza segundos assistidos de um video
export const updateVideoProgress = async (
  trainingId: string,
  lessonId: string,
  watchedSeconds: number
): Promise<void> => {
  try {
    let progress = await loadTrainingProgress(trainingId);

    if (!progress) {
      progress = {
        trainingId,
        status: 'in_progress',
        progress: 0,
        lessons: [],
        lastAccessedAt: Date.now(),
      };
    }

    const lessonIndex = progress.lessons.findIndex(l => l.lessonId === lessonId);
    if (lessonIndex >= 0) {
      progress.lessons[lessonIndex].watchedSeconds = watchedSeconds;
      progress.lessons[lessonIndex].lastWatchedAt = Date.now();
    } else {
      progress.lessons.push({
        lessonId,
        completed: false,
        watchedSeconds,
        lastWatchedAt: Date.now(),
      });
    }

    progress.lastAccessedAt = Date.now();
    await saveTrainingProgress(progress);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao atualizar progresso do video:', error);
  }
};

// Reseta progresso de um treinamento
export const resetTrainingProgress = async (trainingId: string): Promise<void> => {
  try {
    const allProgress = await loadAllProgress();
    delete allProgress[trainingId];
    await saveAllProgress(allProgress);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao resetar progresso:', error);
  }
};

// Reseta todo o progresso (todos os treinamentos)
export const resetAllProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch (error) {
    console.error('[TrainingProgress] Erro ao resetar todo o progresso:', error);
  }
};
