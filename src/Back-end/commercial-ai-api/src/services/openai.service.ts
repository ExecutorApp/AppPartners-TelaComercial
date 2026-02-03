// ========================================
// Servico OpenAI
// Chat, TTS e Transcricao
// ========================================

import OpenAI from 'openai';
import { ChatMessage, LeadContextRequest } from '../types/api.types';
import contextService from './context.service';

// ========================================
// Configuracao do Cliente
// ========================================

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ========================================
// Constantes
// ========================================

// Modelo de chat
const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

// Modelo de TTS
const TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'tts-1';

// Voz do TTS
const TTS_VOICE = (process.env.OPENAI_TTS_VOICE || 'nova') as 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer';

// Modelo de transcricao
const WHISPER_MODEL = process.env.OPENAI_WHISPER_MODEL || 'whisper-1';

// ========================================
// Prompt do Sistema
// ========================================

// Prompt base para o assistente de vendas
const SYSTEM_PROMPT = `Você é um assistente de vendas inteligente e profissional.

REGRAS IMPORTANTES:
1. Você NUNCA envia mensagens automaticamente - sempre sugere para aprovação
2. Você é um ASSISTENTE, não uma IA autônoma
3. Suas respostas devem ser objetivas e úteis
4. Você deve ajudar o corretor a fechar vendas de forma ética
5. Você analisa o contexto do lead e sugere melhores abordagens

COMPORTAMENTO:
- Seja sempre educado e profissional
- Sugira próximos passos baseados no contexto
- Identifique sinais de interesse ou desinteresse
- Recomende horários adequados para contato
- Ajude a preparar argumentos de venda

FORMATO DAS RESPOSTAS:
- Seja conciso e direto
- Use linguagem adequada para vendas
- Forneça sugestões acionáveis`;

// ========================================
// Funcoes do Servico
// ========================================

/**
 * Gerar resposta do chat
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  leadContext?: LeadContextRequest,
  manualContext?: string
): Promise<string> {
  // Construir mensagens com contexto
  const systemMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Adicionar contexto do lead se disponivel
  if (leadContext) {
    const contextMessage = `
CONTEXTO DO LEAD:
- Nome: ${leadContext.name}
- Fase: ${leadContext.phase}
- Coluna: ${leadContext.column}
- Última interação: ${leadContext.lastInteraction}
${leadContext.channelEntry ? `- Canal de entrada: ${leadContext.channelEntry.type}` : ''}
`;
    systemMessages.push({ role: 'system', content: contextMessage });
  }

  // Adicionar contexto manual se disponivel
  if (manualContext) {
    systemMessages.push({
      role: 'system',
      content: `CONTEXTO ADICIONAL DO USUÁRIO:\n${manualContext}`,
    });
  }

  // Chamar API do OpenAI
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [...systemMessages, ...messages],
    temperature: 0.7,
    max_tokens: 500,
  });

  // Retornar resposta
  return response.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
}

/**
 * Gerar audio TTS
 */
export async function generateTTS(text: string): Promise<Buffer> {
  // Chamar API de TTS
  const response = await openai.audio.speech.create({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    input: text,
    response_format: 'mp3',
  });

  // Converter para buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Transcrever audio
 */
export async function transcribeAudio(audioBuffer: Buffer, filename: string): Promise<string> {
  // Criar arquivo temporario
  const file = new File([audioBuffer], filename, { type: 'audio/mpeg' });

  // Chamar API de transcricao
  const response = await openai.audio.transcriptions.create({
    model: WHISPER_MODEL,
    file: file,
    language: 'pt',
  });

  // Retornar texto
  return response.text;
}

/**
 * Resumir contexto manual
 */
export async function summarizeContext(content: string): Promise<string> {
  // Chamar API do OpenAI
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente que resume contextos de forma concisa. Resuma o seguinte texto em 2-3 frases, mantendo as informações mais importantes.',
      },
      {
        role: 'user',
        content: content,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  // Retornar resumo
  return response.choices[0]?.message?.content || content;
}

// ========================================
// Funcao: Melhorar Mensagem com Contexto
// ========================================

/**
 * Melhorar mensagem usando prompt da Lola + contexto do lead
 */
export async function improveMessage(
  leadId: string,
  message: string,
  promptName: string = 'lola-transcription'
): Promise<string> {
  // Preparar prompt completo com contexto
  const fullPrompt = contextService.preparePromptWithContext(
    promptName,
    leadId,
    message
  );

  // Chamar API do OpenAI
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'user',
        content: fullPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  // Retornar mensagem melhorada
  return response.choices[0]?.message?.content || message;
}

// ========================================
// Export
// ========================================

export default {
  generateChatResponse,
  generateTTS,
  transcribeAudio,
  summarizeContext,
  improveMessage,
};
