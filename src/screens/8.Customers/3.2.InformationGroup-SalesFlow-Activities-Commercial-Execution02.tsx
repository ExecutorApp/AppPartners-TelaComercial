import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Platform, Alert, Linking } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import RegisterKeymanModal from './3.2.InformationGroup-SalesFlow-Activities-Commercial-RegisterKeyman';
import InstructionVideoModal from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution-Video';
import NewContactModal from '../7.Keymans/02.02.InformationGroup-Contacts-NewContact01';
import { parseImportedContacts, type ProfileFormData } from '../7.Keymans/02.02.InformationGroup-Contacts-NewContact03';
import {
  NavArrowLeftIcon,
  NavArrowRightIcon,
  PlayIcon,
  HeaderCloseIcon,
  CheckboxUncheckedIcon,
  CheckboxCheckedIcon,
  StatusFilledCheckIcon,
  ChevronDownBlueIcon,
  CalendarIcon,
  ClockIcon,
  HideIcon,
  AvatarSlimIcon,
  ActionItem,
  ActionStatus,
  TimelineStepProps,
  ChecklistItemProps,
  Props,
  INITIAL_ACTIONS,
  formatCurrentDateTime,
} from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution01';

// Imagem placeholder padrao do sistema
const DEFAULT_AVATAR = require('../../../assets/AvatarPlaceholder02.png');
import { styles } from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution03';

// ========================================
// COMPONENTE: TimelineStep
// ========================================

const TimelineStep: React.FC<TimelineStepProps> = ({
  number,
  title,
  isCompleted,
  isCurrent,
  isLast,
  onPress,
}) => (
  // Container do item (clicavel se tiver onPress)
  <TouchableOpacity
    style={styles.timelineItem}
    onPress={() => {
      console.log('[DEBUG] TimelineStep clicado:', title, 'onPress existe:', !!onPress);
      if (onPress) onPress();
    }}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    {/* Coluna esquerda com circulo e linha */}
    <View style={styles.timelineLeft}>
      {/* Circulo da etapa */}
      <View
        style={[
          styles.timelineCircle,
          isCompleted && styles.timelineCircleCompleted,
          isCurrent && styles.timelineCircleCurrent,
        ]}
      >
        {/* Numero da etapa */}
        <Text style={[
          styles.timelineNumber,
          isCurrent && styles.timelineNumberCurrent,
          isCompleted && styles.timelineNumberCompleted,
        ]}>
          {number}
        </Text>
      </View>
      {/* Linha conectora */}
      {!isLast && (
        <View style={[styles.timelineLine, isCompleted && styles.timelineLineCompleted]} />
      )}
    </View>
    {/* Titulo da etapa */}
    <Text style={[styles.timelineTitle, isCompleted && styles.timelineTitleCompleted]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// ========================================
// COMPONENTE: ChecklistItem
// ========================================

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  title,
  isCompleted,
  completedDate,
  onPress,
}) => (
  // Container do item (clicavel se tiver onPress)
  <TouchableOpacity
    style={styles.checklistItem}
    onPress={() => {
      console.log('[DEBUG] ChecklistItem clicado:', title, 'onPress existe:', !!onPress);
      if (onPress) onPress();
    }}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    {/* Checkbox */}
    {isCompleted ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
    {/* Titulo */}
    <Text style={[styles.checklistTitle, isCompleted && styles.checklistTitleCompleted]}>
      {title}
    </Text>
    {/* Data de conclusao */}
    {completedDate && <Text style={styles.checklistDate}>{completedDate}</Text>}
  </TouchableOpacity>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const CommercialExecutionModal: React.FC<Props> = ({ visible, onClose, activity, customerInfo }) => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Estado de navegacao
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalItems = 8;

  // Estado das acoes (com datas dinamicas)
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);

  // Estado do modal de cadastro de Keyman
  const [registerKeymanVisible, setRegisterKeymanVisible] = useState(false);

  // Estado do modal de video de instrucoes
  const [instructionVideoVisible, setInstructionVideoVisible] = useState(false);

  // Estado para ocultar/mostrar checklist
  const [checklistVisible, setChecklistVisible] = useState(true);

  // Estado para mostrar info do cliente
  const [customerInfoVisible, setCustomerInfoVisible] = useState(false);

  // Estado do modal de novo contato (para Upload)
  const [newContactModalVisible, setNewContactModalVisible] = useState(false);

  // Estado para contatos importados da planilha
  const [importedContacts, setImportedContacts] = useState<ProfileFormData[]>([]);

  // Calcula indice da etapa atual
  const currentStepIndex = useMemo(() => {
    const firstPendingIndex = actions.findIndex((action: ActionItem) => action.status === 'pending');
    return firstPendingIndex >= 0 ? firstPendingIndex : actions.length - 1;
  }, [actions]);

  // Navegacao anterior
  const handlePrevious = () => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navegacao proxima
  const handleNext = () => {
    if (currentIndex < totalItems) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Abre modal de cadastro de Keyman
  const openRegisterKeyman = () => {
    setRegisterKeymanVisible(true);
  };

  // Fecha modal de cadastro de Keyman
  const closeRegisterKeyman = () => {
    setRegisterKeymanVisible(false);
  };

  // Salva cadastro de Keyman e atualiza checklist
  const handleSaveKeyman = () => {
    const currentDateTime = formatCurrentDateTime();
    setActions((prev) =>
      prev.map((action) =>
        action.id === '1'
          ? { ...action, status: 'completed' as ActionStatus, endDate: currentDateTime }
          : action
      )
    );
    closeRegisterKeyman();
  };

  // Faz download do modelo de planilha Excel (Acao 2)
  const handleDownloadModel = async () => {
    try {
      // Headers da planilha
      const headers = [
        'Nome',
        'Tipo de pessoa',
        'CPF/CNPJ',
        'Email',
        'WhatsApp',
        'Estado',
        'CEP',
        'Cidade',
        'Bairro',
        'Endereço',
        'Número',
        'Complemento',
      ];

      // Cria planilha
      const ws = XLSX.utils.aoa_to_sheet([headers]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contatos');
      const filename = 'Importar_contatos.xlsx';

      if (Platform.OS === 'web') {
        // Web: download direto
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Mobile: salva e compartilha
        const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
        const dir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory;
        if (!dir) throw new Error('Diretório indisponível');
        const uri = `${dir}${filename}`;
        await FileSystem.writeAsStringAsync(uri, base64, { encoding: 'base64' as any });

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Baixar modelo - Planilha do Excel',
          });
        } else {
          await Linking.openURL(uri);
        }
      }

      // Marca acao como concluida
      const currentDateTime = formatCurrentDateTime();
      setActions((prev) =>
        prev.map((action) =>
          action.id === '2'
            ? { ...action, status: 'completed' as ActionStatus, endDate: currentDateTime }
            : action
        )
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o modelo da planilha.');
    }
  };

  // Abre file picker e importa contatos da planilha (Acao 3)
  const handleUploadExcel = async () => {
    console.log('[DEBUG] handleUploadExcel INICIADO');
    console.log('[DEBUG] Platform.OS:', Platform.OS);

    // Funcao para processar workbook
    const applyWorkbook = (workbook: XLSX.WorkBook) => {
      console.log('[DEBUG] applyWorkbook INICIADO');
      const firstSheetName = workbook.SheetNames?.[0];
      console.log('[DEBUG] firstSheetName:', firstSheetName);
      if (!firstSheetName) {
        Alert.alert('Importação', 'A planilha selecionada não possui abas.');
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const decoded = XLSX.utils.decode_range((sheet as any)?.['!ref'] ?? 'A1');
      decoded.s.c = 0;
      decoded.s.r = 0;
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        raw: false,
        range: decoded
      }) as unknown[][];

      console.log('[DEBUG] rows.length:', rows.length);
      console.log('[DEBUG] rows:', JSON.stringify(rows.slice(0, 3)));

      // Usa parseImportedContacts de NewContact03 (suporta estrutura da planilha)
      const contactsImport = parseImportedContacts(rows);
      console.log('[DEBUG] contactsImport.length:', contactsImport.length);

      if (!contactsImport.length) {
        Alert.alert('Importação', 'Nenhum contato válido foi encontrado na planilha.');
        return;
      }

      // Extrai apenas ProfileFormData[] para o estado
      const contacts = contactsImport.map(c => c.data);
      console.log('[DEBUG] contacts extraidos:', contacts.length);

      // Guarda contatos importados e abre modal
      setImportedContacts(contacts);
      setNewContactModalVisible(true);

      // Marca acao como concluida
      const currentDateTime = formatCurrentDateTime();
      setActions((prev) =>
        prev.map((action) =>
          action.id === '3'
            ? { ...action, status: 'completed' as ActionStatus, endDate: currentDateTime }
            : action
        )
      );
      console.log('[DEBUG] applyWorkbook FINALIZADO');
    };

    if (Platform.OS === 'web') {
      console.log('[DEBUG] Entrando no bloco WEB');
      try {
        // Web: usa input file
        console.log('[DEBUG] Criando input file');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
        input.style.display = 'none';
        document.body.appendChild(input);
        console.log('[DEBUG] Input adicionado ao DOM');

        input.onchange = async () => {
          console.log('[DEBUG] input.onchange INICIADO');
          try {
            const file = input.files?.[0];
            console.log('[DEBUG] file:', file?.name, file?.size, file?.type);
            if (!file) {
              console.log('[DEBUG] Nenhum arquivo selecionado');
              return;
            }
            console.log('[DEBUG] Lendo arrayBuffer...');
            const buffer = await file.arrayBuffer();
            console.log('[DEBUG] buffer.byteLength:', buffer.byteLength);
            console.log('[DEBUG] Parseando workbook...');
            const workbook = XLSX.read(buffer, { type: 'array' });
            console.log('[DEBUG] workbook.SheetNames:', workbook.SheetNames);
            applyWorkbook(workbook);
          } catch (err) {
            console.error('[DEBUG] Erro no onchange:', err);
            Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
          } finally {
            console.log('[DEBUG] Removendo input do DOM');
            document.body.removeChild(input);
          }
        };

        console.log('[DEBUG] Chamando input.click()');
        input.click();
        console.log('[DEBUG] input.click() executado');
      } catch (err) {
        console.error('[DEBUG] Erro ao abrir seletor:', err);
        Alert.alert('Importação', 'Não foi possível abrir o seletor de arquivos.');
      }
      return;
    }

    // Mobile: usa DocumentPicker
    console.log('[DEBUG] Entrando no bloco MOBILE');
    try {
      console.log('[DEBUG] Chamando DocumentPicker.getDocumentAsync...');
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/octet-stream',
        ],
      });

      console.log('[DEBUG] DocumentPicker result:', JSON.stringify(result));

      if ((result as any)?.canceled) {
        console.log('[DEBUG] Usuario cancelou');
        return;
      }
      const asset = (result as any)?.assets?.[0];
      console.log('[DEBUG] asset:', JSON.stringify(asset));
      if (!asset?.uri) {
        console.log('[DEBUG] asset.uri nao encontrado');
        return;
      }

      console.log('[DEBUG] Lendo arquivo como base64...');
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
      console.log('[DEBUG] base64.length:', base64.length);
      console.log('[DEBUG] Parseando workbook...');
      const workbook = XLSX.read(base64, { type: 'base64' });
      console.log('[DEBUG] workbook.SheetNames:', workbook.SheetNames);
      applyWorkbook(workbook);
    } catch (err) {
      console.error('[DEBUG] Erro no DocumentPicker:', err);
      Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
    }
  };

  // Retorna callback de clique para acao especifica
  const getActionPressHandler = (actionId: string) => {
    console.log('[DEBUG] getActionPressHandler chamado com actionId:', actionId);
    switch (actionId) {
      case '1':
        console.log('[DEBUG] Retornando openRegisterKeyman');
        return openRegisterKeyman;
      case '2':
        console.log('[DEBUG] Retornando handleDownloadModel');
        return handleDownloadModel;
      case '3':
        console.log('[DEBUG] Retornando handleUploadExcel');
        return handleUploadExcel;
      default:
        console.log('[DEBUG] Retornando undefined');
        return undefined;
    }
  };

  // Aguarda fontes carregarem
  if (!fontsLoaded) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Fundo escurecido */}
      <View style={styles.overlay}>
        {/* Container do Modal */}
        <View style={styles.modalContainer}>
          {/* Header - Linha 1: Instrucoes e Fechar */}
          <View style={styles.header}>
            {/* Botao Instrucoes (lado esquerdo) */}
            <TouchableOpacity
              style={styles.instructionsButton}
              onPress={() => setInstructionVideoVisible(true)}
              activeOpacity={0.7}
            >
              <PlayIcon />
              <Text style={styles.instructionsText}>Instruções</Text>
            </TouchableOpacity>

            {/* Botao Fechar (lado direito) */}
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <HeaderCloseIcon />
            </TouchableOpacity>
          </View>

          {/* Linha 2: Navegacao e Cliente */}
          <View style={styles.navigationRow}>
            {/* Navegacao (lado esquerdo) */}
            <View style={styles.navigationContainer}>
              {/* Botao Anterior */}
              <TouchableOpacity onPress={handlePrevious} activeOpacity={0.7}>
                <NavArrowLeftIcon />
              </TouchableOpacity>

              {/* Contador */}
              <View style={styles.navCounterBox}>
                <Text style={styles.navCounter}>
                  {String(currentIndex).padStart(2, '0')}/{String(totalItems).padStart(2, '0')}
                </Text>
              </View>

              {/* Botao Proximo */}
              <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
                <NavArrowRightIcon />
              </TouchableOpacity>
            </View>

            {/* Botao Cliente (lado direito) */}
            <TouchableOpacity
              style={styles.customerInfoButton}
              onPress={() => setCustomerInfoVisible(!customerInfoVisible)}
              activeOpacity={0.7}
            >
              <AvatarSlimIcon />
              <Text style={styles.customerInfoButtonText}>Cliente</Text>
            </TouchableOpacity>
          </View>

          {/* Secao Info do Cliente (expansivel) */}
          {customerInfoVisible && (
            <View style={styles.customerInfoContainer}>
              <View style={styles.customerInfoRow}>
                {/* Foto do Cliente - Quadrada com cantos arredondados */}
                <View style={styles.customerPhotoContainer}>
                  <Image
                    source={customerInfo?.photo ? { uri: customerInfo.photo } : DEFAULT_AVATAR}
                    style={styles.customerPhoto}
                  />
                </View>

                {/* Informacoes do Cliente - Layout vertical com divisorias */}
                <View style={styles.customerInfoTextContainer}>
                  {/* Nome do Cliente (sem label, fonte maior) */}
                  <Text style={styles.customerInfoName} numberOfLines={1} ellipsizeMode="tail">
                    {customerInfo?.name || 'Não informado'}
                  </Text>
                  <View style={styles.customerInfoDivider} />

                  {/* Produto */}
                  <View style={styles.customerInfoField}>
                    <View style={styles.customerInfoLabelRow}>
                      <Text style={styles.customerInfoLabel}>Produto:</Text>
                      <Text style={styles.customerInfoCounter}>
                        {String(customerInfo?.productIndex || 0).padStart(2, '0')}/{String(customerInfo?.totalProducts || 0).padStart(2, '0')}
                      </Text>
                    </View>
                    <Text style={styles.customerInfoValue} numberOfLines={1} ellipsizeMode="tail">
                      {customerInfo?.productName || 'Não informado'}
                    </Text>
                  </View>
                  <View style={styles.customerInfoDivider} />

                  {/* Fase */}
                  <View style={styles.customerInfoField}>
                    <View style={styles.customerInfoLabelRow}>
                      <Text style={styles.customerInfoLabel}>Fase:</Text>
                      <Text style={styles.customerInfoCounter}>
                        {String(customerInfo?.phaseIndex || 0).padStart(2, '0')}/{String(customerInfo?.totalPhases || 0).padStart(2, '0')}
                      </Text>
                    </View>
                    <Text style={styles.customerInfoValue} numberOfLines={1} ellipsizeMode="tail">
                      {customerInfo?.phaseName || 'Não informado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Secao Atividade */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionLabel}>Atividade:</Text>
            <View style={styles.activityRow}>
              <StatusFilledCheckIcon size={18} />
              <Text style={styles.activityTitle}>
                {activity?.title || 'Upload lista de Keymans'}
              </Text>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.sectionDivider} />

          {/* Secao Agenda */}
          <View style={styles.scheduleSection}>
            {/* Coluna esquerda com icones e linha */}
            <View style={styles.scheduleLeftColumn}>
              {/* Icone Calendario */}
              <CalendarIcon />
              {/* Linha vertical conectora */}
              <View style={styles.scheduleVerticalLine} />
              {/* Icone Relogio */}
              <ClockIcon />
            </View>
            {/* Coluna direita com conteudo */}
            <View style={styles.scheduleRightColumn}>
              {/* Linha Agenda */}
              <View style={styles.scheduleContentRow}>
                <Text style={styles.scheduleLabel}>Agenda:</Text>
                <Text style={styles.scheduleValue}>Hoje 09:00 às 10:15</Text>
              </View>
              {/* Divisoria horizontal */}
              <View style={styles.scheduleInnerDivider} />
              {/* Linha Tempo */}
              <View style={styles.scheduleContentRow}>
                <Text style={styles.scheduleLabel}>Tempo:</Text>
                <Text style={styles.scheduleValue}>1h 15min</Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.sectionDivider} />

          {/* Container Timeline */}
          <View style={styles.timelineContainer}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Ações</Text>
            <ScrollView style={styles.timelineScroll} showsVerticalScrollIndicator={false}>
              {actions.map((action: ActionItem, index: number) => (
                <TimelineStep
                  key={action.id}
                  number={String(index + 1).padStart(2, '0')}
                  title={action.title}
                  isCompleted={action.status === 'completed'}
                  isCurrent={index === currentStepIndex}
                  isLast={index === actions.length - 1}
                  onPress={getActionPressHandler(action.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Divisor */}
          <View style={styles.sectionDivider} />

          {/* Container Checklist (visivel) */}
          {checklistVisible && (
            <View style={styles.checklistContainer}>
              {/* Header do Checklist com botao de ocultar */}
              <View style={styles.checklistHeader}>
                <Text style={styles.sectionTitle}>Checklist</Text>
                {/* Botao sofisticado para ocultar */}
                <TouchableOpacity
                  style={styles.hideChecklistButton}
                  onPress={() => setChecklistVisible(false)}
                  activeOpacity={0.7}
                >
                  <HideIcon />
                  <Text style={styles.hideChecklistText}>Ocultar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.checklistScroll} showsVerticalScrollIndicator={false}>
                {actions.map((action: ActionItem) => (
                  <ChecklistItem
                    key={action.id}
                    title={action.title}
                    isCompleted={action.status === 'completed'}
                    completedDate={action.endDate}
                    onPress={getActionPressHandler(action.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Botao para mostrar Checklist quando oculto (azul) */}
          {!checklistVisible && (
            <TouchableOpacity
              style={styles.showChecklistButton}
              onPress={() => setChecklistVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.showChecklistTextBlue}>Checklist</Text>
              <ChevronDownBlueIcon />
            </TouchableOpacity>
          )}

        </View>
      </View>

      {/* Modal de Cadastro de Keyman */}
      <RegisterKeymanModal
        visible={registerKeymanVisible}
        onClose={closeRegisterKeyman}
        onSave={handleSaveKeyman}
      />

      {/* Modal de Video de Instrucoes */}
      <InstructionVideoModal
        visible={instructionVideoVisible}
        onClose={() => setInstructionVideoVisible(false)}
        videoTitle="Instruções da Atividade"
      />

      {/* Modal de Novo Contato (para Upload) */}
      <NewContactModal
        visible={newContactModalVisible}
        onClose={() => {
          setNewContactModalVisible(false);
          setImportedContacts([]);
        }}
        mode="criar"
        initialContacts={importedContacts}
        onSave={(data) => {
          console.log('Contato salvo:', data);
          setNewContactModalVisible(false);
          setImportedContacts([]);
        }}
        onSaveMany={(data) => {
          console.log('Contatos salvos:', data);
          setNewContactModalVisible(false);
          setImportedContacts([]);
        }}
      />
    </Modal>
  );
};

export default CommercialExecutionModal;
