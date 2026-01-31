import { useState, useEffect, useCallback } from 'react';
import {
  loadAllProgress,
  loadTrainingProgress,
  markLessonCompleted,
  updateVideoProgress,
  TrainingProgress,
} from './03.Training-ProgressService';
import { TrainingItem } from './02.Training-Types';

// ========================================
// HOOK PERSONALIZADO PARA PROGRESSO
// ========================================

export const useTrainingProgress = () => {
  // Estado para armazenar todo o progresso
  const [allProgress, setAllProgress] = useState<Record<string, TrainingProgress>>({});

  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // Carrega progresso inicial ao montar
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const progress = await loadAllProgress();
        setAllProgress(progress);
      } catch (error) {
        console.error('[useTrainingProgress] Erro ao carregar progresso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Funcao para obter progresso de um treinamento
  const getTrainingProgress = useCallback((trainingId: string): TrainingProgress | null => {
    return allProgress[trainingId] || null;
  }, [allProgress]);

  // Funcao para marcar aula como concluida
  const markAsCompleted = useCallback(async (
    trainingId: string,
    lessonId: string,
    totalLessons: number
  ) => {
    await markLessonCompleted(trainingId, lessonId, totalLessons);

    // Recarrega progresso
    const updatedProgress = await loadAllProgress();
    setAllProgress(updatedProgress);
  }, []);

  // Funcao para atualizar progresso de video
  const updateVideo = useCallback(async (
    trainingId: string,
    lessonId: string,
    watchedSeconds: number
  ) => {
    await updateVideoProgress(trainingId, lessonId, watchedSeconds);

    // Recarrega progresso
    const updatedProgress = await loadAllProgress();
    setAllProgress(updatedProgress);
  }, []);

  // Funcao para obter treinamento com progresso aplicado
  const getTrainingWithProgress = useCallback((training: TrainingItem): TrainingItem => {
    const progress = getTrainingProgress(training.id);

    if (!progress) {
      return training;
    }

    // Aplica progresso aos contents
    const updatedContents = training.contents.map(content => {
      const lessonProgress = progress.lessons.find(l => l.lessonId === content.id);
      return {
        ...content,
        completed: lessonProgress?.completed || false,
      };
    });

    // Retorna treinamento atualizado
    return {
      ...training,
      status: progress.status,
      progress: progress.progress,
      contents: updatedContents,
    };
  }, [getTrainingProgress]);

  // Funcao para obter lista de treinamentos com progresso aplicado
  const getTrainingsWithProgress = useCallback((trainings: TrainingItem[]): TrainingItem[] => {
    return trainings.map(training => getTrainingWithProgress(training));
  }, [getTrainingWithProgress]);

  return {
    loading, //........................Estado de carregamento
    allProgress, //....................Todo o progresso
    getTrainingProgress, //............Obter progresso de um treinamento
    markAsCompleted, //................Marcar aula como concluida
    updateVideo, //....................Atualizar progresso de video
    getTrainingWithProgress, //........Obter treinamento com progresso
    getTrainingsWithProgress, //......Obter lista com progresso
  };
};
