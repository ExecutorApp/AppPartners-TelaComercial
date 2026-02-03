// ========================================
// Hook useMessages
// Gerenciamento de mensagens do chat
// ========================================

// ========================================
// Imports React
// ========================================
import {                                  //......Hooks React
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useEffect,                              //......Hook de efeito
} from 'react';                           //......Biblioteca React

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos do chat
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  MessageStatus,                          //......Status
  ReplyInfo,                              //......Info reply
  MessageKey,                             //......Chave da mensagem
} from '../types/08.types.whatsapp';      //......Arquivo de tipos

// ========================================
// Imports de Utilitarios
// ========================================
import {                                  //......Utilitarios
  generateMessageId,                      //......Gera ID
} from '../data/08.mockMessages';         //......Arquivo utilitarios

// ========================================
// Imports de Servicos
// ========================================
import evolutionService from '../../../services/evolutionService';
import { instanceManager } from '../../../services/instanceManager';
import aiService from '../../../services/aiService';

// ========================================
// NOTA: WebSocket desabilitado
// ========================================
// Evolution API nao expoe WebSocket nativo.
// Para status em tempo real (delivered/read), seria necessario:
// 1. Configurar webhook HTTP na Evolution API
// 2. Ter backend para receber os webhooks
// 3. Usar polling ou SSE para enviar ao frontend
// Por enquanto, usamos fluxo basico: pending → sent/failed

// ========================================
// Constantes de Log
// ========================================
const LOG_PREFIX = '[useMessages]';       //......Prefixo dos logs

// ========================================
// Interface de Parametros
// ========================================
interface UseMessagesParams {
  leadId: string;                         //......ID do lead
  leadPhone: string;                      //......Telefone do lead
  leadName?: string;                      //......Nome do lead (opcional)
}

// ========================================
// Interface de Retorno
// ========================================
interface UseMessagesReturn {
  messages: WhatsAppMessage[];            //......Lista de mensagens
  isLoading: boolean;                     //......Estado de loading
  isSending: boolean;                     //......Estado de envio
  replyingTo: ReplyInfo | null;           //......Reply info
  instanceName: string;                   //......Nome da instancia
  sendTextMessage: (text: string) => Promise<void>;
  sendAudioMessage: (uri: string, duration: number) => Promise<void>;
  sendImageMessage: (uri: string, width: number, height: number) => Promise<void>;
  sendDocumentMessage: (uri: string, fileName: string, size: number) => Promise<void>;
  setReplyTo: (info: ReplyInfo | null) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageReaction: (messageId: string, reaction: string | null) => void;
  refreshMessages: () => void;            //......Recarrega mensagens
  retryAudioMessage: (message: WhatsAppMessage) => Promise<boolean>;
}

// ========================================
// Funcao auxiliar para converter blob URL para base64
// ========================================
const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  console.log(`${LOG_PREFIX} Convertendo blob URL para base64...`);

  try {
    // Busca o blob a partir da URL
    const response = await fetch(blobUrl);       //......Fetch do blob
    const blob = await response.blob();          //......Converte para blob

    console.log(`${LOG_PREFIX} Blob type:`, blob.type);
    console.log(`${LOG_PREFIX} Blob size:`, blob.size);

    // Converte blob para base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();           //......Leitor de arquivo

      reader.onloadend = () => {
        const dataUrl = reader.result as string; //......Resultado data URL
        // Extrai apenas o base64 puro (remove prefixo data:audio/xxx;base64,)
        // Evolution API espera base64 puro sem prefixo
        const base64 = dataUrl.split(',')[1] || dataUrl;
        console.log(`${LOG_PREFIX} Data URL completo length:`, dataUrl?.length);
        console.log(`${LOG_PREFIX} Base64 puro length:`, base64?.length);
        console.log(`${LOG_PREFIX} Base64 prefix:`, base64?.substring(0, 30));
        resolve(base64);                         //......Retorna base64 puro
      };

      reader.onerror = (error) => {
        console.error(`${LOG_PREFIX} Erro FileReader:`, error);
        reject(error);                           //......Retorna erro
      };

      reader.readAsDataURL(blob);                //......Le como data URL
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Erro ao converter blob:`, error);
    throw error;                                 //......Propaga erro
  }
};

// ========================================
// Funcao auxiliar para formatar numero
// ========================================
const formatPhoneNumber = (phone: string): string => {
  // Remove caracteres nao numericos
  let cleaned = phone.replace(/\D/g, '');

  // Se comeca com 55, mantem; senao, adiciona
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }

  console.log(`${LOG_PREFIX} formatPhoneNumber:`, {
    original: phone,
    formatted: cleaned,
  });

  return cleaned;
};


// ========================================
// Hook Principal useMessages
// ========================================
export const useMessages = (params: UseMessagesParams | string): UseMessagesReturn => {
  // Suporte para chamada antiga (apenas leadId string)
  const { leadId, leadPhone, leadName } = typeof params === 'string'
    ? { leadId: params, leadPhone: '', leadName: undefined }
    : params;

  // ========================================
  // Estados
  // ========================================
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyInfo | null>(null);
  const [instanceName, setInstanceName] = useState<string>('');

  // ========================================
  // Funcao para salvar mensagem no contexto
  // ========================================
  const saveToContext = useCallback(async (
    sender: 'LEAD' | 'VENDEDOR',
    content: string
  ) => {
    try {
      console.log(`${LOG_PREFIX} Salvando mensagem no contexto:`, {
        leadId: leadPhone || leadId,
        sender,
        content: content.substring(0, 50) + '...',
      });

      await aiService.saveMessageToContext(
        leadPhone || leadId,            //......Usa telefone como ID
        sender,                          //......Quem enviou
        content,                         //......Conteudo
        leadName                         //......Nome do lead
      );

      console.log(`${LOG_PREFIX} Mensagem salva no contexto com sucesso`);
    } catch (error) {
      console.error(`${LOG_PREFIX} Erro ao salvar no contexto:`, error);
      // Nao propaga erro - salvar contexto nao deve bloquear envio
    }
  }, [leadId, leadPhone, leadName]);

  // ========================================
  // Obter nome da instancia no mount
  // ========================================
  useEffect(() => {
    const loadInstanceName = async () => {
      console.log(`${LOG_PREFIX} Carregando instanceName...`);

      try {
        // TODO: Obter userId real do contexto de autenticacao
        const userId = 'vendedor-1';
        const name = await instanceManager.getInstance(userId);

        console.log(`${LOG_PREFIX} instanceName carregado:`, name);
        setInstanceName(name || '');
      } catch (error) {
        console.error(`${LOG_PREFIX} Erro ao carregar instanceName:`, error);
      }
    };

    loadInstanceName();
  }, []);

  // ========================================
  // Enviar Mensagem de Texto
  // ========================================
  const sendTextMessage = useCallback(async (text: string) => {
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: sendTextMessage`);
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} Texto:`, text);
    console.log(`${LOG_PREFIX} leadId:`, leadId);
    console.log(`${LOG_PREFIX} leadPhone:`, leadPhone);
    console.log(`${LOG_PREFIX} instanceName:`, instanceName);
    console.log(`${LOG_PREFIX} replyingTo:`, replyingTo);

    // Validacao do texto
    if (!text.trim()) {
      console.warn(`${LOG_PREFIX} Texto vazio, ignorando envio`);
      return;
    }

    // Validacao do telefone
    if (!leadPhone) {
      console.error(`${LOG_PREFIX} ERRO: leadPhone esta vazio!`);
      console.error(`${LOG_PREFIX} Nao e possivel enviar mensagem sem numero`);
      return;
    }

    // Validacao da instancia
    if (!instanceName) {
      console.error(`${LOG_PREFIX} ERRO: instanceName esta vazio!`);
      console.error(`${LOG_PREFIX} Nao e possivel enviar mensagem sem instancia`);
      return;
    }

    // Criar mensagem local
    const content: TextContent = {
      text: text.trim(),                  //......Texto limpo
    };

    const newMessage: WhatsAppMessage = {
      id: generateMessageId(),            //......ID unico
      type: 'text',                       //......Tipo texto
      direction: 'outgoing',              //......Enviada
      content,                            //......Conteudo
      timestamp: new Date(),              //......Data atual
      status: 'pending',                  //......Status inicial
      senderId: 'user-1',                 //......ID do usuario
      replyTo: replyingTo || undefined,   //......Reply se houver
    };

    console.log(`${LOG_PREFIX} Mensagem criada localmente:`, {
      id: newMessage.id,
      type: newMessage.type,
      status: newMessage.status,
    });

    // Adiciona mensagem localmente (otimista)
    setMessages((prev) => [...prev, newMessage]);
    setReplyingTo(null);
    setIsSending(true);

    // Formatar numero para API
    const formattedPhone = formatPhoneNumber(leadPhone);

    console.log(`${LOG_PREFIX} Preparando chamada para Evolution API:`);
    console.log(`${LOG_PREFIX}   - instanceName: ${instanceName}`);
    console.log(`${LOG_PREFIX}   - number: ${formattedPhone}`);
    console.log(`${LOG_PREFIX}   - text: ${text.trim()}`);

    try {
      // Chamar Evolution API
      console.log(`${LOG_PREFIX} Chamando evolutionService.sendText()...`);

      const response = await evolutionService.sendText(
        instanceName,
        formattedPhone,
        text.trim()
      );

      console.log(`${LOG_PREFIX} Resposta da Evolution API:`, JSON.stringify(response, null, 2));

      // Verificar se teve erro
      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO na resposta da API:`, response.error);

        // Atualiza status para erro
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
      } else {
        console.log(`${LOG_PREFIX} Mensagem enviada com sucesso!`);
        console.log(`${LOG_PREFIX} Key da mensagem:`, response.key);

        // Salva messageKey para uso em reacoes
        const messageKey: MessageKey | undefined = response.key
          ? {
              id: response.key.id,
              remoteJid: response.key.remoteJid,
              fromMe: response.key.fromMe,
            }
          : undefined;

        // Atualiza status para enviado
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  status: 'sent' as MessageStatus,
                  messageKey,                       //......Salva chave para reacoes
                }
              : msg
          )
        );

        // Salva mensagem no contexto (arquivo TXT)
        saveToContext('VENDEDOR', text.trim());
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} EXCECAO ao enviar mensagem:`, error);
      console.error(`${LOG_PREFIX} Stack:`, (error as Error).stack);

      // Atualiza status para erro
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
    } finally {
      setIsSending(false);
      console.log(`${LOG_PREFIX} ========================================`);
      console.log(`${LOG_PREFIX} FIM: sendTextMessage`);
      console.log(`${LOG_PREFIX} ========================================`);
    }
  }, [leadId, leadPhone, instanceName, replyingTo, saveToContext]);

  // ========================================
  // Enviar Mensagem de Audio
  // ========================================
  const sendAudioMessage = useCallback(async (uri: string, duration: number) => {
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: sendAudioMessage`);
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} URI:`, uri);
    console.log(`${LOG_PREFIX} Duration:`, duration);
    console.log(`${LOG_PREFIX} leadPhone:`, leadPhone);
    console.log(`${LOG_PREFIX} instanceName:`, instanceName);

    const newMessage: WhatsAppMessage = {
      id: generateMessageId(),            //......ID unico
      type: 'audio',                      //......Tipo audio
      direction: 'outgoing',              //......Enviada
      content: {
        url: uri,                         //......URL do audio
        duration,                         //......Duracao
        mimeType: 'audio/mpeg',           //......Tipo MIME
      },
      timestamp: new Date(),              //......Data atual
      status: 'pending',                  //......Status inicial
      senderId: 'user-1',                 //......ID do usuario
    };

    // Adiciona mensagem localmente
    setMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    // Validacoes
    if (!leadPhone || !instanceName) {
      console.error(`${LOG_PREFIX} ERRO: leadPhone ou instanceName vazio`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
      setIsSending(false);
      return;
    }

    const formattedPhone = formatPhoneNumber(leadPhone);

    try {
      // Converte blob URL para base64 puro
      console.log(`${LOG_PREFIX} Convertendo audio para base64...`);
      let audioBase64 = uri;

      // Se for blob URL, converte para base64 puro
      if (uri.startsWith('blob:')) {
        audioBase64 = await blobUrlToBase64(uri);
        console.log(`${LOG_PREFIX} Audio convertido para base64`);
      }

      console.log(`${LOG_PREFIX} Chamando evolutionService.sendAudio()...`);

      const response = await evolutionService.sendAudio(
        instanceName,
        formattedPhone,
        audioBase64
      );

      console.log(`${LOG_PREFIX} Resposta da API (audio):`, JSON.stringify(response, null, 2));

      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO ao enviar audio:`, response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
      } else {
        console.log(`${LOG_PREFIX} Audio enviado com sucesso!`);
        console.log(`${LOG_PREFIX} messageKey:`, response.key);

        // Salva messageKey para uso em reacoes
        const messageKey: MessageKey | undefined = response.key
          ? {
              id: response.key.id,
              remoteJid: response.key.remoteJid,
              fromMe: response.key.fromMe,
            }
          : undefined;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  status: 'sent' as MessageStatus,
                  messageKey,                       //......Salva chave para reacoes
                }
              : msg
          )
        );

        // Salva no contexto (arquivo TXT)
        saveToContext('VENDEDOR', `[AUDIO: ${duration}s]`);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} EXCECAO ao enviar audio:`, error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
    } finally {
      setIsSending(false);
      console.log(`${LOG_PREFIX} FIM: sendAudioMessage`);
    }
  }, [leadPhone, instanceName, saveToContext]);

  // ========================================
  // Retry Mensagem de Audio
  // ========================================
  const retryAudioMessage = useCallback(async (message: WhatsAppMessage): Promise<boolean> => {
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: retryAudioMessage`);
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} messageId:`, message.id);

    // Verifica se e mensagem de audio
    if (message.type !== 'audio') {
      console.error(`${LOG_PREFIX} ERRO: Mensagem nao e de audio`);
      return false;
    }

    // Extrai dados do content
    const audioContent = message.content as { url: string; duration: number };
    if (!audioContent.url || !audioContent.duration) {
      console.error(`${LOG_PREFIX} ERRO: Content invalido`);
      return false;
    }

    // Atualiza status para pending
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id
          ? { ...msg, status: 'pending' as MessageStatus }
          : msg
      )
    );

    // Validacoes
    if (!leadPhone || !instanceName) {
      console.error(`${LOG_PREFIX} ERRO: leadPhone ou instanceName vazio`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
      return false;
    }

    const formattedPhone = formatPhoneNumber(leadPhone);

    try {
      // Converte blob URL para base64 puro
      console.log(`${LOG_PREFIX} Convertendo audio para base64...`);
      let audioBase64 = audioContent.url;

      // Se for blob URL, converte para base64 puro
      if (audioContent.url.startsWith('blob:')) {
        audioBase64 = await blobUrlToBase64(audioContent.url);
        console.log(`${LOG_PREFIX} Audio convertido para base64`);
      }

      console.log(`${LOG_PREFIX} Chamando evolutionService.sendAudio() [RETRY]...`);

      const response = await evolutionService.sendAudio(
        instanceName,
        formattedPhone,
        audioBase64
      );

      console.log(`${LOG_PREFIX} Resposta da API (audio retry):`, JSON.stringify(response, null, 2));

      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO ao reenviar audio:`, response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
        return false;
      } else {
        console.log(`${LOG_PREFIX} Audio reenviado com sucesso!`);

        // Salva messageKey para uso em reacoes
        const messageKey: MessageKey | undefined = response.key
          ? {
              id: response.key.id,
              remoteJid: response.key.remoteJid,
              fromMe: response.key.fromMe,
            }
          : undefined;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id
              ? {
                  ...msg,
                  status: 'sent' as MessageStatus,
                  messageKey,
                }
              : msg
          )
        );
        return true;
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} EXCECAO ao reenviar audio:`, error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
      return false;
    } finally {
      console.log(`${LOG_PREFIX} FIM: retryAudioMessage`);
    }
  }, [leadPhone, instanceName]);

  // ========================================
  // Enviar Mensagem de Imagem
  // ========================================
  const sendImageMessage = useCallback(async (
    uri: string,
    width: number,
    height: number
  ) => {
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: sendImageMessage`);
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} URI:`, uri);
    console.log(`${LOG_PREFIX} Dimensoes:`, { width, height });

    const newMessage: WhatsAppMessage = {
      id: generateMessageId(),            //......ID unico
      type: 'image',                      //......Tipo imagem
      direction: 'outgoing',              //......Enviada
      content: {
        url: uri,                         //......URL da imagem
        width,                            //......Largura
        height,                           //......Altura
      },
      timestamp: new Date(),              //......Data atual
      status: 'pending',                  //......Status inicial
      senderId: 'user-1',                 //......ID do usuario
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    if (!leadPhone || !instanceName) {
      console.error(`${LOG_PREFIX} ERRO: leadPhone ou instanceName vazio`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
      setIsSending(false);
      return;
    }

    const formattedPhone = formatPhoneNumber(leadPhone);

    try {
      // Converter blob URL para base64 se necessario
      let imageData = uri;
      if (uri.startsWith('blob:')) {
        console.log(`${LOG_PREFIX} Detectado blob URL, convertendo para base64...`);
        const base64 = await blobUrlToBase64(uri);
        // Evolution API v2.x: base64 PURO sem prefixo
        imageData = base64;
        console.log(`${LOG_PREFIX} Imagem convertida para base64 puro, tamanho:`, imageData.length);
      }

      console.log(`${LOG_PREFIX} Chamando evolutionService.sendImage()...`);

      const response = await evolutionService.sendImage(
        instanceName,
        formattedPhone,
        imageData
      );

      console.log(`${LOG_PREFIX} Resposta da API (imagem):`, JSON.stringify(response, null, 2));

      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO ao enviar imagem:`, response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
      } else {
        console.log(`${LOG_PREFIX} Imagem enviada com sucesso!`);
        console.log(`${LOG_PREFIX} messageKey:`, response.key);

        // Salva messageKey para uso em reacoes
        const messageKey: MessageKey | undefined = response.key
          ? {
              id: response.key.id,
              remoteJid: response.key.remoteJid,
              fromMe: response.key.fromMe,
            }
          : undefined;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  status: 'sent' as MessageStatus,
                  messageKey,                       //......Salva chave para reacoes
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} EXCECAO ao enviar imagem:`, error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
    } finally {
      setIsSending(false);
      console.log(`${LOG_PREFIX} FIM: sendImageMessage`);
    }
  }, [leadPhone, instanceName]);

  // ========================================
  // Enviar Mensagem de Documento
  // ========================================
  const sendDocumentMessage = useCallback(async (
    uri: string,
    fileName: string,
    fileSize: number
  ) => {
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: sendDocumentMessage`);
    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} URI:`, uri);
    console.log(`${LOG_PREFIX} FileName:`, fileName);
    console.log(`${LOG_PREFIX} FileSize:`, fileSize);

    const newMessage: WhatsAppMessage = {
      id: generateMessageId(),            //......ID unico
      type: 'document',                   //......Tipo documento
      direction: 'outgoing',              //......Enviada
      content: {
        url: uri,                         //......URL do documento
        fileName,                         //......Nome do arquivo
        fileSize,                         //......Tamanho
        mimeType: 'application/pdf',      //......Tipo MIME
      },
      timestamp: new Date(),              //......Data atual
      status: 'pending',                  //......Status inicial
      senderId: 'user-1',                 //......ID do usuario
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    if (!leadPhone || !instanceName) {
      console.error(`${LOG_PREFIX} ERRO: leadPhone ou instanceName vazio`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
      setIsSending(false);
      return;
    }

    const formattedPhone = formatPhoneNumber(leadPhone);

    try {
      console.log(`${LOG_PREFIX} Chamando evolutionService.sendDocument()...`);

      const response = await evolutionService.sendDocument(
        instanceName,
        formattedPhone,
        uri,
        fileName
      );

      console.log(`${LOG_PREFIX} Resposta da API (documento):`, JSON.stringify(response, null, 2));

      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO ao enviar documento:`, response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
      } else {
        console.log(`${LOG_PREFIX} Documento enviado com sucesso!`);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'sent' as MessageStatus }
              : msg
          )
        );
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} EXCECAO ao enviar documento:`, error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as MessageStatus }
            : msg
        )
      );
    } finally {
      setIsSending(false);
      console.log(`${LOG_PREFIX} FIM: sendDocumentMessage`);
    }
  }, [leadPhone, instanceName]);

  // ========================================
  // Definir Reply To
  // ========================================
  const setReplyTo = useCallback((info: ReplyInfo | null) => {
    console.log(`${LOG_PREFIX} setReplyTo:`, info);
    setReplyingTo(info);                  //......Define reply
  }, []);

  // ========================================
  // Deletar Mensagem
  // ========================================
  const deleteMessage = useCallback((messageId: string) => {
    console.log(`${LOG_PREFIX} deleteMessage:`, messageId);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              type: 'deleted' as const,
              content: { text: 'Mensagem apagada' },
            }
          : msg
      )
    );
  }, []);

  // ========================================
  // Atualizar Reacao da Mensagem
  // ========================================
  const updateMessageReaction = useCallback((
    messageId: string,
    reaction: string | null
  ) => {
    console.log(`${LOG_PREFIX} updateMessageReaction:`, { messageId, reaction });
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, reaction: reaction || undefined }
          : msg
      )
    );
  }, []);

  // ========================================
  // Recarregar Mensagens
  // ========================================
  const refreshMessages = useCallback(() => {
    console.log(`${LOG_PREFIX} refreshMessages chamado`);
    setIsLoading(true);

    // TODO: Implementar busca de mensagens da API
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // ========================================
  // Log de estado inicial
  // ========================================
  useEffect(() => {
    console.log(`${LOG_PREFIX} Hook inicializado com:`, {
      leadId,
      leadPhone,
      instanceName,
      messagesCount: messages.length,
    });
  }, [leadId, leadPhone, instanceName, messages.length]);

  // ========================================
  // Retorno do Hook
  // ========================================
  return {
    messages,                             //......Mensagens
    isLoading,                            //......Loading
    isSending,                            //......Enviando
    replyingTo,                           //......Reply info
    instanceName,                         //......Nome da instancia
    sendTextMessage,                      //......Envia texto
    sendAudioMessage,                     //......Envia audio
    sendImageMessage,                     //......Envia imagem
    sendDocumentMessage,                  //......Envia documento
    setReplyTo,                           //......Define reply
    deleteMessage,                        //......Deleta mensagem
    updateMessageReaction,                //......Atualiza reacao
    refreshMessages,                      //......Recarrega
    retryAudioMessage,                    //......Retry audio
  };
};

// ========================================
// Export Default
// ========================================
export default useMessages;
