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
  useRef,                                 //......Hook de referencia
} from 'react';                           //......Biblioteca React

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos do chat
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  LinkPreview,                            //......Preview de link
  MessageStatus,                          //......Status
  MessageType,                            //......Tipo mensagem
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
  pausePolling: () => void;               //......Pausa polling (emoji picker)
  resumePolling: () => void;              //......Retoma polling
}

// ========================================
// Interface para resultado da conversao blob
// ========================================
interface BlobConversionResult {
  base64: string;                               //......Base64 puro
  mimeType: string;                             //......Tipo MIME do arquivo
  isVideo: boolean;                             //......Se e video
  isImage: boolean;                             //......Se e imagem
}

// ========================================
// Funcao auxiliar para converter blob URL para base64
// Retorna objeto com base64 e tipo MIME
// ========================================
const blobUrlToBase64 = async (blobUrl: string): Promise<BlobConversionResult> => {
  console.log(`${LOG_PREFIX} Convertendo blob URL para base64...`);

  try {
    // Busca o blob a partir da URL
    const response = await fetch(blobUrl);       //......Fetch do blob
    const blob = await response.blob();          //......Converte para blob

    const mimeType = blob.type || 'application/octet-stream';
    const isVideo = mimeType.startsWith('video/');
    const isImage = mimeType.startsWith('image/');

    console.log(`${LOG_PREFIX} Blob type:`, mimeType);
    console.log(`${LOG_PREFIX} Blob size:`, blob.size);
    console.log(`${LOG_PREFIX} isVideo:`, isVideo);
    console.log(`${LOG_PREFIX} isImage:`, isImage);

    // Converte blob para base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();           //......Leitor de arquivo

      reader.onloadend = () => {
        const dataUrl = reader.result as string; //......Resultado data URL
        // Extrai apenas o base64 puro (remove prefixo data:xxx;base64,)
        // Evolution API espera base64 puro sem prefixo
        const base64 = dataUrl.split(',')[1] || dataUrl;
        console.log(`${LOG_PREFIX} Data URL completo length:`, dataUrl?.length);
        console.log(`${LOG_PREFIX} Base64 puro length:`, base64?.length);
        console.log(`${LOG_PREFIX} Base64 prefix:`, base64?.substring(0, 30));
        resolve({
          base64,                                //......Base64 puro
          mimeType,                              //......Tipo MIME
          isVideo,                               //......Se e video
          isImage,                               //......Se e imagem
        });
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
  // Obter nome da instancia (sincrono para evitar race condition)
  // ========================================
  useEffect(() => {
    // TODO: Obter userId real do contexto de autenticacao
    const userId = 'vendedor-1';

    // Usa nome padronizado diretamente (evita race condition)
    const name = `partners_${userId}`;

    console.log(`${LOG_PREFIX} instanceName definido:`, name);
    setInstanceName(name);
  }, []);

  // ========================================
  // Ref para controle de polling
  // ========================================
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const pollingPausedRef = useRef<boolean>(false); //......Flag polling pausado

  // ========================================
  // Converter mensagem da API para formato local
  // ========================================
  const convertApiMessage = useCallback((apiMsg: any): WhatsAppMessage | null => {
    try {
      // Ignorar mensagens de sistema
      if (!apiMsg.key || !apiMsg.message) {
        console.log(`${LOG_PREFIX} [convertApiMessage] IGNORADA (sem key ou message):`, {
          hasKey: !!apiMsg.key,
          hasMessage: !!apiMsg.message,
          keyId: apiMsg?.key?.id,
          fromMe: apiMsg?.key?.fromMe,
        });
        return null;
      }

      // fromMe indica se foi enviada pelo vendedor
      const isFromMe = apiMsg.key.fromMe === true;

      // ID unico: usa ID interno da API (que e garantidamente unico)
      // Fallback para key.id + timestamp se nao houver ID interno
      const messageId = apiMsg.id || `${apiMsg.key.id}_${apiMsg.messageTimestamp}`;

      // Debug: log da mensagem sendo convertida
      const extendedText = apiMsg.message.extendedTextMessage;

      // Debug: verificar campos disponiveis para link preview
      // Detectar URL em qualquer tipo de mensagem (conversation ou extendedText)
      const rawText = apiMsg.message.conversation || extendedText?.text || '';
      const hasUrl = /https?:\/\/[^\s]+/.test(rawText);

      if (hasUrl) {
        console.log('[LINK_PREVIEW_DEBUG] ==============================');
        console.log('[LINK_PREVIEW_DEBUG] Mensagem com URL detectada');
        console.log('[LINK_PREVIEW_DEBUG] ID:', messageId);
        console.log('[LINK_PREVIEW_DEBUG] Texto:', rawText.substring(0, 80));
        console.log('[LINK_PREVIEW_DEBUG] Tipo: ' + (apiMsg.message.conversation ? 'conversation' : 'extendedTextMessage'));
        console.log('[LINK_PREVIEW_DEBUG] hasExtendedText:', !!extendedText);

        if (extendedText) {
          console.log('[LINK_PREVIEW_DEBUG] extendedText.matchedText:', extendedText.matchedText);
          console.log('[LINK_PREVIEW_DEBUG] extendedText.canonicalUrl:', extendedText.canonicalUrl);
          console.log('[LINK_PREVIEW_DEBUG] extendedText.title:', extendedText.title);
          console.log('[LINK_PREVIEW_DEBUG] extendedText.description:', extendedText.description);
          console.log('[LINK_PREVIEW_DEBUG] extendedText.jpegThumbnail:', !!extendedText.jpegThumbnail);
          console.log('[LINK_PREVIEW_DEBUG] extendedText.previewType:', extendedText.previewType);
          console.log('[LINK_PREVIEW_DEBUG] Todas as chaves:', Object.keys(extendedText));
        } else {
          console.log('[LINK_PREVIEW_DEBUG] SEM extendedTextMessage - link preview NAO disponivel pela API');
        }
        console.log('[LINK_PREVIEW_DEBUG] ==============================');
      }

      // Evolution API armazena contextInfo no nivel raiz da mensagem
      // Verificar ambos locais: nivel raiz e dentro de extendedTextMessage
      const contextInfo = apiMsg.contextInfo || extendedText?.contextInfo;

      console.log(`${LOG_PREFIX} [convertApiMessage] Processando:`, {
        id: messageId,
        fromMe: isFromMe,
        direction: isFromMe ? 'outgoing' : 'incoming',
        hasConversation: !!apiMsg.message.conversation,
        hasExtendedText: !!extendedText,
        hasRootContextInfo: !!apiMsg.contextInfo,
        hasContextInfo: !!contextInfo,
        isReply: !!contextInfo?.quotedMessage,
        stanzaId: contextInfo?.stanzaId || null,
      });

      // Extrair texto da mensagem
      let text = '';
      if (apiMsg.message.conversation) {
        text = apiMsg.message.conversation;
      } else if (extendedText?.text) {
        text = extendedText.text;
      }

      // Se nao tem texto, ignorar (por enquanto so suportamos texto)
      if (!text) {
        // Detectar tipo da mensagem para log mais informativo
        const msgTypes = Object.keys(apiMsg.message || {}).filter(k => k !== 'messageContextInfo');
        console.log(`${LOG_PREFIX} [convertApiMessage] IGNORADA (sem texto):`, {
          id: messageId,
          fromMe: isFromMe,
          direction: isFromMe ? 'outgoing' : 'incoming',
          tipos: msgTypes,
        });
        return null;
      }

      // Extrair informacoes de reply (contextInfo)
      let replyTo: ReplyInfo | undefined;
      if (contextInfo?.quotedMessage && contextInfo?.stanzaId) {
        const quotedMsg = contextInfo.quotedMessage;
        const quotedParticipant = contextInfo.participant || '';
        const isQuotedFromMe = quotedParticipant.includes(apiMsg.key.remoteJid?.split('@')[0] || '') === false;

        // Determinar tipo e conteudo da mensagem citada
        let quotedType: MessageType = 'text';
        let quotedContent = '';

        if (quotedMsg.conversation) {
          quotedContent = quotedMsg.conversation;
        } else if (quotedMsg.extendedTextMessage?.text) {
          quotedContent = quotedMsg.extendedTextMessage.text;
        } else if (quotedMsg.imageMessage) {
          quotedType = 'image';
          quotedContent = quotedMsg.imageMessage.caption || 'Foto';
        } else if (quotedMsg.videoMessage) {
          quotedType = 'video';
          quotedContent = quotedMsg.videoMessage.caption || 'Vídeo';
        } else if (quotedMsg.audioMessage) {
          quotedType = 'audio';
          quotedContent = 'Mensagem de áudio';
        } else if (quotedMsg.documentMessage) {
          quotedType = 'document';
          quotedContent = quotedMsg.documentMessage.fileName || 'Documento';
        }

        // Extrair thumbnail da mensagem citada (link preview ou imagem)
        let quotedThumbnail: string | undefined;
        const quotedExtended = quotedMsg.extendedTextMessage;
        if (quotedExtended?.jpegThumbnail) {
          quotedThumbnail = typeof quotedExtended.jpegThumbnail === 'string'
            ? `data:image/jpeg;base64,${quotedExtended.jpegThumbnail}`
            : undefined;
        } else if (quotedMsg.imageMessage?.jpegThumbnail) {
          quotedThumbnail = typeof quotedMsg.imageMessage.jpegThumbnail === 'string'
            ? `data:image/jpeg;base64,${quotedMsg.imageMessage.jpegThumbnail}`
            : undefined;
        } else if (quotedMsg.videoMessage?.jpegThumbnail) {
          quotedThumbnail = typeof quotedMsg.videoMessage.jpegThumbnail === 'string'
            ? `data:image/jpeg;base64,${quotedMsg.videoMessage.jpegThumbnail}`
            : undefined;
        }

        // Extrair URL do texto da mensagem citada (para busca de thumbnail)
        let quotedLinkUrl: string | undefined;
        const quotedRawText = quotedMsg.conversation || quotedExtended?.text || quotedContent;
        const quotedUrlMatch = quotedRawText.match(/https?:\/\/[^\s]+/);
        if (quotedUrlMatch) {
          quotedLinkUrl = quotedUrlMatch[0];
        }

        // Nome no formato WhatsApp: nome salvo ou +telefone ~pushName
        let quotedSenderName = 'Você';
        if (!isQuotedFromMe) {
          const hasRealName = leadName && !/^[\d\s\+\-\(\)]+$/.test(leadName.trim());
          if (hasRealName) {
            quotedSenderName = leadName;
          } else {
            const clean = leadPhone.replace(/\D/g, '');
            const phone = clean.length === 13 && clean.startsWith('55')
              ? `+${clean.slice(0,2)} ${clean.slice(2,4)} ${clean.slice(4,9)}-${clean.slice(9)}`
              : clean.length === 12 && clean.startsWith('55')
                ? `+${clean.slice(0,2)} ${clean.slice(2,4)} ${clean.slice(4,8)}-${clean.slice(8)}`
                : leadPhone.startsWith('+') ? leadPhone : `+${leadPhone}`;
            quotedSenderName = apiMsg.pushName ? `${phone} ~${apiMsg.pushName}` : phone;
          }
        }
        replyTo = {
          messageId: contextInfo.stanzaId,
          senderName: quotedSenderName,
          content: quotedContent,
          type: quotedType,
          thumbnail: quotedThumbnail,
          linkUrl: quotedLinkUrl,
        };
      }

      // Extrair link preview do extendedTextMessage (OG metadata do WhatsApp)
      let linkPreview: LinkPreview | undefined;
      if (extendedText?.matchedText || extendedText?.canonicalUrl) {
        const thumbnailBase64 = extendedText.jpegThumbnail;
        let thumbnailUri: string | undefined;

        // Converter thumbnail base64 para data URI
        if (thumbnailBase64) {
          thumbnailUri = typeof thumbnailBase64 === 'string'
            ? `data:image/jpeg;base64,${thumbnailBase64}`
            : undefined;
        }

        linkPreview = {
          url: extendedText.canonicalUrl || extendedText.matchedText,
          title: extendedText.title || undefined,
          description: extendedText.description || undefined,
          thumbnail: thumbnailUri,
          previewType: extendedText.previewType ?? 0,
        };

        console.log('[LINK_PREVIEW_DEBUG] LinkPreview extraido do extendedText:', {
          url: linkPreview.url,
          hasTitle: !!linkPreview.title,
          hasDescription: !!linkPreview.description,
          hasThumbnail: !!linkPreview.thumbnail,
          previewType: linkPreview.previewType,
        });
      }

      // Fallback: se nao tem extendedTextMessage mas o texto contem URL,
      // criar linkPreview basico com apenas a URL (componente buscara metadados)
      if (!linkPreview && hasUrl) {
        const urlMatch = rawText.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          linkPreview = {
            url: urlMatch[0],
          };
          console.log('[LINK_PREVIEW_DEBUG] LinkPreview criado via fallback (URL detectada):', linkPreview.url);
        }
      }

      const content: TextContent = { text, linkPreview };
      const timestamp = apiMsg.messageTimestamp || Date.now();

      const result: WhatsAppMessage = {
        id: messageId,
        type: 'text',
        direction: isFromMe ? 'outgoing' : 'incoming',
        content,
        timestamp: new Date(timestamp * 1000),
        status: 'delivered' as MessageStatus,
        senderId: isFromMe ? 'user-1' : leadId,
        senderName: isFromMe ? undefined : (apiMsg.pushName || undefined),
        replyTo,
        messageKey: {
          id: apiMsg.key.id,
          remoteJid: apiMsg.key.remoteJid,
          fromMe: isFromMe,
        },
      };

      console.log(`${LOG_PREFIX} [convertApiMessage] Mensagem convertida:`, {
        id: result.id,
        direction: result.direction,
        text: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
      });

      return result;
    } catch (error) {
      console.error(`${LOG_PREFIX} Erro ao converter mensagem:`, error);
      return null;
    }
  }, [leadId]);

  // ========================================
  // Carregar mensagens da API
  // ========================================
  const loadMessagesFromApi = useCallback(async () => {
    if (!instanceName || !leadPhone) {
      console.log(`${LOG_PREFIX} Aguardando instanceName/leadPhone para carregar mensagens`);
      return;
    }

    console.log(`${LOG_PREFIX} ========================================`);
    console.log(`${LOG_PREFIX} INICIO: loadMessagesFromApi`);
    console.log(`${LOG_PREFIX} instanceName:`, instanceName);
    console.log(`${LOG_PREFIX} leadPhone:`, leadPhone);
    console.log(`${LOG_PREFIX} ========================================`);
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(leadPhone);
      console.log(`${LOG_PREFIX} formattedPhone:`, formattedPhone);
      console.log(`${LOG_PREFIX} remoteJid será:`, `${formattedPhone}@s.whatsapp.net`);

      const apiMessages = await evolutionService.getMessages(
        instanceName,
        formattedPhone,
        100  // Aumentado para buscar mais mensagens (incluir do lead)
      );

      console.log(`${LOG_PREFIX} Mensagens recebidas da API:`, apiMessages?.length || 0);

      // Debug: Logar primeiras mensagens da API para verificar estrutura
      if (apiMessages?.length > 0) {
        console.log(`${LOG_PREFIX} AMOSTRA - Primeira mensagem da API:`);
        console.log(JSON.stringify(apiMessages[0], null, 2));
        console.log(`${LOG_PREFIX} AMOSTRA - Ultima mensagem da API:`);
        console.log(JSON.stringify(apiMessages[apiMessages.length - 1], null, 2));

        // Contar mensagens por fromMe antes da conversao
        const fromMeTrue = apiMessages.filter((m: any) => m.key?.fromMe === true).length;
        const fromMeFalse = apiMessages.filter((m: any) => m.key?.fromMe === false).length;
        console.log(`${LOG_PREFIX} API RAW: fromMe=true: ${fromMeTrue}, fromMe=false: ${fromMeFalse}`);
      }

      if (Array.isArray(apiMessages) && apiMessages.length > 0) {
        // Deduplicar mensagens da API usando Map (por ID interno)
        const uniqueApiMessages = new Map<string, any>();
        apiMessages.forEach(msg => {
          const id = msg.id || `${msg.key?.id}_${msg.messageTimestamp}`;
          if (!uniqueApiMessages.has(id)) {
            uniqueApiMessages.set(id, msg);
          }
        });

        console.log(`${LOG_PREFIX} Mensagens unicas da API:`, uniqueApiMessages.size);

        // Converter mensagens da API
        const convertedMessages = Array.from(uniqueApiMessages.values())
          .map(convertApiMessage)
          .filter((msg): msg is WhatsAppMessage => msg !== null)
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        // Contar mensagens por direcao
        const incomingCount = convertedMessages.filter(m => m.direction === 'incoming').length;
        const outgoingCount = convertedMessages.filter(m => m.direction === 'outgoing').length;
        console.log(`${LOG_PREFIX} Mensagens convertidas: ${convertedMessages.length} (incoming: ${incomingCount}, outgoing: ${outgoingCount})`);

        // Atualizar ultima mensagem para polling
        if (convertedMessages.length > 0) {
          lastMessageIdRef.current = convertedMessages[convertedMessages.length - 1].id;
        }

        // Mesclar com mensagens locais (evitar duplicatas)
        setMessages(prev => {
          console.log(`${LOG_PREFIX} Estado anterior: ${prev.length} mensagens`);

          // Usar Map para deduplicacao perfeita (por ID)
          const messagesMap = new Map<string, WhatsAppMessage>();

          // Criar indice de messageKey.id para verificar duplicatas
          const messageKeyIndex = new Map<string, string>();

          // Adicionar mensagens existentes
          prev.forEach(m => {
            messagesMap.set(m.id, m);
            // Indexar pelo messageKey.id tambem
            if (m.messageKey?.id) {
              messageKeyIndex.set(m.messageKey.id, m.id);
            }
          });

          // Adicionar novas mensagens (verificando duplicatas)
          let newCount = 0;
          convertedMessages.forEach(m => {
            // Verificar se ja existe pelo ID
            if (messagesMap.has(m.id)) {
              console.log(`${LOG_PREFIX} Mensagem duplicada pelo ID: ${m.id}`);
              return;
            }

            // Verificar se ja existe pelo messageKey.id
            if (m.messageKey?.id && messageKeyIndex.has(m.messageKey.id)) {
              console.log(`${LOG_PREFIX} Mensagem duplicada pelo messageKey: ${m.messageKey.id}`);
              return;
            }

            newCount++;
            messagesMap.set(m.id, m);
            if (m.messageKey?.id) {
              messageKeyIndex.set(m.messageKey.id, m.id);
            }
          });

          if (newCount === 0) {
            console.log(`${LOG_PREFIX} Nenhuma mensagem nova`);
            return prev;
          }

          // Converter Map de volta para array e ordenar
          const merged = Array.from(messagesMap.values())
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          console.log(`${LOG_PREFIX} Novas mensagens: ${newCount}, Total: ${merged.length}`);
          return merged;
        });
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Erro ao carregar mensagens:`, error);
    } finally {
      setIsLoading(false);
      console.log(`${LOG_PREFIX} FIM: loadMessagesFromApi`);
    }
  }, [instanceName, leadPhone, convertApiMessage]);

  // ========================================
  // Iniciar polling de mensagens
  // ========================================
  useEffect(() => {
    // Carregar mensagens iniciais
    if (instanceName && leadPhone) {
      loadMessagesFromApi();

      // Iniciar polling (a cada 5 segundos)
      // Verifica flag pausado antes de executar
      pollingIntervalRef.current = setInterval(() => {
        if (!pollingPausedRef.current) {
          loadMessagesFromApi();
        }
      }, 5000);

      console.log(`${LOG_PREFIX} Polling iniciado (5s)`);
    }

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log(`${LOG_PREFIX} Polling parado`);
      }
    };
  }, [instanceName, leadPhone, loadMessagesFromApi]);

  // ========================================
  // Pausar Polling (para emoji picker)
  // ========================================
  const pausePolling = useCallback(() => {
    pollingPausedRef.current = true; //......Pausa polling
    console.log(`${LOG_PREFIX} Polling PAUSADO (emoji picker aberto)`);
  }, []);

  // ========================================
  // Retomar Polling
  // ========================================
  const resumePolling = useCallback(() => {
    pollingPausedRef.current = false; //......Retoma polling
    console.log(`${LOG_PREFIX} Polling RETOMADO`);
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
      // Construir objeto quoted para reply vinculado na API
      let quoted: { key: { id: string; remoteJid: string; fromMe: boolean }; message?: any } | undefined;
      if (replyingTo?.messageKey) {
        quoted = {
          key: {
            id: replyingTo.messageKey.id,        //......ID da mensagem citada
            remoteJid: replyingTo.messageKey.remoteJid,
            fromMe: replyingTo.messageKey.fromMe,
          },
          message: {
            conversation: replyingTo.content,    //......Texto da mensagem citada
          },
        };
        console.log(`${LOG_PREFIX} Quoted message key:`, JSON.stringify(quoted.key));
      }

      // Chamar Evolution API
      console.log(`${LOG_PREFIX} Chamando evolutionService.sendText()...`);

      const response = await evolutionService.sendText(
        instanceName,
        formattedPhone,
        text.trim(),
        quoted
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
        console.log(`${LOG_PREFIX} ID da API:`, response.id);

        // Salva messageKey para uso em reacoes
        const messageKey: MessageKey | undefined = response.key
          ? {
              id: response.key.id,
              remoteJid: response.key.remoteJid,
              fromMe: response.key.fromMe,
            }
          : undefined;

        // ID real da API (evita duplicacao no polling)
        // Usa o ID retornado pela API ou constroi a partir do key
        const apiMessageId = response.id || (response.key ? `${response.key.id}_${Math.floor(Date.now() / 1000)}` : newMessage.id);

        console.log(`${LOG_PREFIX} Atualizando ID local ${newMessage.id} para ${apiMessageId}`);

        // Atualiza status e ID para o ID da API (evita duplicacao)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  id: apiMessageId,                 //......Usa ID da API
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
        const result = await blobUrlToBase64(uri);
        audioBase64 = result.base64;
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
        const result = await blobUrlToBase64(audioContent.url);
        audioBase64 = result.base64;
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
  // Enviar Mensagem de Imagem ou Video
  // Detecta automaticamente se e video ou imagem
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

    // Inicialmente assume imagem
    const newMessage: WhatsAppMessage = {
      id: generateMessageId(),            //......ID unico
      type: 'image',                      //......Tipo inicial (pode mudar para video)
      direction: 'outgoing',              //......Enviada
      content: {
        url: uri,                         //......URL da midia
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
      // Converter blob URL para base64 e detectar tipo de midia
      let mediaData = uri;
      let isVideo = false;
      let mimeType = 'image/jpeg';

      console.log(`${LOG_PREFIX} URI tipo:`, uri.substring(0, 20));

      // Detectar video pela extensao do arquivo (fallback)
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.3gp', '.mkv'];
      const uriLower = uri.toLowerCase();
      const hasVideoExtension = videoExtensions.some(ext => uriLower.includes(ext));

      console.log(`${LOG_PREFIX} Tem extensao de video:`, hasVideoExtension);

      if (uri.startsWith('blob:')) {
        console.log(`${LOG_PREFIX} Detectado blob URL, convertendo e detectando tipo...`);
        const result = await blobUrlToBase64(uri);
        mediaData = result.base64;
        isVideo = result.isVideo;
        mimeType = result.mimeType;
        console.log(`${LOG_PREFIX} ========================================`);
        console.log(`${LOG_PREFIX} RESULTADO DA CONVERSAO BLOB:`);
        console.log(`${LOG_PREFIX} mimeType:`, mimeType);
        console.log(`${LOG_PREFIX} isVideo:`, isVideo);
        console.log(`${LOG_PREFIX} isImage:`, result.isImage);
        console.log(`${LOG_PREFIX} base64 length:`, mediaData.length);
        console.log(`${LOG_PREFIX} base64 prefix:`, mediaData.substring(0, 50));
        console.log(`${LOG_PREFIX} ========================================`);
      } else if (hasVideoExtension) {
        // URI nao e blob, mas tem extensao de video
        isVideo = true;
        mimeType = 'video/mp4';
        console.log(`${LOG_PREFIX} Detectado video por extensao`);
      }

      console.log(`${LOG_PREFIX} ========================================`);
      console.log(`${LOG_PREFIX} DECISAO FINAL:`);
      console.log(`${LOG_PREFIX} isVideo:`, isVideo);
      console.log(`${LOG_PREFIX} mimeType:`, mimeType);
      console.log(`${LOG_PREFIX} ========================================`);

      let response;

      if (isVideo) {
        // E um video - chamar sendVideo
        console.log(`${LOG_PREFIX} ========================================`);
        console.log(`${LOG_PREFIX} CHAMANDO sendVideo`);
        console.log(`${LOG_PREFIX} instanceName:`, instanceName);
        console.log(`${LOG_PREFIX} formattedPhone:`, formattedPhone);
        console.log(`${LOG_PREFIX} mimeType:`, mimeType);
        console.log(`${LOG_PREFIX} mediaData length:`, mediaData.length);
        console.log(`${LOG_PREFIX} ========================================`);

        // Atualiza o tipo da mensagem local para 'video'
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? {
                  ...msg,
                  type: 'video' as const,
                  content: {
                    ...msg.content,
                    mimeType,                       //......Adiciona mimeType ao content
                  },
                }
              : msg
          )
        );

        response = await evolutionService.sendVideo(
          instanceName,
          formattedPhone,
          mediaData,
          mimeType
        );

        console.log(`${LOG_PREFIX} Resposta da API (video):`, JSON.stringify(response, null, 2));
      } else {
        // E uma imagem - chamar sendImage
        console.log(`${LOG_PREFIX} ========================================`);
        console.log(`${LOG_PREFIX} CHAMANDO sendImage`);
        console.log(`${LOG_PREFIX} instanceName:`, instanceName);
        console.log(`${LOG_PREFIX} formattedPhone:`, formattedPhone);
        console.log(`${LOG_PREFIX} mediaData length:`, mediaData.length);
        console.log(`${LOG_PREFIX} ========================================`);

        response = await evolutionService.sendImage(
          instanceName,
          formattedPhone,
          mediaData
        );

        console.log(`${LOG_PREFIX} Resposta da API (imagem):`, JSON.stringify(response, null, 2));
      }

      if (response.error) {
        console.error(`${LOG_PREFIX} ERRO ao enviar ${isVideo ? 'video' : 'imagem'}:`, response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'failed' as MessageStatus }
              : msg
          )
        );
      } else {
        console.log(`${LOG_PREFIX} ${isVideo ? 'Video' : 'Imagem'} enviado com sucesso!`);
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
      console.error(`${LOG_PREFIX} EXCECAO ao enviar midia:`, error);
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
    console.log(`[🔴 REACTION_DEBUG] 2.4.1 updateMessageReaction chamado:`, { //......Log chamada
      messageId, //......ID mensagem
      reaction: reaction || '(remover)', //......Reacao nova
    });

    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, reaction: reaction || undefined }
          : msg
      );

      const targetMessage = updated.find(m => m.id === messageId); //......Busca mensagem
      console.log(`[🔴 REACTION_DEBUG] 2.4.2 Mensagem após atualização:`, { //......Log resultado
        found: !!targetMessage, //......Encontrou mensagem
        newReaction: targetMessage?.reaction, //......Nova reacao
      });

      return updated;
    });
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
    pausePolling,                         //......Pausa polling
    resumePolling,                        //......Retoma polling
  };
};

// ========================================
// Export Default
// ========================================
export default useMessages;
