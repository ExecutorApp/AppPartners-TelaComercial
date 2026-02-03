// ========================================
// Hook useContacts
// Busca contatos da agenda e do WhatsApp
// ========================================

// ========================================
// Imports React
// ========================================
import {                                  //......React hooks
  useState,                               //......Hook de estado
  useEffect,                              //......Hook de efeito
  useCallback,                            //......Hook de callback
} from 'react';                           //......Biblioteca React
import {                                  //......React Native
  Platform,                               //......Plataforma
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Servicos
// ========================================
import { evolutionService } from '../../../services/evolutionService';

// ========================================
// Constantes
// ========================================
const LOG_PREFIX = '[useContacts]';       //......Prefixo de log

// ========================================
// Interface de Contato Unificado
// ========================================
export interface UnifiedContact {
  id: string;                             //......ID unico
  name: string;                           //......Nome do contato
  phone: string;                          //......Telefone
  photo?: string;                         //......Foto opcional
  source: 'phone' | 'whatsapp';           //......Origem do contato
}

// ========================================
// Interface de Contato da Agenda
// ========================================
interface PhoneContact {
  id: string;                             //......ID do contato
  name: string;                           //......Nome
  firstName?: string;                     //......Primeiro nome
  lastName?: string;                      //......Sobrenome
  phoneNumbers?: Array<{                  //......Array de telefones
    number: string;                       //......Numero
    label?: string;                       //......Label (mobile, home, etc)
  }>;
  image?: {                               //......Imagem
    uri: string;                          //......URI da imagem
  };
}

// ========================================
// Interface de Contato do WhatsApp
// ========================================
interface WhatsAppContact {
  id?: string;                            //......ID do contato
  remoteJid?: string;                     //......JID remoto
  pushName?: string;                      //......Nome push
  profilePictureUrl?: string;             //......URL da foto
  owner?: string;                         //......Dono
}

// ========================================
// Interface de Retorno do Hook
// ========================================
interface UseContactsReturn {
  phoneContacts: UnifiedContact[];        //......Contatos da agenda
  whatsappContacts: UnifiedContact[];     //......Contatos do WhatsApp
  allContacts: UnifiedContact[];          //......Todos os contatos
  isLoadingPhone: boolean;                //......Loading agenda
  isLoadingWhatsApp: boolean;             //......Loading WhatsApp
  errorPhone: string | null;              //......Erro agenda
  errorWhatsApp: string | null;           //......Erro WhatsApp
  refreshPhoneContacts: () => Promise<void>;
  refreshWhatsAppContacts: () => Promise<void>;
  refreshAll: () => Promise<void>;        //......Atualiza todos
}

// ========================================
// Funcao para formatar telefone
// ========================================
const formatPhoneNumber = (phone: string): string => {
  // Remove tudo que nao for numero
  const numbers = phone.replace(/\D/g, '');

  // Se comecar com 55, remove (codigo Brasil)
  if (numbers.startsWith('55') && numbers.length > 11) {
    return numbers.substring(2);
  }

  return numbers;
};

// ========================================
// Funcao para extrair telefone do JID
// ========================================
const extractPhoneFromJid = (jid: string): string => {
  // JID formato: 5511999887766@s.whatsapp.net
  const phone = jid?.split('@')[0] || '';
  return formatPhoneNumber(phone);
};

// ========================================
// Hook Principal useContacts
// ========================================
export const useContacts = (instanceName?: string): UseContactsReturn => {
  // ========================================
  // Estados
  // ========================================
  const [phoneContacts, setPhoneContacts] = useState<UnifiedContact[]>([]);
  const [whatsappContacts, setWhatsappContacts] = useState<UnifiedContact[]>([]);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false);
  const [errorPhone, setErrorPhone] = useState<string | null>(null);
  const [errorWhatsApp, setErrorWhatsApp] = useState<string | null>(null);

  // ========================================
  // Buscar Contatos da Agenda (Mobile)
  // ========================================
  const fetchPhoneContacts = useCallback(async () => {
    // Apenas em dispositivos moveis
    if (Platform.OS === 'web') {
      console.log(`${LOG_PREFIX} Agenda nao disponivel na Web`);
      setPhoneContacts([]);               //......Vazio na web
      return;
    }

    setIsLoadingPhone(true);              //......Inicia loading
    setErrorPhone(null);                  //......Limpa erro

    try {
      // Import dinamico do expo-contacts
      const Contacts = await import('expo-contacts');

      // Solicita permissao
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        console.log(`${LOG_PREFIX} Permissao de contatos negada`);
        setErrorPhone('Permissão negada para acessar contatos');
        setPhoneContacts([]);
        return;
      }

      // Busca contatos
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,           //......Nome
          Contacts.Fields.PhoneNumbers,   //......Telefones
          Contacts.Fields.Image,          //......Imagem
        ],
      });

      console.log(`${LOG_PREFIX} Contatos da agenda encontrados:`, data.length);

      // Mapeia para formato unificado
      const unified: UnifiedContact[] = [];

      data.forEach((contact: PhoneContact) => {
        // Pula se nao tem telefone
        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
          return;
        }

        // Adiciona cada telefone como contato separado
        contact.phoneNumbers.forEach((phoneNumber, index) => {
          const formattedPhone = formatPhoneNumber(phoneNumber.number);

          // Pula se telefone invalido
          if (formattedPhone.length < 10) {
            return;
          }

          unified.push({
            id: `phone_${contact.id}_${index}`,
            name: contact.name || contact.firstName || 'Sem nome',
            phone: formattedPhone,
            photo: contact.image?.uri,
            source: 'phone',
          });
        });
      });

      // Ordena por nome
      unified.sort((a, b) => a.name.localeCompare(b.name));

      console.log(`${LOG_PREFIX} Contatos da agenda processados:`, unified.length);
      setPhoneContacts(unified);          //......Define contatos

    } catch (error: any) {
      console.error(`${LOG_PREFIX} Erro ao buscar contatos da agenda:`, error);
      setErrorPhone(error?.message || 'Erro ao buscar contatos');
      setPhoneContacts([]);
    } finally {
      setIsLoadingPhone(false);           //......Finaliza loading
    }
  }, []);

  // ========================================
  // Buscar Contatos do WhatsApp (Evolution)
  // ========================================
  const fetchWhatsAppContacts = useCallback(async () => {
    // Precisa de instanceName
    if (!instanceName) {
      console.log(`${LOG_PREFIX} instanceName nao fornecido`);
      setWhatsappContacts([]);            //......Vazio sem instance
      return;
    }

    setIsLoadingWhatsApp(true);           //......Inicia loading
    setErrorWhatsApp(null);               //......Limpa erro

    try {
      console.log(`${LOG_PREFIX} Buscando contatos do WhatsApp...`);

      // Busca contatos via Evolution API
      const contacts = await evolutionService.fetchContacts(instanceName);

      console.log(`${LOG_PREFIX} Contatos do WhatsApp encontrados:`, contacts.length);

      // Mapeia para formato unificado
      const unified: UnifiedContact[] = contacts
        .filter((contact: WhatsAppContact) => {
          // Filtra grupos (contem @g.us)
          const jid = contact.remoteJid || contact.id || '';
          return !jid.includes('@g.us');
        })
        .map((contact: WhatsAppContact, index: number) => {
          const jid = contact.remoteJid || contact.id || '';
          const phone = extractPhoneFromJid(jid);

          return {
            id: `whatsapp_${jid}_${index}`,
            name: contact.pushName || phone || 'Sem nome',
            phone: phone,
            photo: contact.profilePictureUrl,
            source: 'whatsapp' as const,
          };
        })
        .filter((contact: UnifiedContact) => contact.phone.length >= 10);

      // Ordena por nome
      unified.sort((a, b) => a.name.localeCompare(b.name));

      console.log(`${LOG_PREFIX} Contatos do WhatsApp processados:`, unified.length);
      setWhatsappContacts(unified);       //......Define contatos

    } catch (error: any) {
      console.error(`${LOG_PREFIX} Erro ao buscar contatos do WhatsApp:`, error);
      setErrorWhatsApp(error?.message || 'Erro ao buscar contatos');
      setWhatsappContacts([]);
    } finally {
      setIsLoadingWhatsApp(false);        //......Finaliza loading
    }
  }, [instanceName]);

  // ========================================
  // Atualizar Todos os Contatos
  // ========================================
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchPhoneContacts(),               //......Busca agenda
      fetchWhatsAppContacts(),            //......Busca WhatsApp
    ]);
  }, [fetchPhoneContacts, fetchWhatsAppContacts]);

  // ========================================
  // Combinar Todos os Contatos
  // ========================================
  const allContacts = [...whatsappContacts, ...phoneContacts];

  // ========================================
  // Efeito: Buscar contatos ao montar
  // ========================================
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ========================================
  // Retorno do Hook
  // ========================================
  return {
    phoneContacts,                        //......Contatos da agenda
    whatsappContacts,                     //......Contatos do WhatsApp
    allContacts,                          //......Todos os contatos
    isLoadingPhone,                       //......Loading agenda
    isLoadingWhatsApp,                    //......Loading WhatsApp
    errorPhone,                           //......Erro agenda
    errorWhatsApp,                        //......Erro WhatsApp
    refreshPhoneContacts: fetchPhoneContacts,
    refreshWhatsAppContacts: fetchWhatsAppContacts,
    refreshAll,                           //......Atualiza todos
  };
};

// ========================================
// Export Default
// ========================================
export default useContacts;
