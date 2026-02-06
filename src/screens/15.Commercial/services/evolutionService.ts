// ========================================
// Servico Evolution API
// Integracao com WhatsApp via Evolution
// ========================================

// ========================================
// Configuracao
// ========================================
// TODO: Mover para variaveis de ambiente seguras em producao
const EVOLUTION_URL = 'http://localhost:8082';
const EVOLUTION_API_KEY = 'test123';

// ========================================
// Headers Padrao
// ========================================
const headers = {
  'Content-Type': 'application/json',            //......Tipo de conteudo
  'apikey': EVOLUTION_API_KEY,                   //......Chave da API
};

// ========================================
// Gerar Token Unico
// ========================================
const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// ========================================
// Interface de Contato
// ========================================
interface Contact {
  fullName: string;                              //......Nome completo
  wuid: string;                                  //......ID WhatsApp
  phoneNumber: string;                           //......Telefone
}

// ========================================
// Interface de Resposta da API
// ========================================
interface EvolutionResponse {
  key?: {                                        //......Chave da mensagem
    id: string;                                  //......ID da mensagem
    remoteJid: string;                           //......JID remoto
    fromMe: boolean;                             //......Se e do usuario
  };
  message?: any;                                 //......Dados da mensagem
  status?: string;                               //......Status
  error?: string;                                //......Erro se houver
  qrcode?: {                                     //......QR Code
    base64: string;                              //......Base64 do QR
  };
  pairingCode?: string;                          //......Codigo de pareamento
  code?: string;                                 //......Codigo alternativo
  instance?: {                                   //......Dados da instancia
    instanceName: string;                        //......Nome da instancia
    status: string;                              //......Status da conexao
  };
  state?: string;                                //......Estado da conexao
  hash?: {                                       //......Hash da instancia
    apikey: string;                              //......API key da instancia
  };
}

// ========================================
// Servico Evolution API
// ========================================
export const evolutionService = {
  // ========================================
  // INSTANCIAS
  // ========================================

  // Criar instancia (1 por vendedor/numero)
  async createInstance(
    instanceName: string,
    usePairingCode: boolean = false
  ): Promise<EvolutionResponse> {
    console.log('[EvolutionService] createInstance:', instanceName);
    console.log('[EvolutionService] usePairingCode:', usePairingCode);

    const response = await fetch(`${EVOLUTION_URL}/instance/create`, {
      method: 'POST',                            //......Metodo POST
      headers,                                   //......Headers padrao
      body: JSON.stringify({                     //......Corpo da requisicao
        instanceName: instanceName,              //......Nome da instancia
        token: generateToken(),                  //......Token unico
        qrcode: !usePairingCode,                 //......QR false para pairing
        integration: 'WHATSAPP-BAILEYS',         //......Tipo integracao
      }),
    });
    const result = await response.json();        //......Retorna JSON
    console.log('[EvolutionService] createInstance result:', JSON.stringify(result, null, 2));
    return result;
  },

  // Deletar instancia
  async deleteInstance(instanceName: string): Promise<EvolutionResponse> {
    console.log('[EvolutionService] deleteInstance:', instanceName);
    try {
      const response = await fetch(
        `${EVOLUTION_URL}/instance/delete/${instanceName}`,
        {
          method: 'DELETE',                      //......Metodo DELETE
          headers,                               //......Headers padrao
        }
      );
      const result = await response.json();      //......Retorna JSON
      console.log('[EvolutionService] deleteInstance result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error: any) {
      console.log('[EvolutionService] deleteInstance error (ignorado):', error?.message);
      return {};                                 //......Ignora erro
    }
  },

  // Buscar instancia
  async fetchInstance(instanceName: string): Promise<EvolutionResponse> {
    console.log('[EvolutionService] fetchInstance:', instanceName);
    try {
      const response = await fetch(
        `${EVOLUTION_URL}/instance/fetchInstances?instanceName=${instanceName}`,
        {
          method: 'GET',                         //......Metodo GET
          headers,                               //......Headers padrao
        }
      );
      const result = await response.json();      //......Retorna JSON
      console.log('[EvolutionService] fetchInstance result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error: any) {
      console.log('[EvolutionService] fetchInstance error:', error?.message);
      return { error: error?.message };          //......Retorna erro
    }
  },

  // Conectar WhatsApp (obter QR Code)
  async connectInstance(instanceName: string): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/instance/connect/${instanceName}`,
      {
        method: 'GET',                           //......Metodo GET
        headers,                                 //......Headers padrao
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Conectar com Pairing Code (codigo numerico)
  async connectWithPairingCode(
    instanceName: string,
    phoneNumber: string
  ): Promise<EvolutionResponse> {
    // Formatar numero (remover caracteres especiais)
    const formattedNumber = phoneNumber.replace(/\D/g, '');

    console.log('========================================');
    console.log('[EvolutionService] connectWithPairingCode');
    console.log('[EvolutionService] instanceName:', instanceName);
    console.log('[EvolutionService] phoneNumber:', phoneNumber);
    console.log('[EvolutionService] formattedNumber:', formattedNumber);
    console.log('========================================');

    try {
      // Passo 1: Deletar instancia existente (se houver)
      console.log('[EvolutionService] Passo 1: Deletando instancia existente...');
      await this.deleteInstance(instanceName);

      // Passo 2: Criar nova instancia com qrcode: false
      console.log('[EvolutionService] Passo 2: Criando nova instancia com qrcode=false...');
      const createResult = await this.createInstance(instanceName, true);

      if (createResult.error) {
        console.error('[EvolutionService] Erro ao criar instancia:', createResult.error);
        return { error: createResult.error };    //......Retorna erro
      }

      // Passo 3: Aguardar um pouco para instancia inicializar
      console.log('[EvolutionService] Passo 3: Aguardando inicializacao...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Passo 3.5: Configurar settings para sincronizar historico
      console.log('[EvolutionService] Passo 3.5: Configurando syncFullHistory...');
      await this.setSettings(instanceName, {
        syncFullHistory: true,                   //......Sincronizar historico
        readMessages: true,                      //......Marcar como lido
      });

      // Passo 4: Conectar com numero para obter pairing code
      console.log('[EvolutionService] Passo 4: Solicitando pairing code...');
      const url = `${EVOLUTION_URL}/instance/connect/${instanceName}?number=${formattedNumber}`;

      console.log('[EvolutionService] URL:', url);

      const response = await fetch(url, {
        method: 'GET',                           //......Metodo GET
        headers,                                 //......Headers padrao
      });

      console.log('[EvolutionService] response.status:', response.status);
      console.log('[EvolutionService] response.ok:', response.ok);

      const responseText = await response.text();
      console.log('[EvolutionService] responseText:', responseText);

      try {
        const jsonData = JSON.parse(responseText);
        console.log('[EvolutionService] JSON parseado:', JSON.stringify(jsonData, null, 2));
        return jsonData;
      } catch (parseError) {
        console.error('[EvolutionService] Erro ao parsear JSON:', parseError);
        return { error: `Resposta invalida: ${responseText}` };
      }
    } catch (fetchError: any) {
      console.error('[EvolutionService] ERRO no fetch:', fetchError);
      console.error('[EvolutionService] fetchError.message:', fetchError?.message);
      return { error: fetchError?.message || 'Erro de conexao' };
    }
  },

  // Status da conexao
  async getConnectionStatus(instanceName: string): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/instance/connectionState/${instanceName}`,
      {
        method: 'GET',                           //......Metodo GET
        headers,                                 //......Headers padrao
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Logout/Desconectar
  async logoutInstance(instanceName: string): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/instance/logout/${instanceName}`,
      {
        method: 'DELETE',                        //......Metodo DELETE
        headers,                                 //......Headers padrao
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Configurar settings da instancia
  async setSettings(
    instanceName: string,
    settings: {
      syncFullHistory?: boolean;                 //......Sincronizar historico
      readMessages?: boolean;                    //......Marcar como lido
      rejectCall?: boolean;                      //......Rejeitar chamadas
      groupsIgnore?: boolean;                    //......Ignorar grupos
      alwaysOnline?: boolean;                    //......Sempre online
    }
  ): Promise<EvolutionResponse> {
    console.log('[EvolutionService] setSettings:', instanceName, settings);
    try {
      const response = await fetch(
        `${EVOLUTION_URL}/settings/set/${instanceName}`,
        {
          method: 'POST',                        //......Metodo POST
          headers,                               //......Headers padrao
          body: JSON.stringify({
            rejectCall: settings.rejectCall ?? false,
            msgCall: '',                         //......Mensagem chamada
            groupsIgnore: settings.groupsIgnore ?? false,
            alwaysOnline: settings.alwaysOnline ?? false,
            readMessages: settings.readMessages ?? true,
            readStatus: false,                   //......Status leitura
            syncFullHistory: settings.syncFullHistory ?? true,
          }),
        }
      );
      const result = await response.json();      //......Retorna JSON
      console.log('[EvolutionService] setSettings result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error: any) {
      console.error('[EvolutionService] setSettings error:', error?.message);
      return { error: error?.message };          //......Retorna erro
    }
  },

  // ========================================
  // MENSAGENS - ENVIAR
  // ========================================

  // Enviar texto (com suporte a quoted reply)
  async sendText(
    instanceName: string,
    number: string,
    text: string,
    quoted?: { key: { id: string; remoteJid: string; fromMe: boolean }; message?: any }
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendText/${instanceName}`;
    // Formato Evolution API v2.x: text no nivel raiz
    const body: any = {
      number: number,                            //......Numero destino
      text: text,                                //......Texto da mensagem (nivel raiz v2.x)
      delay: 1000,                               //......Delay em ms
    };

    // Adicionar quoted para reply vinculado
    if (quoted) {
      body.quoted = quoted;                      //......Mensagem citada para reply
    }

    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] INICIO: sendText');
    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] URL:', url);
    console.log('[EvolutionService] Headers:', JSON.stringify(headers, null, 2));
    console.log('[EvolutionService] Body:', JSON.stringify(body, null, 2));

    try {
      const response = await fetch(url, {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify(body),              //......Corpo da requisicao
      });

      console.log('[EvolutionService] Response status:', response.status);
      console.log('[EvolutionService] Response ok:', response.ok);

      const data = await response.json();

      console.log('[EvolutionService] Response data:', JSON.stringify(data, null, 2));
      console.log('[EvolutionService] ========================================');
      console.log('[EvolutionService] FIM: sendText');
      console.log('[EvolutionService] ========================================');

      // Verificar se houve erro HTTP
      if (!response.ok) {
        console.error('[EvolutionService] ERRO HTTP:', response.status);
        return {
          error: data.message || data.error || `Erro HTTP ${response.status}`,
          status: String(response.status),
        };
      }

      // Verificar se a resposta tem key (indicador de sucesso)
      if (!data.key && !data.messageId) {
        console.warn('[EvolutionService] Resposta sem key/messageId:', data);
      }

      return data;
    } catch (error) {
      console.error('[EvolutionService] ERRO em sendText:', error);
      console.error('[EvolutionService] Stack:', (error as Error).stack);
      return {
        error: (error as Error).message || 'Erro de rede ao enviar mensagem',
      };
    }
  },

  // Enviar imagem
  async sendImage(
    instanceName: string,
    number: string,
    imageUrl: string,
    caption?: string
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendMedia/${instanceName}`;

    // Detectar se e base64 ou URL
    const isBase64 = !imageUrl.startsWith('http');

    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] INICIO: sendImage');
    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] URL:', url);
    console.log('[EvolutionService] isBase64:', isBase64);

    try {
      let response: Response;

      if (isBase64) {
        // Converter base64 para Blob e enviar como FormData
        const byteString = atob(imageUrl);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });

        // Criar FormData
        const formData = new FormData();
        formData.append('number', number);
        formData.append('mediatype', 'image');
        formData.append('caption', caption || '');
        formData.append('file', blob, 'image.jpg');

        console.log('[EvolutionService] Enviando como FormData (file upload)');
        console.log('[EvolutionService] Blob size:', blob.size);

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': EVOLUTION_API_KEY,         //......Apenas apikey, sem Content-Type
          },
          body: formData,
        });
      } else {
        // URL: enviar como JSON normal
        const body = {
          number: number,
          mediatype: 'image',
          media: imageUrl,
          caption: caption || '',
        };

        console.log('[EvolutionService] Enviando como JSON (URL)');

        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
      }

      console.log('[EvolutionService] Response status:', response.status);

      const data = await response.json();

      console.log('[EvolutionService] Response data:', JSON.stringify(data, null, 2));
      console.log('[EvolutionService] FIM: sendImage');

      // Retorna erro estruturado se status nao for 2xx
      if (!response.ok) {
        return {
          error: data.error || data.message || 'Erro ao enviar imagem',
        };
      }

      return data;
    } catch (error) {
      console.error('[EvolutionService] ERRO em sendImage:', error);
      throw error;
    }
  },

  // ========================================
  // Enviar Video
  // ========================================
  async sendVideo(
    instanceName: string,
    number: string,
    videoData: string,
    mimeType: string = 'video/mp4',
    caption?: string
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendMedia/${instanceName}`;

    // Detectar se e base64 ou URL
    const isBase64 = !videoData.startsWith('http');

    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] INICIO: sendVideo');
    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] URL:', url);
    console.log('[EvolutionService] isBase64:', isBase64);
    console.log('[EvolutionService] mimeType:', mimeType);

    try {
      let response: Response;

      if (isBase64) {
        // Converter base64 para Blob e enviar como FormData
        const byteString = atob(videoData);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: mimeType });

        // Determinar extensao baseada no mimeType
        const extensionMap: Record<string, string> = {
          'video/mp4': 'mp4',
          'video/quicktime': 'mov',
          'video/x-msvideo': 'avi',
          'video/webm': 'webm',
          'video/3gpp': '3gp',
        };
        const extension = extensionMap[mimeType] || 'mp4';

        // Criar FormData
        const formData = new FormData();
        formData.append('number', number);
        formData.append('mediatype', 'video');
        formData.append('caption', caption || '');
        formData.append('file', blob, `video.${extension}`);

        console.log('[EvolutionService] Enviando video como FormData (file upload)');
        console.log('[EvolutionService] Blob size:', blob.size);
        console.log('[EvolutionService] Extension:', extension);

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': EVOLUTION_API_KEY,         //......Apenas apikey, sem Content-Type
          },
          body: formData,
        });
      } else {
        // URL: enviar como JSON normal
        const body = {
          number: number,
          mediatype: 'video',
          media: videoData,
          caption: caption || '',
        };

        console.log('[EvolutionService] Enviando video como JSON (URL)');

        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
      }

      console.log('[EvolutionService] Response status:', response.status);

      const data = await response.json();

      console.log('[EvolutionService] Response data:', JSON.stringify(data, null, 2));
      console.log('[EvolutionService] FIM: sendVideo');

      // Retorna erro estruturado se status nao for 2xx
      if (!response.ok) {
        return {
          error: data.error || data.message || 'Erro ao enviar video',
        };
      }

      return data;
    } catch (error) {
      console.error('[EvolutionService] ERRO em sendVideo:', error);
      throw error;
    }
  },

  // Enviar audio (PTT - Push to Talk)
  async sendAudio(
    instanceName: string,
    number: string,
    audioBase64: string
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendWhatsAppAudio/${instanceName}`;
    const body = {
      number: number,                            //......Numero destino
      audio: audioBase64,                        //......Audio em base64 ou URL (direto na raiz)
      delay: 1200,                               //......Delay em ms
    };

    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] INICIO: sendAudio');
    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] URL:', url);
    console.log('[EvolutionService] number:', number);
    console.log('[EvolutionService] audio data length:', audioBase64?.length);
    console.log('[EvolutionService] audio prefix:', audioBase64?.substring(0, 50));

    try {
      const response = await fetch(url, {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify(body),              //......Corpo da requisicao
      });

      console.log('[EvolutionService] Response status:', response.status);

      const data = await response.json();

      console.log('[EvolutionService] Response data:', JSON.stringify(data, null, 2));
      console.log('[EvolutionService] FIM: sendAudio');

      // Retorna erro estruturado se status nao for 2xx
      if (!response.ok) {
        return {
          error: data.error || data.message || 'Erro ao enviar audio',
        };
      }

      return data;
    } catch (error) {
      console.error('[EvolutionService] ERRO em sendAudio:', error);
      throw error;
    }
  },


  // Enviar documento
  async sendDocument(
    instanceName: string,
    number: string,
    documentUrl: string,
    fileName: string
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendMedia/${instanceName}`;
    const body = {
      number: number,                            //......Numero destino
      mediaMessage: {                            //......Objeto mediaMessage (formato Evolution API)
        mediatype: 'document',                   //......Tipo midia
        media: documentUrl,                      //......URL ou base64 do documento
        fileName: fileName,                      //......Nome do arquivo
      },
    };

    const response = await fetch(url, {
      method: 'POST',                            //......Metodo POST
      headers,                                   //......Headers padrao
      body: JSON.stringify(body),                //......Corpo da requisicao
    });
    return response.json();                      //......Retorna JSON
  },

  // Enviar localizacao
  async sendLocation(
    instanceName: string,
    number: string,
    latitude: number,
    longitude: number,
    name?: string,
    address?: string
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/message/sendLocation/${instanceName}`,
      {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          number: number,                        //......Numero destino
          latitude: latitude,                    //......Latitude
          longitude: longitude,                  //......Longitude
          name: name,                            //......Nome do local
          address: address,                      //......Endereco
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Enviar contato
  async sendContact(
    instanceName: string,
    number: string,
    contact: Contact
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/message/sendContact/${instanceName}`,
      {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          number: number,                        //......Numero destino
          contact: [contact],                    //......Array de contatos
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Enviar reacao
  async sendReaction(
    instanceName: string,
    messageKey: any,
    emoji: string
  ): Promise<EvolutionResponse> {
    const url = `${EVOLUTION_URL}/message/sendReaction/${instanceName}`;

    // Formato Evolution API v2.x: key e reaction no nivel raiz
    // Para remover reacao: enviar emoji vazio ""
    const body = {
      key: messageKey,                           //......Chave da mensagem (nivel raiz v2.x)
      reaction: emoji,                           //......Emoji da reacao (nivel raiz v2.x)
    };

    console.log('[🔴 REACTION_DEBUG] 3.1.1 URL completa:', url); //......URL request
    console.log('[🔴 REACTION_DEBUG] 3.1.2 Body enviado:', JSON.stringify(body, null, 2)); //......Body formatado

    try {
      const response = await fetch(url, {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify(body),              //......Corpo da requisicao
      });

      console.log('[🔴 REACTION_DEBUG] 3.2.1 Status HTTP:', response.status); //......Status code
      console.log('[🔴 REACTION_DEBUG] 3.2.2 Status Text:', response.statusText); //......Status texto

      const data = await response.json();

      console.log('[🔴 REACTION_DEBUG] 3.2.3 Response body:', JSON.stringify(data, null, 2)); //......Response completo

      if (!response.ok) {
        console.error('[🔴 REACTION_DEBUG] ❌ Response não OK:', { //......Erro response
          status: response.status, //......Status erro
          data, //......Dados erro
        });
        return {
          error: data.error || data.message || 'Erro ao enviar reacao',
        };
      }

      console.log('[🔴 REACTION_DEBUG] ✅ Response OK'); //......Sucesso
      return data;
    } catch (error) {
      console.error('[🔴 REACTION_DEBUG] ❌ EXCEÇÃO no fetch:', error); //......Excecao fetch
      throw error;
    }
  },

  // ========================================
  // MENSAGENS - ACOES
  // ========================================

  // Marcar como lida
  async markAsRead(
    instanceName: string,
    messageKey: any
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/chat/markMessageAsRead/${instanceName}`,
      {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          readMessages: [messageKey],            //......Array de mensagens
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Atualizar presenca (online, digitando, gravando)
  async updatePresence(
    instanceName: string,
    number: string,
    state: 'available' | 'composing' | 'recording' | 'paused'
  ): Promise<EvolutionResponse> {
    const delay = state === 'composing' || state === 'recording' ? 3000 : 0;
    const response = await fetch(
      `${EVOLUTION_URL}/chat/updatePresence/${instanceName}`,
      {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          number: number,                        //......Numero destino
          presence: state,                       //......Estado de presenca
          delay: delay,                          //......Delay em ms
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Deletar mensagem
  async deleteMessage(
    instanceName: string,
    messageKey: any
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/message/deleteMessage/${instanceName}`,
      {
        method: 'DELETE',                        //......Metodo DELETE
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          key: messageKey,                       //......Chave da mensagem
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // Editar mensagem
  async editMessage(
    instanceName: string,
    messageKey: any,
    newText: string
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/message/editMessage/${instanceName}`,
      {
        method: 'PUT',                           //......Metodo PUT
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          key: messageKey,                       //......Chave da mensagem
          text: newText,                         //......Novo texto
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },

  // ========================================
  // BUSCAR CHATS E CONTATOS
  // ========================================

  // Obter lista de contatos do WhatsApp com paginacao
  async fetchChats(
    instanceName: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ contacts: any[]; total: number; hasMore: boolean }> {
    console.log('[EvolutionService] fetchChats:', instanceName, 'limit:', limit, 'offset:', offset);
    try {
      // Endpoint: POST /chat/findContacts com paginacao
      const response = await fetch(
        `${EVOLUTION_URL}/chat/findContacts/${instanceName}`,
        {
          method: 'POST',                        //......Metodo POST
          headers,                               //......Headers padrao
          body: JSON.stringify({
            where: {},                           //......Filtro vazio
            limit: limit,                        //......Limite por pagina
            offset: offset,                      //......Offset para paginacao
          }),
        }
      );

      console.log('[EvolutionService] fetchChats status:', response.status);

      if (response.ok) {
        const result = await response.json();    //......Retorna JSON
        const contacts = Array.isArray(result) ? result : [];
        const total = contacts.length;
        const hasMore = contacts.length === limit;
        console.log('[EvolutionService] Contatos carregados:', total, 'hasMore:', hasMore);
        return { contacts, total, hasMore };     //......Retorna objeto
      } else {
        const errorText = await response.text();
        console.error('[EvolutionService] fetchChats erro:', errorText);
        return { contacts: [], total: 0, hasMore: false };
      }
    } catch (error: any) {
      console.error('[EvolutionService] fetchChats exception:', error?.message);
      return { contacts: [], total: 0, hasMore: false };
    }
  },

  // Obter todos os contatos (carrega em batches para performance)
  async fetchAllChats(instanceName: string): Promise<any[]> {
    console.log('[EvolutionService] fetchAllChats:', instanceName);
    const allContacts: any[] = [];
    let offset = 0;
    const limit = 100;                           //......100 por batch
    let hasMore = true;

    while (hasMore) {
      const result = await this.fetchChats(instanceName, limit, offset);
      allContacts.push(...result.contacts);
      hasMore = result.hasMore;
      offset += limit;

      // Limite de seguranca: max 5000 contatos
      if (allContacts.length >= 5000) {
        console.log('[EvolutionService] Limite de 5000 contatos atingido');
        break;
      }
    }

    console.log('[EvolutionService] Total de contatos:', allContacts.length);
    return allContacts;
  },

  // Carregamento progressivo com callback (atualiza UI em batches)
  async fetchChatsProgressive(
    instanceName: string,
    onBatch: (contacts: any[], batchNumber: number, total: number) => void,
    abortSignal?: AbortSignal
  ): Promise<{ totalContacts: number; batches: number }> {
    console.log('[PERF] fetchChatsProgressive - START');
    const perfStart = performance.now();

    let offset = 0;
    const limit = 100;                           //......100 por batch
    let hasMore = true;
    let batchNumber = 0;
    let totalContacts = 0;

    while (hasMore) {
      // Verificar se foi cancelado
      if (abortSignal?.aborted) {
        console.log('[PERF] fetchChatsProgressive - ABORTADO');
        break;
      }

      const batchStart = performance.now();
      const result = await this.fetchChats(instanceName, limit, offset);
      const batchTime = performance.now() - batchStart;

      batchNumber++;
      totalContacts += result.contacts.length;

      console.log(`[PERF] Batch ${batchNumber}: ${result.contacts.length} contatos em ${batchTime.toFixed(0)}ms (total: ${totalContacts})`);

      // Callback para atualizar UI com o batch
      if (result.contacts.length > 0) {
        onBatch(result.contacts, batchNumber, totalContacts);
      }

      hasMore = result.hasMore;
      offset += limit;

      // Limite de seguranca: max 5000 contatos
      if (totalContacts >= 5000) {
        console.log('[PERF] Limite de 5000 contatos atingido');
        break;
      }
    }

    const totalTime = performance.now() - perfStart;
    console.log(`[PERF] fetchChatsProgressive TOTAL - ${totalContacts} contatos em ${batchNumber} batches em ${totalTime.toFixed(0)}ms`);

    return { totalContacts, batches: batchNumber };
  },

  // Obter lista de contatos paginada
  async fetchContacts(
    instanceName: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    // Se nao especificar paginacao, carrega primeira pagina
    if (limit === undefined && offset === undefined) {
      const result = await this.fetchChats(instanceName, 50, 0);
      return result.contacts;
    }
    const result = await this.fetchChats(instanceName, limit || 50, offset || 0);
    return result.contacts;
  },

  // ========================================
  // BUSCAR MENSAGENS
  // ========================================

  // Obter mensagens de um chat
  // NOTA: Evolution API usa diferentes formatos de JID:
  // - Mensagens enviadas (fromMe: true): remoteJid = numero@s.whatsapp.net
  // - Mensagens recebidas (fromMe: false): remoteJid = id@lid, remoteJidAlt = numero@s.whatsapp.net
  // Por isso, fazemos duas buscas e combinamos os resultados
  async getMessages(
    instanceName: string,
    number: string,
    limit: number = 50
  ): Promise<any[]> {
    // Formatar numero com sufixo WhatsApp
    const remoteJid = number.includes('@')
      ? number
      : `${number}@s.whatsapp.net`;

    const url = `${EVOLUTION_URL}/chat/findMessages/${instanceName}`;

    console.log('[EvolutionService] ========================================');
    console.log('[EvolutionService] INICIO: getMessages');
    console.log('[EvolutionService] URL:', url);
    console.log('[EvolutionService] remoteJid:', remoteJid);

    try {
      // Busca 1: Mensagens enviadas (por remoteJid)
      const bodyOutgoing = {
        where: {
          key: {
            remoteJid: remoteJid,                //......JID enviadas
          },
        },
        limit: limit,                            //......Limite de mensagens
      };

      console.log('[EvolutionService] Busca 1 (outgoing):', JSON.stringify(bodyOutgoing, null, 2));

      const responseOutgoing = await fetch(url, {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify(bodyOutgoing),      //......Corpo requisicao
      });

      const dataOutgoing = await responseOutgoing.json();

      // Busca 2: Mensagens recebidas (por remoteJidAlt)
      const bodyIncoming = {
        where: {
          key: {
            remoteJidAlt: remoteJid,             //......JID recebidas
          },
        },
        limit: limit,                            //......Limite de mensagens
      };

      console.log('[EvolutionService] Busca 2 (incoming):', JSON.stringify(bodyIncoming, null, 2));

      const responseIncoming = await fetch(url, {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify(bodyIncoming),      //......Corpo requisicao
      });

      const dataIncoming = await responseIncoming.json();

      // Extrair mensagens de ambas respostas
      const extractMessages = (data: any): any[] => {
        if (Array.isArray(data)) return data;
        if (data?.messages?.records && Array.isArray(data.messages.records)) {
          return data.messages.records;
        }
        if (data?.messages && Array.isArray(data.messages)) {
          return data.messages;
        }
        if (data?.data && Array.isArray(data.data)) {
          return data.data;
        }
        return [];
      };

      const messagesOutgoing = extractMessages(dataOutgoing);
      const messagesIncoming = extractMessages(dataIncoming);

      console.log('[EvolutionService] Mensagens enviadas:', messagesOutgoing.length);
      console.log('[EvolutionService] Mensagens recebidas:', messagesIncoming.length);

      // Combinar e deduplicar por ID
      const messageMap = new Map<string, any>();

      messagesOutgoing.forEach((msg: any) => {
        const id = msg.id || msg.key?.id;
        if (id) messageMap.set(id, msg);
      });

      messagesIncoming.forEach((msg: any) => {
        const id = msg.id || msg.key?.id;
        if (id && !messageMap.has(id)) {
          messageMap.set(id, msg);
        }
      });

      const messages = Array.from(messageMap.values());

      // Ordenar por timestamp
      messages.sort((a, b) => {
        const timestampA = a.messageTimestamp || 0;
        const timestampB = b.messageTimestamp || 0;
        return timestampA - timestampB;
      });

      console.log('[EvolutionService] Total combinado:', messages.length);
      console.log('[EvolutionService] FIM: getMessages');
      console.log('[EvolutionService] ========================================');

      return messages;
    } catch (error) {
      console.error('[EvolutionService] ERRO em getMessages:', error);
      return [];
    }
  },

  // Buscar perfil do contato
  async getProfile(
    instanceName: string,
    number: string
  ): Promise<EvolutionResponse> {
    const response = await fetch(
      `${EVOLUTION_URL}/chat/findContact/${instanceName}`,
      {
        method: 'POST',                          //......Metodo POST
        headers,                                 //......Headers padrao
        body: JSON.stringify({                   //......Corpo da requisicao
          number: number,                        //......Numero do contato
        }),
      }
    );
    return response.json();                      //......Retorna JSON
  },
};

// ========================================
// Export Default
// ========================================
export default evolutionService;
