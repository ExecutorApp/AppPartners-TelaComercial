import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, Pressable, LayoutChangeEvent, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import { SalesContractViewer, downloadSalesContract } from './2.SalesContract';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import DeleteReceiptModal from './2.PaymentFlow-Ted-DeleteReceipt';
import PaymentFlowPixApproved from './2.PaymentFlow-Pix-Approved';

const ProductCover = require('../../../assets/00001.png');

type Nav = StackNavigationProp<RootStackParamList, 'PaymentFlowTed'>;

const BackIconBlock: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path d="M19 28L10 19M10 19L19 10M10 19L28 19" stroke="#1777CF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIconBlock: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 9C13.481 9 9 13.481 9 19C9 24.519 13.481 29 19 29C24.519 29 29 24.519 29 19C29 13.481 24.519 9 19 9ZM19 10.5385C23.6697 10.5385 27.4615 14.3303 27.4615 19C27.4615 23.6697 23.6697 27.4615 19 27.4615C14.3303 27.4615 10.5385 23.6697 10.5385 19C10.5385 14.3303 14.3303 10.5385 19 10.5385Z"
      fill="#3A3F51"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2308 18.4872V22.5897C18.2308 22.7938 18.3118 22.9894 18.4561 23.1337C18.6003 23.2779 18.796 23.359 19 23.359C19.204 23.359 19.3997 23.2779 19.5439 23.1337C19.6882 22.9894 19.7692 22.7938 19.7692 22.5897V18.4872C19.7692 18.2832 19.6882 18.0875 19.5439 17.9433C19.3997 17.799 19.204 17.7179 19 17.7179C18.796 17.7179 18.6003 17.799 18.4561 17.9433C18.3118 18.0875 18.2308 18.2832 18.2308 18.4872Z"
      fill="#3A3F51"
    />
    <Path d="M19 16.4359C19.4248 16.4359 19.7692 16.0915 19.7692 15.6667C19.7692 15.2418 19.4248 14.8974 19 14.8974C18.5752 14.8974 18.2308 15.2418 18.2308 15.6667C18.2308 16.0915 18.5752 16.4359 19 16.4359Z" fill="#3A3F51" />
  </Svg>
);

const DownloadIcon13: React.FC = () => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <Path d="M6.40348 5.85249C6.70263 5.85249 6.94889 6.078 6.98258 6.36811L6.98649 6.4355V10.2773L8.32438 8.9394C8.53462 8.72942 8.86517 8.71384 9.09391 8.89155L9.14957 8.9394C9.35986 9.14968 9.37536 9.48107 9.19743 9.70991L9.14957 9.7646L6.81559 12.0986C6.60529 12.3085 6.27475 12.3243 6.04606 12.1464L5.99137 12.0986L3.65739 9.7646C3.42984 9.53677 3.42967 9.16712 3.65739 8.9394C3.86767 8.72921 4.19909 8.71365 4.42789 8.89155L4.48258 8.9394L5.82047 10.2773V6.4355C5.82058 6.11342 6.08138 5.85249 6.40348 5.85249ZM5.37223 0.0243629C7.15852 0.262563 8.65725 1.45743 9.28825 3.1103L9.35075 3.28511H9.61149C10.9822 3.28511 12.2267 4.25366 12.7033 5.64741L12.7492 5.78803C12.9484 6.71789 12.7739 7.62172 12.2736 8.47944C12.1112 8.75763 11.754 8.85171 11.4757 8.6894C11.1978 8.527 11.1036 8.1697 11.2658 7.89155C11.6256 7.27468 11.743 6.66443 11.6193 6.07807C11.3465 5.16917 10.5596 4.50654 9.71696 4.45503L9.61149 4.4521H8.91129C8.64055 4.45188 8.40564 4.26551 8.34391 4.0019C7.9946 2.50487 6.74507 1.38406 5.23746 1.18257C3.73004 1.03182 2.26358 1.83726 1.56266 3.18843C0.945244 4.47513 1.06053 6.5902 1.81657 7.74995C1.99256 8.0198 1.91649 8.38158 1.64664 8.55757C1.37688 8.73324 1.01595 8.65727 0.840004 8.38764C-0.141695 6.88237 -0.281457 4.33333 0.518715 2.66694C1.44642 0.877812 3.36766 -0.176411 5.37223 0.0243629Z" fill="#3A3F51" />
  </Svg>
);

const EyeIcon20x12: React.FC = () => (
  <Svg width={20} height={12} viewBox="0 0 20 12" fill="none">
    <Path d="M10 0C4.75546 0 0.317297 5.4 0.129769 5.634C0.0456258 5.73892 0 5.8676 0 6C0 6.1324 0.0456258 6.26109 0.129769 6.366C0.317297 6.6 4.75546 12 10 12C15.2445 12 19.6827 6.6 19.8702 6.366C19.9544 6.26109 20 6.1324 20 6C20 5.8676 19.9544 5.73892 19.8702 5.634C19.6827 5.4 15.2445 0 10 0ZM10 10.8C6.10567 10.8 2.49887 7.2 1.43621 6C2.49887 4.8 6.09941 1.2 10 1.2C13.9006 1.2 17.5011 4.8 18.5638 6C17.5011 7.2 13.9006 10.8 10 10.8Z" fill="#3A3F51" />
    <Path d="M13.1255 5.4C13.2286 5.39992 13.3302 5.37533 13.4211 5.32842C13.5119 5.28151 13.5893 5.21374 13.6462 5.13116C13.7032 5.04858 13.7379 4.95375 13.7474 4.85514C13.7569 4.75652 13.7408 4.65719 13.7006 4.566C13.3567 3.90877 12.8276 3.35735 12.1734 2.97444C11.5192 2.59153 10.7662 2.39251 10 2.4C9.00529 2.4 8.05132 2.77929 7.34795 3.45442C6.64458 4.12955 6.24944 5.04522 6.24944 6C6.24944 6.95478 6.64458 7.87045 7.34795 8.54559C8.05132 9.22072 9.00529 9.6 10 9.6C10.7662 9.60749 11.5192 9.40847 12.1734 9.02556C12.8276 8.64266 13.3567 8.09123 13.7006 7.434C13.7408 7.34281 13.7569 7.24348 13.7474 7.14487C13.7379 7.04625 13.7032 6.95143 13.6462 6.86884C13.5893 6.78626 13.5119 6.71849 13.4211 6.67158C13.3302 6.62467 13.2286 6.60008 13.1255 6.6C13.0412 6.60849 12.956 6.5988 12.8762 6.57165C12.7963 6.5445 12.7238 6.50057 12.6639 6.44306C12.604 6.38556 12.5582 6.31594 12.5299 6.23928C12.5016 6.16263 12.4915 6.08088 12.5004 6C12.4915 5.91912 12.5016 5.83737 12.5299 5.76072C12.5582 5.68406 12.604 5.61444 12.6639 5.55694C12.7238 5.49944 12.7963 5.4555 12.8762 5.42835C12.956 5.4012 13.0412 5.39151 13.1255 5.4Z" fill="#3A3F51" />
  </Svg>
);

const TrashIcon38: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#FF0004" fillOpacity={0.05} />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <G transform="translate(6.65, 6.65) scale(0.65)">
      <Path d="M15.8 15.2727C16.4923 15.2727 17.0629 15.7991 17.1409 16.4773L17.15 16.6364V24.8182C17.15 25.5713 16.5456 26.1818 15.8 26.1818C15.1077 26.1818 14.5371 25.6554 14.4591 24.9772L14.45 24.8182V16.6364C14.45 15.8832 15.0544 15.2727 15.8 15.2727Z" fill="#EF4444" />
      <Path d="M22.5409 16.4773C22.4629 15.7991 21.8923 15.2727 21.2 15.2727C20.4544 15.2727 19.85 15.8832 19.85 16.6364V24.8182L19.8591 24.9772C19.9371 25.6554 20.5077 26.1818 21.2 26.1818C21.9456 26.1818 22.55 25.5713 22.55 24.8182V16.6364L22.5409 16.4773Z" fill="#EF4444" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M21.2 2.5C23.3569 2.5 25.1199 4.20307 25.2431 6.35054L25.25 6.59091V7.95455H30.65C31.3956 7.95455 32 8.56507 32 9.31818C32 10.0175 31.4788 10.5939 30.8074 10.6726L30.65 10.6818H29.3V28.4091C29.3 30.5877 27.614 32.3686 25.488 32.4931L25.25 32.5H11.75C9.59313 32.5 7.83006 30.7969 7.70688 28.6495L7.7 28.4091V10.6818H6.35C5.60442 10.6818 5 10.0713 5 9.31818C5 8.61886 5.52115 8.04249 6.19256 7.96372L6.35 7.95455H11.75V6.59091C11.75 4.41225 13.436 2.63137 15.562 2.50694L15.8 2.5H21.2ZM10.4 10.6818V28.4091C10.4 29.1084 10.9211 29.6848 11.5926 29.7636L11.75 29.7727H25.25C25.9423 29.7727 26.5129 29.2463 26.5909 28.5681L26.6 28.4091V10.6818H10.4ZM22.55 7.95455H14.45V6.59091L14.4591 6.43188C14.5371 5.75369 15.1077 5.22727 15.8 5.22727H21.2L21.3574 5.23645C22.0288 5.31522 22.55 5.89159 22.55 6.59091V7.95455Z" fill="#EF4444" />
    </G>
  </Svg>
);

const CloseIcon38: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path d="M25.155 13.2479C24.7959 12.9179 24.2339 12.9173 23.874 13.2466L19 17.7065L14.126 13.2466C13.7661 12.9173 13.2041 12.9179 12.845 13.2479L12.7916 13.297C12.4022 13.6549 12.4029 14.257 12.7931 14.614L17.5863 19L12.7931 23.386C12.4029 23.743 12.4022 24.3451 12.7916 24.703L12.845 24.7521C13.2041 25.0821 13.7661 25.0827 14.126 24.7534L19 20.2935L23.874 24.7534C24.2339 25.0827 24.7959 25.0821 25.155 24.7521L25.2084 24.703C25.5978 24.3451 25.5971 23.743 25.2069 23.386L20.4137 19L25.2069 14.614C25.5971 14.257 25.5978 13.6549 25.2084 13.297L25.155 13.2479Z" fill="#3A3F51" />
  </Svg>
);

const CopyIcon35: React.FC<{ highlight?: boolean; size?: number; boxed?: boolean }> = ({ highlight, size = 35, boxed = true }) => (
  <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
    {boxed ? (
      <>
        <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={3.75} fill="#FFFFFF" />
        <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={3.75} stroke={highlight ? '#1777CF' : '#D8E0F0'} strokeWidth={0.5} />
      </>
    ) : null}
    <Path
      d="M10.8433 21.4475C10.5875 21.3021 10.3747 21.0916 10.2266 20.8374C10.0785 20.5832 10.0003 20.2942 10 20V11.6667C10 10.75 10.75 10 11.6667 10H20C20.625 10 20.965 10.3208 21.25 10.8333M13.3333 15.5558C13.3333 14.9664 13.5675 14.4011 13.9843 13.9843C14.4011 13.5675 14.9664 13.3333 15.5558 13.3333H22.7775C23.0694 13.3333 23.3584 13.3908 23.628 13.5025C23.8977 13.6142 24.1427 13.7779 24.349 13.9843C24.5554 14.1907 24.7191 14.4357 24.8308 14.7053C24.9425 14.975 25 15.264 25 15.5558V22.7775C25 23.0694 24.9425 23.3584 24.8308 23.628C24.7191 23.8977 24.5554 24.1427 24.349 24.349C24.1427 24.5554 23.8977 24.7191 23.628 24.8308C23.3584 24.9425 23.0694 25 22.7775 25H15.5558C15.264 25 14.975 24.9425 14.7053 24.8308C14.4357 24.7191 14.1907 24.5554 13.9843 24.349C13.7779 24.1427 13.6142 23.8977 13.5025 23.628C13.3908 23.3584 13.3333 23.0694 13.3333 22.7775V15.5558Z"
      stroke={highlight ? '#1777CF' : '#3A3F51'}
      strokeWidth={0.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloudUpload50: React.FC<{ highlight?: boolean }> = ({ highlight }) => (
  <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
    <Path d="M49.5668 22.8398C48.0804 17.8398 43.6212 14.0898 38.6665 14.0898H35.6937C33.9595 6.58983 27.7662 1.08983 20.3341 0.0898253C12.9021 -0.660175 5.71779 3.33983 2.24951 10.0898C-0.723307 16.3398 -1.38033 26.639 4.21253 32.6369C5.7347 33.2571 7.71198 33.7648 9.9848 34.1682C10.1278 33.3448 10.475 32.5357 11.0339 31.8131L11.3452 31.4646L21.2546 21.4646C23.0263 19.6767 25.8337 19.5102 27.7971 21.0508L27.9162 21.1504L28.2616 21.4646L38.171 31.4646C39.0698 32.3716 39.5511 33.5404 39.6149 34.7278C43.6265 34.2522 46.6709 33.5399 47.8376 32.6369C50.31 30.8049 50.31 26.3398 49.5668 22.8398Z" fill={highlight ? '#1777CF' : '#5F758B'} fillOpacity={highlight ? 0.9 : 0.5} />
    <Path d="M34.6905 37.5C35.3168 37.4942 35.9413 37.2501 36.4192 36.7679C37.3867 35.7916 37.3867 34.2086 36.4192 33.2323L26.5098 23.2323L26.2764 23.0244C25.3046 22.2618 23.8994 22.3311 23.0063 23.2323L13.0969 33.2323L12.8909 33.4678C12.6419 33.791 12.4824 34.1616 12.4124 34.5456C12.4174 34.5463 12.4224 34.5469 12.4274 34.5476C12.2858 35.3284 12.5141 36.164 13.1123 36.7678L13.3457 36.9757C13.7933 37.3269 14.3327 37.5017 14.8717 37.5C15.498 37.4942 16.1226 37.2501 16.6004 36.7679L22.2807 31.0376V35.3284C22.2859 35.3286 22.291 35.3288 22.2961 35.3289V47.5L22.3128 47.7916C22.4559 49.0349 23.503 50 24.7735 50L24.7813 50C26.1388 49.9874 27.2354 48.873 27.2354 47.5001V31.0376L31.481 35.3205C31.4861 35.3204 31.4911 35.3202 31.4961 35.32L32.9311 36.7678L33.1645 36.9757C33.612 37.3269 34.1515 37.5017 34.6905 37.5Z" fill={highlight ? '#1777CF' : '#5F758B'} fillOpacity={highlight ? 0.9 : 0.5} />
  </Svg>
);

const PaymentFlowTed: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [contractViewerVisible, setContractViewerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'principal' | 'bank'>('principal');
  const insets = useSafeAreaInsets();
  const [isHover, setIsHover] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [receiptPreviewUri, setReceiptPreviewUri] = useState<string | null>(null);
  const [receiptPreviewIsImage, setReceiptPreviewIsImage] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [receiptViewerVisible, setReceiptViewerVisible] = useState(false);
  const [deleteReceiptModalVisible, setDeleteReceiptModalVisible] = useState(false);
  const [sendInProgress, setSendInProgress] = useState(false);
  const [approvedVisible, setApprovedVisible] = useState(false);
  const [sendEnabled, setSendEnabled] = useState(false);
  const sendEnableTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploadCardSize, setUploadCardSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [copyFeedbackMessage, setCopyFeedbackMessage] = useState<string | null>(null);
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fieldCopyFeedbackLabel, setFieldCopyFeedbackLabel] = useState<string | null>(null);
  const fieldCopyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bankFieldCopyIconSize = 30; // Ajuste manualmente este valor para aumentar/diminuir o tamanho do ícone de copiar nos campos
  const webPreviewObjectUrlRef = useRef<string | null>(null);

  const bankFields = [
    { label: 'Banco', value: 'Banco Alfa S.A. (Código 325)' },
    { label: 'Agência', value: '0458-2' },
    { label: 'Conta', value: '17854-9 (Conta Corrente)' },
    { label: 'Razão Social', value: 'LegalTech Consultoria Jurídica Ltda' },
    { label: 'CNPJ', value: '12.345.678/0001-90', valueBoxStyle: styles.bankFieldValueBoxCnpj },
  ];

  const writeToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web' && (navigator as any)?.clipboard?.writeText) {
        await (navigator as any).clipboard.writeText(text);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) clearTimeout(copyFeedbackTimeoutRef.current);
      if (fieldCopyFeedbackTimeoutRef.current) clearTimeout(fieldCopyFeedbackTimeoutRef.current);
      if (sendEnableTimeoutRef.current) clearTimeout(sendEnableTimeoutRef.current);
      if (webPreviewObjectUrlRef.current && Platform.OS === 'web') {
        try {
          URL.revokeObjectURL(webPreviewObjectUrlRef.current);
        } catch {}
      }
    };
  }, []);

  const scheduleSendEnable = () => {
    if (sendEnableTimeoutRef.current) clearTimeout(sendEnableTimeoutRef.current);
    setSendEnabled(false);
    sendEnableTimeoutRef.current = setTimeout(() => {
      setSendEnabled(true);
      sendEnableTimeoutRef.current = null;
    }, 3000);
  };

  const showCopyFeedback = (message: string) => {
    if (copyFeedbackTimeoutRef.current) clearTimeout(copyFeedbackTimeoutRef.current);
    // Feedback de sucesso ao copiar: exibe mensagem indicando qual campo foi copiado
    setCopyFeedbackMessage(message);
    copyFeedbackTimeoutRef.current = setTimeout(() => setCopyFeedbackMessage(null), 3500);
  };

  const handleCopyAll = async () => {
    const bankData = bankFields.map((f) => `${f.label}: ${f.value}`).join('\n');
    const didCopy = await writeToClipboard(bankData);
    if (didCopy) showCopyFeedback('Dados bancários copiados');
    else Alert.alert('Dados bancários', bankData);
  };

  const handleCopyField = async (label: string, value: string) => {
    const didCopy = await writeToClipboard(value);
    if (didCopy) {
      if (fieldCopyFeedbackTimeoutRef.current) clearTimeout(fieldCopyFeedbackTimeoutRef.current);
      setFieldCopyFeedbackLabel(label);
      fieldCopyFeedbackTimeoutRef.current = setTimeout(() => setFieldCopyFeedbackLabel(null), 3500);
    } else {
      Alert.alert(label, value);
    }
  };

  const getFieldCopySuccessMessage = (label: string) => {
    switch (label) {
      case 'Banco':
        return 'Os dados do banco foram copiados com sucesso';
      case 'Agência':
        return 'Os dados da agência foram copiados com sucesso';
      case 'Conta':
        return 'Os dados da conta foram copiados com sucesso';
      case 'Razão Social':
        return 'Os dados da razão social foram copiados com sucesso';
      case 'CNPJ':
        return 'Os dados do CNPJ foram copiados com sucesso';
      default:
        return `Os dados de ${label.toLowerCase()} foram copiados com sucesso`;
    }
  };

  const pickDocument = async () => {
    if (uploadInProgress) return;
    const res = await DocumentPicker.getDocumentAsync({ multiple: false });
    if ('assets' in res && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const isImage = Boolean(asset.mimeType?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(asset.name || ''));
      setSelectedFileName(asset.name || 'arquivo');
      setReceiptPreviewIsImage(isImage);
      setReceiptPreviewUri(isImage ? (asset.uri || null) : null);
      setUploadInProgress(true);
      setUploadSuccess(false);
      setSendEnabled(false);
      if (Platform.OS === 'web') {
        setTimeout(() => {
          setUploadInProgress(false);
          setUploadSuccess(true);
          scheduleSendEnable();
        }, 600);
      } else {
        try {
          const destPath = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}${asset.name || 'comprovante'}` : undefined;
          if (destPath && asset.uri) {
            await FileSystem.copyAsync({ from: asset.uri, to: destPath });
          }
          setUploadSuccess(true);
          scheduleSendEnable();
        } catch {
          Alert.alert('Erro', 'Falha ao enviar comprovante.');
        } finally {
          setUploadInProgress(false);
        }
      }
    }
  };

  const handleDropWeb = async (e: any) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploadInProgress) return;
    const files = e?.dataTransfer?.files;
    if (files && files.length > 0) {
      const f = files[0];
      const isImage = Boolean(f?.type && typeof f.type === 'string' && f.type.startsWith('image/'));
      setSelectedFileName(f.name || 'arquivo');
      setReceiptPreviewIsImage(isImage);
      if (isImage && Platform.OS === 'web' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        try {
          if (webPreviewObjectUrlRef.current) URL.revokeObjectURL(webPreviewObjectUrlRef.current);
        } catch {}
        const objectUrl = URL.createObjectURL(f);
        webPreviewObjectUrlRef.current = objectUrl;
        setReceiptPreviewUri(objectUrl);
      } else {
        setReceiptPreviewUri(null);
      }
      setUploadInProgress(true);
      setUploadSuccess(false);
      setSendEnabled(false);
      setTimeout(() => {
        setUploadInProgress(false);
        setUploadSuccess(true);
        scheduleSendEnable();
      }, 600);
    }
  };

  const webDropProps = Platform.OS === 'web' ? ({
    onDragOver: (e: any) => { e.preventDefault(); setIsDragOver(true); },
    onDragLeave: () => { setIsDragOver(false); },
    onDrop: handleDropWeb,
  } as any) : {};

  const handleSendReceipt = () => {
    if (!sendEnabled || sendInProgress) return;
    setSendInProgress(true);
    setTimeout(() => {
      setSendInProgress(false);
      setApprovedVisible(true);
    }, 5000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate(ScreenNames.PaymentFlowHome)}>
            <BackIconBlock />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <View style={styles.headerIcon}>
            <InfoIconBlock />
          </View>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Contrato de venda</Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => downloadSalesContract()}>
              <Text style={styles.actionText}>Baixar</Text>
              <DownloadIcon13 />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => setContractViewerVisible(true)}>
              <Text style={styles.actionText}>Visualizar</Text>
              <EyeIcon20x12 />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
        </View>

        <View style={styles.mainCard}>
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>TED</Text>
            </View>
            <View style={styles.productRow}>
              <View style={styles.productCoverWrap}>
                <Image source={ProductCover} style={styles.productCover} resizeMode="cover" />
              </View>
              <View style={styles.productCol}>
                <View style={styles.productTitleRow}>
                  <Text style={styles.productTitle}>Holding Patrimonial</Text>
                </View>
                <View style={styles.productSubRow}>
                  <Text style={styles.productSub}>Reunião de entrada</Text>
                </View>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>R$ 800,00</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tabsWrap}>
            <View style={styles.tabsBase}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  styles.tabButtonPrincipal,
                  activeTab === 'principal' ? styles.tabActive : null,
                ]}
                activeOpacity={0.9}
                onPress={() => setActiveTab('principal')}
              >
                <Text style={[styles.tabText, activeTab === 'principal' ? styles.tabTextActive : null]}>Principal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'bank' ? styles.tabActive : null]}
                activeOpacity={0.9}
                onPress={() => setActiveTab('bank')}
              >
                <Text style={[styles.tabText, activeTab === 'bank' ? styles.tabTextActive : null]}>Ver dados bancários</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentArea}>
            <View style={styles.copyBlock}>
              <View style={styles.copyRow}>
                <TouchableOpacity
                  // Removido estado ativo azul do container de copiar (mantém apenas ícone com borda azul e fundo branco)
                  style={styles.copyLeft}
                  activeOpacity={0.9}
                  onPress={handleCopyAll}
                >
                  <Text style={styles.copyText}>Copiar dados bancários</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // Removido estado ativo azul do container de copiar (mantém apenas ícone com borda azul e fundo branco)
                  style={styles.copyIconBtn}
                  activeOpacity={0.9}
                  onPress={handleCopyAll}
                >
                  <CopyIcon35 highlight={true} />
                </TouchableOpacity>
              </View>

              {copyFeedbackMessage ? <Text style={styles.copyFeedbackText}>{copyFeedbackMessage}</Text> : null}
            </View>

            {activeTab === 'principal' ? (
              uploadSuccess ? (
                <View style={styles.uploadSuccessOuter}>
                  <View style={styles.uploadSuccessCard}>
                  <View style={styles.uploadSuccessTextBox}>
                    <Text style={styles.uploadSuccessTitle}>Excelente!</Text>
                    <Text style={styles.uploadSuccessSubtitle}>Comprovante anexado com sucesso!</Text>
                  </View>
                  <Pressable style={styles.uploadSuccessPreviewWrap} onPress={() => setReceiptViewerVisible(true)}>
                    <Image
                      source={{ uri: (receiptPreviewIsImage && receiptPreviewUri) ? receiptPreviewUri : 'https://placehold.co/283x393' }}
                      style={styles.uploadSuccessPreviewImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View
                // Efeito hover no container de upload: borda azul, ícone azul e fundo azul claro
                  {...(Platform.OS === 'web'
                    ? ({
                        onMouseEnter: () => setIsHover(true),
                        onMouseLeave: () => setIsHover(false),
                        onPointerEnter: () => setIsHover(true),
                        onPointerLeave: () => setIsHover(false),
                        onMouseMove: () => setIsHover(true),
                      } as any)
                    : {})}
                  style={styles.uploadHoverWrap}
                >
                  <Pressable
                    style={[
                      styles.uploadCard,
                      (isHover || isDragOver) ? styles.uploadCardHover : null,
                    ]}
                    onLayout={(e: LayoutChangeEvent) => {
                      const { width, height } = e.nativeEvent.layout;
                      setUploadCardSize({ width, height });
                    }}
                    onPress={pickDocument}
                    {...webDropProps}
                  >
                    <View style={styles.uploadBorderOverlay} pointerEvents="none">
                      <Svg width={uploadCardSize.width} height={uploadCardSize.height}>
                        <Rect
                          x={0.5}
                          y={0.5}
                          width={Math.max(0, uploadCardSize.width - 1)}
                          height={Math.max(0, uploadCardSize.height - 1)}
                          rx={12}
                          stroke={(isHover || isDragOver) ? '#1777CF' : 'rgba(95, 117, 139, 0.5)'}
                          strokeWidth={1}
                          // Ajuste fino do espaçamento da borda tracejada (dash spacing menor)
                          strokeDasharray="12 7"
                          fill="transparent"
                        />
                      </Svg>
                    </View>

                    <CloudUpload50 highlight={isHover || isDragOver} />
                    <View style={styles.uploadTextWrap}>
                      <Text style={styles.uploadText}>
                        Para fazer upload de um comprovante, toque no ícone acima, ou arraste aqui.
                      </Text>
                    </View>
                    {selectedFileName ? (
                      <View style={styles.uploadTextWrap}>
                        <Text style={styles.uploadText}>{selectedFileName}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                </View>
              )
            ) : (
              <View style={styles.bankDetailsWrap}>
                {bankFields.map((field) => (
                  <View key={field.label} style={styles.bankField}>
                    <View style={styles.bankFieldLabelRow}>
                      <Text style={styles.bankFieldLabel}>{field.label}</Text>
                    </View>
                    <View style={[styles.bankFieldValueBox, field.valueBoxStyle]}>
                      <Text style={styles.bankFieldValueText}>{field.value}</Text>
                      <TouchableOpacity
                        // Ícone de copiar individual adicionado em cada campo de dado bancário
                        style={styles.copyFieldIconBtn}
                        activeOpacity={0.9}
                        onPress={() => handleCopyField(field.label, field.value)}
                      >
                        <CopyIcon35 highlight={true} size={bankFieldCopyIconSize} boxed={false} />
                      </TouchableOpacity>
                    </View>
                    {fieldCopyFeedbackLabel === field.label ? (
                      <Text style={styles.bankFieldCopyFeedbackText}>{getFieldCopySuccessMessage(field.label)}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View
            style={[
              styles.sendRow,
              {
                // Espaçamento ajustado para 10px entre upload e botão de envio
                marginTop: 10,
                marginBottom: insets.bottom,
              },
            ]}
          >
            <TouchableOpacity style={[styles.sendButton, !sendEnabled ? styles.sendButtonDisabled : null]} activeOpacity={0.9} disabled={!sendEnabled || uploadInProgress || sendInProgress} onPress={handleSendReceipt}>
              <Text style={styles.sendButtonText}>Enviar comprovante</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SalesContractViewer visible={contractViewerVisible} onClose={() => setContractViewerVisible(false)} title="Contrato de venda" />
        <PaymentFlowPixApproved
          visible={approvedVisible}
          onClose={() => setApprovedVisible(false)}
          title="Excelente!"
          subtitle="Seu comprovante foi enviado com sucesso."
          primaryText="Fechar"
          buttonBottomPadding={20}
        />
        <Modal
          visible={receiptViewerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setReceiptViewerVisible(false)}
        >
          <View style={styles.viewerOverlay}>
            <View style={styles.viewerCard}>
              <View style={styles.viewerHeaderRow}>
                <View style={styles.viewerTitleCol}>
                  <Text style={styles.viewerTitle}>Comprovante</Text>
                  {selectedFileName ? <Text style={styles.viewerSubtitle} numberOfLines={1} ellipsizeMode="tail">{selectedFileName}</Text> : null}
                  <View style={styles.viewerDivider} />
                </View>
              </View>
              <View style={styles.viewerContent}>
                <Image
                  source={{ uri: (receiptPreviewIsImage && receiptPreviewUri) ? receiptPreviewUri : 'https://placehold.co/293x407' }}
                  style={styles.viewerImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.viewerActionsRow}>
              <TouchableOpacity style={styles.viewerIconBtn} onPress={() => {
                setDeleteReceiptModalVisible(true);
              }}>
                <TrashIcon38 />
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewerIconBtn} onPress={() => setReceiptViewerVisible(false)}>
                <CloseIcon38 />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <DeleteReceiptModal
          visible={deleteReceiptModalVisible}
          onCancel={() => setDeleteReceiptModalVisible(false)}
          onConfirm={() => {
            setSelectedFileName(null);
            setReceiptPreviewUri(null);
            setReceiptPreviewIsImage(false);
            setUploadSuccess(false);
            setSendEnabled(false);
            setDeleteReceiptModalVisible(false);
            setReceiptViewerVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(252, 252, 252, 0.80)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  headerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  headerContent: {
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    gap: 20,
  },
  titleRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    width: 300,
    color: '#3A3F51',
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
  },
  actionsRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 13,
    flexDirection: 'row',
  },
  actionCard: {
    flex: 1,
    height: 38,
    padding: 14,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  actionText: {
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  separator: {
    alignSelf: 'stretch',
    height: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#D8E0F0',
  },
  mainCard: {
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FCFCFC',
    gap: 20,
    flex: 1,
  },
  section: {
    alignSelf: 'stretch',
    gap: 10,
  },
  sectionTitleRow: {
    alignSelf: 'stretch',
    height: 24,
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  productRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  productCoverWrap: {},
  productCover: {
    width: 60,
    height: 70,
    borderRadius: 4,
  },
  productCol: {
    flex: 1,
    gap: 5,
  },
  productTitleRow: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  productTitle: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  productSubRow: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  productSub: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  productPriceRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  productPrice: {
    color: '#91929E',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  tabsWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 20,
  },
  tabsBase: {
    // Ajuste de altura do container das abas (40px)
    height: 45,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    flexDirection: 'row',
  },
  tabButton: {
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonPrincipal: {
    width: 115,
  },
  tabActive: {
    backgroundColor: '#1777CF',
  },
  tabText: {
    color: '#3A3F51',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  tabTextActive: {
    color: '#FCFCFC',
  },
  copyRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  copyBlock: {
    alignSelf: 'stretch',
    gap: 6,
  },
  copyLeft: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  copyText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  copyFeedbackText: {
    color: '#2E7D32',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    paddingLeft: 10,
  },
  copyIconBtn: {
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyFieldIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  contentArea: {
    alignSelf: 'stretch',
    flex: 1,
    gap: 15,
  },
  uploadHoverWrap: {
    alignSelf: 'stretch',
    flex: 1,
  },
  uploadCard: {
    alignSelf: 'stretch',
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  uploadCardHover: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
  },
  uploadBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  uploadSuccessOuter: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  uploadSuccessCard: {
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  uploadSuccessTextBox: {
    width: '100%',
    maxWidth: 283,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  uploadSuccessTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  uploadSuccessSubtitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  uploadSuccessPreviewWrap: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 2,
    paddingRight: 2,
    flex: 1,
  },
  uploadSuccessPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    shadowColor: 'rgba(1, 18, 34, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
  },
  viewerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCard: {
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: '#FCFCFC',
    borderRadius: 0,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  viewerActionsRow: {
    position: 'absolute',
    top: 15,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  viewerHeaderRow: {
    alignSelf: 'stretch',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 0,
    paddingBottom: 5,
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 13,
  },
  viewerTitleCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewerTitle: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    paddingTop: 60,
    marginBottom: 10,
  },
  viewerSubtitle: {
    color: '#7D8592',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  viewerDivider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: '#D8E0F0',
    marginTop: 8,
  },
  viewerIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerContent: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 6,
  },
  viewerImage: {
    alignSelf: 'stretch',
    flex: 1,
    borderRadius: 4,
    shadowColor: 'rgba(1, 18, 34, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
  },
  bankDetailsWrap: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // Aumentado espaçamento entre os containers dos campos bancários
    gap: 15,
  },
  bankField: {
    alignSelf: 'stretch',
    // Aumentado tamanho do container do campo (acompanha altura do valueBox)
    minHeight: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 6,
  },
  bankFieldLabelRow: {
    alignSelf: 'stretch',
    paddingLeft: 6,
    paddingRight: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bankFieldLabel: {
    flex: 1,
    alignSelf: 'stretch',
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  bankFieldValueBox: {
    alignSelf: 'stretch',
    // Aumentado altura do container do valor do campo bancário (35px)
    height: 35,
    paddingLeft: 10,
    paddingRight: 5,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  bankFieldValueBoxCnpj: {
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    backgroundColor: '#FCFCFC',
  },
  bankFieldValueText: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  bankFieldCopyFeedbackText: {
    color: '#2E7D32',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    paddingLeft: 6,
  },
  uploadTextWrap: {
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 5,
  },
  uploadText: {
    textAlign: 'center',
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  sendRow: {
    alignSelf: 'stretch',
    height: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    flexDirection: 'row',
  },
  sendButton: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(23, 119, 207, 0.20)',
  },
  sendButtonText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  bankDetailsCard: {
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 10,
  },
  bankDetailsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankDetailLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  bankDetailValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
});

export default PaymentFlowTed;
