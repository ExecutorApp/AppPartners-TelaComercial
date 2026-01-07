import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Platform, Modal, Alert, Linking } from 'react-native';
import { Svg, Path, Rect, G, Defs, ClipPath } from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

// Cores do tema
const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  labelText: '#64748B',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
  inputBorder: '#CBD5E1',
};

const KEYMAN_PHOTO_BY_NAME: Record<string, any> = {
  'Camila Betanea': require('../../../assets/0000001.png'),
  'Ruan de Londres': require('../../../assets/0000002.png'),
  'Gabriela de Assis': require('../../../assets/0000003.png'),
};

// Ícone de importar Excel
const ImportExcelIcon = () => (
  <Svg width="20" height="27" viewBox="0 0 20 27" fill="none">
    <Path
      d="M19.8267 12.1359C19.2322 10.1359 17.4485 8.63593 15.4666 8.63593H14.2775C13.5838 5.63593 11.1065 3.43593 8.13366 3.03593C5.16084 2.73593 2.28712 4.33593 0.899804 7.03593C-0.289323 9.53593 -0.552131 13.6556 1.68501 16.0548C2.29388 16.3028 3.08479 16.5059 3.99392 16.6673C4.05111 16.3379 4.18999 16.0143 4.41355 15.7252L4.53808 15.5858L8.50183 11.5858C9.21051 10.8707 10.3335 10.8041 11.1188 11.4203L11.1665 11.4602L11.3046 11.5858L15.2684 15.5858C15.6279 15.9486 15.8204 16.4162 15.8459 16.8911C17.4506 16.7009 18.6683 16.416 19.1351 16.0548C20.124 15.322 20.124 13.5359 19.8267 12.1359Z"
      fill={COLORS.primary}
    />
    <Path
      d="M13.8762 18C14.1267 17.9977 14.3765 17.9 14.5677 17.7071C14.9547 17.3166 14.9547 16.6835 14.5677 16.2929L10.6039 12.2929L10.5106 12.2097C10.1218 11.9047 9.55975 11.9324 9.20253 12.2929L5.23878 16.2929L5.15634 16.3871C5.05675 16.5164 4.99296 16.6646 4.96496 16.8182C4.96696 16.8185 4.96896 16.8188 4.97096 16.819C4.91431 17.1313 5.00563 17.4656 5.24493 17.7071L5.33829 17.7903C5.5173 17.9308 5.73308 18.0007 5.94868 18C6.19921 17.9977 6.44902 17.9 6.64018 17.7071L8.91229 15.415V17.1314C8.91434 17.1314 8.9164 17.1315 8.91845 17.1316V22L8.92512 22.1166C8.98236 22.614 9.4012 23 9.90939 23L9.91252 23C10.4555 22.995 10.8942 22.5492 10.8942 22V15.415L12.5924 17.1282C12.5944 17.1281 12.5964 17.1281 12.5984 17.128L13.1724 17.7071L13.2658 17.7903C13.4448 17.9308 13.6606 18.0007 13.8762 18Z"
      fill={COLORS.primary}
    />
  </Svg>
);

const CloseModalIcon = () => (
  <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <Rect width="38" height="38" rx="8" fill="#F4F4F4" />
    <Rect width="38" height="38" rx="8" stroke="#EDF2F6" />
    <Path
      d="M25.155 13.2479C24.7959 12.9179 24.2339 12.9173 23.874 13.2466L19 17.7065L14.126 13.2466C13.7661 12.9173 13.2041 12.9179 12.845 13.2479L12.7916 13.297C12.4022 13.6549 12.4029 14.257 12.7931 14.614L17.5863 19L12.7931 23.386C12.4029 23.743 12.4022 24.3451 12.7916 24.703L12.845 24.7521C13.2041 25.0821 13.7661 25.0827 14.126 24.7534L19 20.2935L23.874 24.7534C24.2339 25.0827 24.7959 25.0821 25.155 24.7521L25.2084 24.703C25.5978 24.3451 25.5971 23.743 25.2069 23.386L20.4137 19L25.2069 14.614C25.5971 14.257 25.5978 13.6549 25.2084 13.297L25.155 13.2479Z"
      fill="#3A3F51"
    />
  </Svg>
);

const TrashButtonIcon = () => (
  <Svg width="41" height="41" viewBox="0 0 41 41" fill="none">
    <Rect x="0.5" y="0.5" width="40" height="40" rx="6" fill="#FF0004" fillOpacity="0.05" />
    <Rect x="0.5" y="0.5" width="40" height="40" rx="6" stroke="#C1253A" strokeOpacity="0.2" />
    <Path
      d="M19.2 19.1364C19.5333 19.1364 19.8081 19.3996 19.8456 19.7387L19.85 19.8182V23.9091C19.85 24.2856 19.559 24.5909 19.2 24.5909C18.8667 24.5909 18.5919 24.3277 18.5544 23.9886L18.55 23.9091V19.8182C18.55 19.4416 18.841 19.1364 19.2 19.1364Z"
      fill="#EF4444"
    />
    <Path
      d="M22.4456 19.7387C22.4081 19.3996 22.1333 19.1364 21.8 19.1364C21.441 19.1364 21.15 19.4416 21.15 19.8182V23.9091L21.1544 23.9886C21.1919 24.3277 21.4667 24.5909 21.8 24.5909C22.159 24.5909 22.45 24.2856 22.45 23.9091V19.8182L22.4456 19.7387Z"
      fill="#EF4444"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.8 13C22.8385 13 23.6874 13.8515 23.7467 14.9253L23.75 15.0455V15.7273H26.35C26.709 15.7273 27 16.0325 27 16.4091C27 16.7588 26.7491 17.0469 26.4258 17.0863L26.35 17.0909H25.7V25.9545C25.7 27.0439 24.8882 27.9343 23.8646 27.9965L23.75 28H17.25C16.2115 28 15.3626 27.1485 15.3033 26.0747L15.3 25.9545V17.0909H14.65C14.291 17.0909 14 16.7856 14 16.4091C14 16.0594 14.2509 15.7712 14.5742 15.7319L14.65 15.7273H17.25V15.0455C17.25 13.9561 18.0618 13.0657 19.0854 13.0035L19.2 13H21.8ZM16.6 17.0909V25.9545C16.6 26.3042 16.8509 26.5924 17.1742 26.6318L17.25 26.6364H23.75C24.0833 26.6364 24.3581 26.3732 24.3956 26.0341L24.4 25.9545V17.0909H16.6ZM22.45 15.7273H18.55V15.0455L18.5544 14.9659C18.5919 14.6268 18.8667 14.3636 19.2 14.3636H21.8L21.8758 14.3682C22.1991 14.4076 22.45 14.6958 22.45 15.0455V15.7273Z"
      fill="#EF4444"
    />
  </Svg>
);

const AddButtonIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <Rect width="40" height="40" rx="6" fill="#1777CF" />
    <Path
      d="M25.1818 18.9091H21.0909V14.8182C21.0909 14.3665 20.7244 14 20.2727 14H19.7273C19.2756 14 18.9091 14.3665 18.9091 14.8182V18.9091H14.8182C14.3665 18.9091 14 19.2756 14 19.7273V20.2727C14 20.7244 14.3665 21.0909 14.8182 21.0909H18.9091V25.1818C18.9091 25.6335 19.2756 26 19.7273 26H20.2727C20.7244 26 21.0909 25.6335 21.0909 25.1818V21.0909H25.1818C25.6335 21.0909 26 20.7244 26 20.2727V19.7273C26 19.2756 25.6335 18.9091 25.1818 18.9091Z"
      fill="#FCFCFC"
    />
  </Svg>
);

const AVATAR_PLACEHOLDER = require('../../../assets/AvatarPlaceholder02.png');

type ContactImport = { data: ProfileFormData; personType: PersonType };

function normalizeHeaderValue(value: unknown): string {
  const raw = String(value ?? '').trim().toLowerCase();
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function digitsOnly(value: string): string {
  return (value || '').replace(/\D+/g, '');
}

function detectPersonTypeFromValue(value: string): PersonType | null {
  const v = normalizeHeaderValue(value);
  if (!v) return null;
  if (v.includes('jur') || v.includes('cnpj')) return 'juridica';
  if (v.includes('fis') || v.includes('cpf')) return 'fisica';
  return null;
}

function detectPersonTypeFromDocument(cpfCnpj: string): PersonType | null {
  const d = digitsOnly(cpfCnpj);
  if (d.length === 11) return 'fisica';
  if (d.length === 14) return 'juridica';
  return null;
}

type ColumnKey = keyof ProfileFormData | 'personType';

const HEADER_SYNONYMS: Record<ColumnKey, string[]> = {
  nome: ['nome', 'nome completo', 'nome/razao social', 'nome/razão social', 'razao social', 'razão social'],
  cpfCnpj: ['cpf', 'cnpj', 'cpf/cnpj', 'cpf cnpj', 'documento', 'cpf ou cnpj'],
  email: ['email', 'e-mail', 'mail'],
  whatsapp: ['whatsapp', 'telefone', 'celular', 'telefone whatsapp', 'fone', 'phone'],
  estado: ['estado', 'uf'],
  cep: ['cep', 'codigo postal', 'código postal'],
  cidade: ['cidade', 'municipio', 'município'],
  bairro: ['bairro'],
  endereco: ['endereco', 'endereço', 'logradouro', 'rua', 'avenida'],
  numero: ['numero', 'número', 'nº', 'no'],
  complemento: ['complemento', 'complemento endereco', 'complemento endereço'],
  keymanPhoto: ['foto', 'imagem'],
  personType: ['tipo', 'tipo de pessoa', 'pessoa', 'fisica/juridica', 'física/jurídica'],
  responsavelNome: [],
  responsavelCpf: [],
};

function matchColumnKey(headerCell: unknown): ColumnKey | null {
  const h = normalizeHeaderValue(headerCell);
  if (!h) return null;
  const keys = Object.keys(HEADER_SYNONYMS) as ColumnKey[];
  for (const key of keys) {
    for (const s of HEADER_SYNONYMS[key]) {
      const ns = normalizeHeaderValue(s);
      if (!ns) continue;
      if (h === ns) return key;
      if (h.includes(ns)) return key;
    }
  }
  return null;
}

function isEmptyRow(row: unknown[]): boolean {
  return (row || []).every((c) => String(c ?? '').trim() === '');
}

function createEmptyFormData(): ProfileFormData {
  return {
    nome: '',
    cpfCnpj: '',
    email: '',
    whatsapp: '',
    estado: '',
    cep: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numero: '',
    complemento: '',
    responsavelNome: '',
    responsavelCpf: '',
    keymanPhoto: undefined,
  };
}

function findHeaderRow(rows: unknown[][]): { headerRowIndex: number; columnIndexByKey: Partial<Record<ColumnKey, number>> } | null {
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (isEmptyRow(row)) continue;
    const map: Partial<Record<ColumnKey, number>> = {};
    for (let j = 0; j < row.length; j += 1) {
      const key = matchColumnKey(row[j]);
      if (key && map[key] == null) map[key] = j;
    }
    const scoreKeys: ColumnKey[] = ['nome', 'cpfCnpj', 'email', 'whatsapp', 'estado', 'cep', 'cidade', 'bairro', 'endereco', 'numero', 'complemento', 'personType'];
    const score = scoreKeys.reduce((acc, k) => acc + (map[k] != null ? 1 : 0), 0);
    if (score >= 3 && map.nome != null) return { headerRowIndex: i, columnIndexByKey: map };
  }
  return null;
}

function parseImportedContacts(rows: unknown[][]): ContactImport[] {
  const header = findHeaderRow(rows);
  if (!header) return [];

  const { headerRowIndex, columnIndexByKey } = header;
  const contacts: ContactImport[] = [];

  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (isEmptyRow(row)) continue;

    const data = createEmptyFormData();
    const get = (k: ColumnKey) => {
      const idx = columnIndexByKey[k];
      if (idx == null) return '';
      return String((row as any[])[idx] ?? '').trim();
    };

    data.nome = get('nome');
    data.cpfCnpj = get('cpfCnpj');
    data.email = get('email');
    data.whatsapp = get('whatsapp');
    data.estado = get('estado');
    data.cep = get('cep');
    data.cidade = get('cidade');
    data.bairro = get('bairro');
    data.endereco = get('endereco');
    data.numero = get('numero');
    data.complemento = get('complemento');

    const personTypeRaw = get('personType');
    const personType =
      detectPersonTypeFromValue(personTypeRaw) ??
      detectPersonTypeFromDocument(data.cpfCnpj) ??
      'fisica';

    const meaningful =
      Boolean(data.nome) ||
      Boolean(digitsOnly(data.cpfCnpj)) ||
      Boolean(data.email) ||
      Boolean(digitsOnly(data.whatsapp));
    if (!meaningful) continue;

    contacts.push({ data, personType });
  }

  return contacts;
}

const DownloadModelIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M17.4419 20H2.55814C1.87983 19.9995 1.22944 19.7298 0.749806 19.2502C0.270169 18.7706 0.000492779 18.1202 0 17.4419V14.6512C0 14.4661 0.0735048 14.2887 0.204344 14.1578C0.335183 14.027 0.51264 13.9535 0.697674 13.9535C0.882709 13.9535 1.06017 14.027 1.191 14.1578C1.32184 14.2887 1.39535 14.4661 1.39535 14.6512V17.4419C1.39584 17.7501 1.51851 18.0456 1.73647 18.2635C1.95442 18.4815 2.2499 18.6042 2.55814 18.6047H17.4419C17.7501 18.6042 18.0456 18.4815 18.2635 18.2635C18.4815 18.0456 18.6042 17.7501 18.6047 17.4419V14.6512C18.6047 14.4661 18.6782 14.2887 18.809 14.1578C18.9398 14.027 19.1173 13.9535 19.3023 13.9535C19.4874 13.9535 19.6648 14.027 19.7957 14.1578C19.9265 14.2887 20 14.4661 20 14.6512V17.4419C19.9995 18.1202 19.7298 18.7706 19.2502 19.2502C18.7706 19.7298 18.1202 19.9995 17.4419 20Z" fill="#1B883C"/>
    <Path d="M10 14.4186C9.81497 14.4186 9.63751 14.3451 9.50667 14.2143C9.37583 14.0834 9.30233 13.906 9.30233 13.7209V0.697674C9.30233 0.51264 9.37583 0.335183 9.50667 0.204344C9.63751 0.0735048 9.81497 0 10 0C10.185 0 10.3625 0.0735048 10.4933 0.204344C10.6242 0.335183 10.6977 0.51264 10.6977 0.697674V13.7209C10.6977 13.906 10.6242 14.0834 10.4933 14.2143C10.3625 14.3451 10.185 14.4186 10 14.4186Z" fill="#1B883C"/>
    <Path d="M10 14.4186C9.8368 14.4186 9.67878 14.3613 9.55349 14.2567L3.97209 9.60558C3.83501 9.48566 3.75026 9.31688 3.73595 9.13531C3.72164 8.95374 3.7789 8.77377 3.8955 8.63385C4.0121 8.49393 4.17879 8.40515 4.35997 8.38649C4.54115 8.36782 4.72244 8.42075 4.86512 8.53395L10 12.813L15.1349 8.53395C15.2776 8.42075 15.4589 8.36782 15.64 8.38649C15.8212 8.40515 15.9879 8.49393 16.1045 8.63385C16.2211 8.77377 16.2784 8.95374 16.264 9.13531C16.2497 9.31688 16.165 9.48566 16.0279 9.60558L10.4465 14.2567C10.3212 14.3613 10.1632 14.4186 10 14.4186Z" fill="#1B883C"/>
  </Svg>
);

const StepArrowButtonIcon: React.FC<{ direction: 'left' | 'right'; disabled?: boolean }> = ({
  direction,
  disabled,
}) => {
  const rectFillOpacity = disabled ? 0.4 : 1;
  const rectFill = '#1777CF';

  const transform =
    direction === 'right' ? 'matrix(-1 0 0 1 39.5 0)' : undefined;

  return (
    <Svg width="40" height="35" viewBox="0 0 40 35" fill="none">
      <Rect
        x={direction === 'right' ? -0.25 : 0.25}
        y={0.25}
        width={39.5}
        height={34.5}
        rx={3.75}
        transform={transform}
        fill={rectFill}
        fillOpacity={rectFillOpacity}
      />
      <Rect
        x={direction === 'right' ? -0.25 : 0.25}
        y={0.25}
        width={39.5}
        height={34.5}
        rx={3.75}
        transform={transform}
        stroke="#D8E0F0"
        strokeWidth={0.5}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d={
          direction === 'right'
            ? 'M16.2792 11.7762C15.8964 12.1345 15.9088 12.7042 16.3069 13.0488L21.5572 17.5L16.3069 21.9512C15.9088 22.2958 15.8964 22.8655 16.2792 23.2238C16.662 23.5821 17.295 23.5933 17.6931 23.2487L23.6931 18.1487C23.8892 17.9791 24 17.7448 24 17.5C24 17.2552 23.8892 17.0209 23.6931 16.8513L17.6931 11.7513C17.295 11.4067 16.662 11.4179 16.2792 11.7762Z'
            : 'M23.7208 11.7762C24.1036 12.1345 24.0912 12.7042 23.6931 13.0488L18.4428 17.5L23.6931 21.9512C24.0912 22.2958 24.1036 22.8655 23.7208 23.2238C23.338 23.5821 22.705 23.5933 22.3069 23.2487L16.3069 18.1487C16.1108 17.9791 16 17.7448 16 17.5C16 17.2552 16.1108 17.0209 16.3069 16.8513L22.3069 11.7513C22.705 11.4067 23.338 11.4179 23.7208 11.7762Z'
        }
        fill="#FCFCFC"
      />
    </Svg>
  );
};

// Ícone da câmera para foto
const CameraIcon = () => (
  <Svg width="25" height="24" viewBox="0 0 26 24" fill="none">
    <Rect x="0" y="0" width="26" height="24" rx="12" fill={COLORS.border} />
    <Rect x="0.1" y="0.1" width="25.8" height="23.8" rx="11.9" stroke={COLORS.border} strokeWidth="0.2" />
    <G transform="translate(-4 -4)">
      <Path
        d="M24.0455 11.0571H21.5255C21.4057 11.0571 21.2878 11.0292 21.1823 10.9759C21.0767 10.9226 20.9868 10.8456 20.9204 10.7517L20.1135 9.61063C19.9806 9.42279 19.8007 9.26878 19.5896 9.16226C19.3784 9.05574 19.1427 9 18.9033 9H16.0967C15.8573 9 15.6216 9.05574 15.4104 9.16226C15.1993 9.26878 15.0194 9.42279 14.8865 9.61063L14.0796 10.7517C14.0132 10.8456 13.9233 10.9226 13.8177 10.9759C13.7122 11.0292 13.5943 11.0571 13.4745 11.0571H13.1364V10.7143C13.1364 10.6234 13.0981 10.5361 13.0299 10.4718C12.9617 10.4076 12.8692 10.3714 12.7727 10.3714H11.6818C11.5854 10.3714 11.4929 10.4076 11.4247 10.4718C11.3565 10.5361 11.3182 10.6234 11.3182 10.7143V11.0571H10.9545C10.5688 11.0571 10.1988 11.2016 9.92603 11.4588C9.65325 11.716 9.5 12.0648 9.5 12.4286V19.6286C9.5 19.9923 9.65325 20.3411 9.92603 20.5983C10.1988 20.8555 10.5688 21 10.9545 21H24.0455C24.4312 21 24.8012 20.8555 25.074 20.5983C25.3468 20.3411 25.5 19.9923 25.5 19.6286V12.4286C25.5 12.0648 25.3468 11.716 25.074 11.4588C24.8012 11.2016 24.4312 11.0571 24.0455 11.0571ZM17.5 19.6286C16.6729 19.6286 15.8644 19.3973 15.1767 18.9641C14.489 18.5308 13.953 17.915 13.6365 17.1946C13.32 16.4741 13.2372 15.6813 13.3985 14.9165C13.5599 14.1517 13.9582 13.4491 14.543 12.8977C15.1278 12.3463 15.873 11.9708 16.6842 11.8186C17.4954 11.6665 18.3362 11.7446 19.1003 12.043C19.8644 12.3414 20.5176 12.8468 20.9771 13.4952C21.4366 14.1436 21.6818 14.9059 21.6818 15.6857C21.6818 16.7314 21.2412 17.7343 20.457 18.4737C19.6727 19.2132 18.6091 19.6286 17.5 19.6286Z"
        fill={COLORS.textPrimary}
      />
      <Path
        d="M17.5 13.1143C16.9606 13.1143 16.4333 13.2651 15.9848 13.5476C15.5363 13.8302 15.1867 14.2318 14.9803 14.7017C14.7739 15.1715 14.7199 15.6886 14.8251 16.1874C14.9304 16.6862 15.1901 17.1444 15.5715 17.504C15.9529 17.8636 16.4389 18.1085 16.9679 18.2077C17.497 18.307 18.0453 18.256 18.5437 18.0614C19.042 17.8668 19.468 17.5372 19.7676 17.1143C20.0673 16.6915 20.2273 16.1943 20.2273 15.6857C20.2273 15.0037 19.9399 14.3497 19.4285 13.8674C18.917 13.3852 18.2233 13.1143 17.5 13.1143ZM17.5 17.2286C17.0662 17.2281 16.6502 17.0654 16.3434 16.7762C16.0367 16.4869 15.8641 16.0948 15.8636 15.6857C15.8636 15.5948 15.9019 15.5076 15.9701 15.4433C16.0383 15.379 16.1308 15.3429 16.2273 15.3429C16.3237 15.3429 16.4162 15.379 16.4844 15.4433C16.5526 15.5076 16.5909 15.5948 16.5909 15.6857C16.5909 15.913 16.6867 16.1311 16.8572 16.2918C17.0277 16.4526 17.2589 16.5429 17.5 16.5429C17.5964 16.5429 17.6889 16.579 17.7571 16.6433C17.8253 16.7076 17.8636 16.7948 17.8636 16.8857C17.8636 16.9766 17.8253 17.0639 17.7571 17.1282C17.6889 17.1924 17.5964 17.2286 17.5 17.2286Z"
        fill={COLORS.textPrimary}
      />
    </G>
  </Svg>
);

// Ícone Radio selecionado
const RadioSelectedIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip0)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
        fill={COLORS.primary}
      />
      <Rect x="5" y="5" width="10" height="10" rx="5" fill={COLORS.primary} />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width="20" height="20" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

// Ícone Radio não selecionado
const RadioUnselectedIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip1)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
        fill="#6F7DA0"
        stroke={COLORS.white}
      />
    </G>
    <Defs>
      <ClipPath id="clip1">
        <Rect width="20" height="20" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export type PersonType = 'fisica' | 'juridica';
export type ScreenMode = 'criar' | 'editar';

export interface ProfileFormData {
  nome: string;
  cpfCnpj: string;
  email: string;
  whatsapp: string;
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  responsavelNome?: string;
  responsavelCpf?: string;
  keymanPhoto?: any;
}

type ModalMode = 'criar' | 'editar' | 'visualizar';

interface NewContactModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ModalMode;
  contactId?: number;
  contactData?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  onImportExcel?: () => void;
}

const InformationGroupContactsNewContact: React.FC<NewContactModalProps> = ({
  visible,
  onClose,
  mode,
  contactData,
  onImportExcel,
  onSave,
}) => {
  const [tabs, setTabs] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState(1);
  const [personTypeByTab, setPersonTypeByTab] = useState<Record<number, PersonType>>({ 1: 'fisica' });
  const [formDataByTab, setFormDataByTab] = useState<Record<number, ProfileFormData>>(() => {
    if (mode === 'criar') return { 1: createEmptyFormData() };
    return {
      1: {
        ...createEmptyFormData(),
        nome: contactData?.nome || 'Perola Marina Diniz',
        cpfCnpj: contactData?.cpfCnpj || '385.474.956-25',
        email: contactData?.email || 'PerolaDiniz@hotmail.com',
        whatsapp: contactData?.whatsapp || '17 99246-0025',
        estado: contactData?.estado || 'São Paulo',
        cep: contactData?.cep || '15200-000',
        cidade: contactData?.cidade || 'São José do Rio Preto',
        bairro: contactData?.bairro || 'Centro',
        endereco: contactData?.endereco || 'Piratininga',
        numero: contactData?.numero || '650',
        complemento: contactData?.complemento || 'Sala 207',
        responsavelNome: contactData?.responsavelNome || '',
        responsavelCpf: contactData?.responsavelCpf || '',
        keymanPhoto: contactData?.keymanPhoto,
      },
    };
  });

  const activePersonType = personTypeByTab[activeTab] ?? 'fisica';
  const formData = formDataByTab[activeTab] ?? createEmptyFormData();

  // ===== BLOCO: FOTO DO KEYMAN =====
  const getProfilePhotoSource = () => {
    if (formData.keymanPhoto) return formData.keymanPhoto;
    const mapped = KEYMAN_PHOTO_BY_NAME[(formData.nome || '').trim()];
    if (mapped) return mapped;
    return null;
  };

  const handleDownloadModel = async () => {
    try {
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

      const ws = XLSX.utils.aoa_to_sheet([headers]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contatos');
      const filename = 'Importar contatos.xlsx';

      if (Platform.OS === 'web') {
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

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
        return;
      }

      await Linking.openURL(uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o modelo da planilha.');
    }
  };

  const handleImportExcel = async () => {
    const applyWorkbook = (workbook: XLSX.WorkBook) => {
      const firstSheetName = workbook.SheetNames?.[0];
      if (!firstSheetName) {
        Alert.alert('Importação', 'A planilha selecionada não possui abas.');
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const rows = (XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][]) ?? [];
      const contacts = parseImportedContacts(rows);

      if (!contacts.length) {
        Alert.alert('Importação', 'Nenhum contato válido foi encontrado na planilha.');
        return;
      }

      const nextTabs = contacts.map((_, idx) => idx + 1);
      const nextFormByTab: Record<number, ProfileFormData> = {};
      const nextPersonByTab: Record<number, PersonType> = {};
      contacts.forEach((c, idx) => {
        const tab = idx + 1;
        nextFormByTab[tab] = c.data;
        nextPersonByTab[tab] = c.personType;
      });

      setTabs(nextTabs);
      setFormDataByTab(nextFormByTab);
      setPersonTypeByTab(nextPersonByTab);
      setActiveTab(nextTabs[0]);
      onImportExcel?.();
    };

    if (Platform.OS === 'web') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/octet-stream';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = async () => {
          try {
            const file = input.files?.[0];
            if (!file) return;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            applyWorkbook(workbook);
          } catch {
            Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
          } finally {
            document.body.removeChild(input);
          }
        };

        input.click();
      } catch {
        Alert.alert('Importação', 'Não foi possível abrir o seletor de arquivos.');
      }
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/octet-stream',
        ],
      });

      if ((result as any)?.canceled) return;
      const asset = (result as any)?.assets?.[0];
      if (!asset?.uri) return;

      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
      const workbook = XLSX.read(base64, { type: 'base64' });
      applyWorkbook(workbook);
    } catch {
      Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
    }
  };

  const onPickProfilePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setFormDataByTab((prev) => ({ ...prev, [activeTab]: { ...(prev[activeTab] ?? createEmptyFormData()), keymanPhoto: { uri: asset.uri } } }));
    } catch {
      return;
    }
  };

  const updateFormField = (field: keyof ProfileFormData, value: string) => {
    setFormDataByTab((prev) => ({ ...prev, [activeTab]: { ...(prev[activeTab] ?? createEmptyFormData()), [field]: value } }));
  };

  useEffect(() => {
    if (!visible) return;

    setTabs([1]);
    setActiveTab(1);
    setPersonTypeByTab({ 1: 'fisica' });

    if (mode === 'criar') {
      setFormDataByTab({ 1: createEmptyFormData() });
      return;
    }

    setFormDataByTab({
      1: {
        ...createEmptyFormData(),
        nome: contactData?.nome || 'Perola Marina Diniz',
        cpfCnpj: contactData?.cpfCnpj || '385.474.956-25',
        email: contactData?.email || 'PerolaDiniz@hotmail.com',
        whatsapp: contactData?.whatsapp || '17 99246-0025',
        estado: contactData?.estado || 'São Paulo',
        cep: contactData?.cep || '15200-000',
        cidade: contactData?.cidade || 'São José do Rio Preto',
        bairro: contactData?.bairro || 'Centro',
        endereco: contactData?.endereco || 'Piratininga',
        numero: contactData?.numero || '650',
        complemento: contactData?.complemento || 'Sala 207',
        responsavelNome: contactData?.responsavelNome || '',
        responsavelCpf: contactData?.responsavelCpf || '',
        keymanPhoto: contactData?.keymanPhoto,
      },
    });
  }, [visible, mode, contactData]);

  const activeTabIndex = useMemo(() => tabs.findIndex((t) => t === activeTab), [tabs, activeTab]);
  const canGoLeft = tabs.length > 1 && activeTabIndex > 0;
  const canGoRight = tabs.length > 1 && activeTabIndex >= 0 && activeTabIndex < tabs.length - 1;

  const handleAddTab = () => {
    const next = tabs.length + 1;
    setTabs((prev) => [...prev, next]);
    setFormDataByTab((prev) => ({ ...prev, [next]: createEmptyFormData() }));
    setPersonTypeByTab((prev) => ({ ...prev, [next]: 'fisica' }));
    setActiveTab(next);
  };

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  const renderRadio = (selected: boolean) => (
    <View style={[styles.radioOuter, selected ? styles.radioOuterSelected : null]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
  );

  const renderInputField = (
    label: string,
    field: keyof ProfileFormData,
    required: boolean = false,
    placeholder?: string
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>
          {label}
          {required && '*'}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formData[field] as any}
          onChangeText={(value) => updateFormField(field, value)}
          placeholder={placeholder ?? label}
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
    </View>
  );

  const titleLabel = useMemo(() => {
    if (mode === 'editar') return 'Editar contato';
    if (mode === 'visualizar') return 'Contato';
    return 'Criar contato';
  }, [mode]);

  if (!visible) return null;
  const profilePhotoSource = getProfilePhotoSource();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTopRow}>
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>{titleLabel}</Text>
                </View>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <CloseModalIcon />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.downloadModelContainer} activeOpacity={0.8} onPress={handleDownloadModel}>
                <DownloadModelIcon />
                <Text style={styles.downloadModelText}>Baixar modelo - Planilha do Excel</Text>
              </TouchableOpacity>

              <View style={styles.headerActionsRow}>
                <TouchableOpacity
                  style={[styles.importButton, styles.importButtonHeader]}
                  onPress={Platform.OS === 'web' ? undefined : handleImportExcel}
                  onPressIn={Platform.OS === 'web' ? handleImportExcel : undefined}
                  activeOpacity={0.8}
                >
                  <ImportExcelIcon />
                  <Text style={styles.importButtonText}>Importar planilha do Excel</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8}>
                  <TrashButtonIcon />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={handleAddTab}>
                  <AddButtonIcon />
                </TouchableOpacity>
              </View>

            <View style={styles.headerDivider} />

            <View style={styles.stepperRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (!canGoLeft) return;
                  setActiveTab(tabs[activeTabIndex - 1]);
                }}
                disabled={!canGoLeft}
              >
                <StepArrowButtonIcon direction="left" disabled={!canGoLeft} />
              </TouchableOpacity>

              <View style={styles.stepperCenter}>
                {tabs.map((step) => (
                  <TouchableOpacity
                    key={step}
                    activeOpacity={0.8}
                    onPress={() => setActiveTab(step)}
                  >
                    <View style={[styles.stepBox, step === activeTab ? styles.stepBoxActive : null]}>
                      <Text style={[styles.stepText, step === activeTab ? styles.stepTextActive : null]}>
                        {String(step).padStart(2, '0')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (!canGoRight) return;
                  setActiveTab(tabs[activeTabIndex + 1]);
                }}
                disabled={!canGoRight}
              >
                <StepArrowButtonIcon direction="right" disabled={!canGoRight} />
              </TouchableOpacity>
            </View>

            <View style={styles.headerDivider} />
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formContent}>
                <View style={styles.photoTypeSection}>
                  <View style={styles.photoContainer}>
                    {profilePhotoSource ? (
                      <Image source={profilePhotoSource} style={styles.profilePhoto} />
                    ) : (
                      <View style={styles.profilePhotoPlaceholder}>
                        <Image source={AVATAR_PLACEHOLDER} style={styles.avatarPlaceholderImage} resizeMode="contain" />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={onPickProfilePhoto}
                    activeOpacity={0.8}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <CameraIcon />
                  </TouchableOpacity>
                </View>

                <View style={styles.personTypeContainer}>
                  <TouchableOpacity style={styles.radioOption} onPress={() => setPersonTypeByTab((prev) => ({ ...prev, [activeTab]: 'fisica' }))}>
                    {renderRadio(activePersonType === 'fisica')}
                    <Text style={styles.radioLabel}>Fisica</Text>
                  </TouchableOpacity>

                  <View style={styles.radioOptionDivider} />

                  <TouchableOpacity style={styles.radioOption} onPress={() => setPersonTypeByTab((prev) => ({ ...prev, [activeTab]: 'juridica' }))}>
                    {renderRadio(activePersonType === 'juridica')}
                    <Text style={styles.radioLabel}>Jurídica</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Dados pessoais:</Text>

                {renderInputField(
                  activePersonType === 'juridica' ? 'Razão social' : 'Nome',
                  'nome',
                  true,
                  activePersonType === 'juridica' ? 'Digite a razão social' : 'Digite o nome completo'
                )}
                {renderInputField(
                  activePersonType === 'fisica' ? 'CPF' : 'CNPJ',
                  'cpfCnpj',
                  true,
                  activePersonType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'
                )}
                {activePersonType === 'juridica' ? (
                  <>
                    {renderInputField('Nome do Responsável', 'responsavelNome', false, 'Digite o nome do responsável')}
                    {renderInputField('CPF do Responsável', 'responsavelCpf', false, '000.000.000-00')}
                  </>
                ) : null}
                {renderInputField('Email', 'email', true, 'seuemail@aqui.com.br')}
                {renderInputField('WhatsApp', 'whatsapp', false, '(00) 90000-0000')}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Localização:</Text>

                {renderInputField('Estado', 'estado', false, 'Ex.: São Paulo')}
                {renderInputField('CEP', 'cep', false, '00000-000')}
                {renderInputField('Cidade', 'cidade', false, 'Ex.: São José do Rio Preto')}
                {renderInputField('Bairro', 'bairro', false, 'Ex.: Centro')}
                {renderInputField('Endereço', 'endereco', false, 'Ex.: Rua Piratininga')}
                {renderInputField('Número', 'numero', false, 'Ex.: 650')}
                {renderInputField('Complemento', 'complemento', false, 'Ex.: Sala 207')}
              </View>
            </View>
          </ScrollView>

            <View style={styles.footerContainer}>
              <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.footerCancelButton} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.footerCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerSaveButton} onPress={handleSave} activeOpacity={0.8}>
                  <Text style={styles.footerSaveText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
};

// ===== BLOCO: ESTILOS =====
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerContainer: {
    padding: 15,
    gap: 15,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    height: 24,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  downloadModelContainer: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    backgroundColor: '#DEFBE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  downloadModelText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1B883C',
  },
  importButtonHeader: {
    flex: 1,
  },
  headerDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  stepperRow: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stepperCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  stepBox: {
    width: 40,
    height: 35,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  stepBoxActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
  },
  stepTextActive: {
    color: COLORS.white,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    gap: 10,
    padding: 14,
  },
  importButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.primary,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContent: {
    paddingTop: 2,
    paddingBottom: 0,
    gap: 15,
  },
  titleSection: {
    gap: 10,
  },
  screenTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  titleDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 5,
  },
  photoTypeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 3,
    marginBottom: 10,
  },
  photoContainer: {
    position: 'relative',
    overflow: 'visible',
  },
  profilePhoto: {
    width: 65,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profilePhotoPlaceholder: {
    width: 65,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarPlaceholderImage: {
    width: 58,
    height: 78,
  },
  cameraButton: {
    position: 'absolute',
    top: 63,
    marginTop: 4,
    left: '50%',
    marginLeft: -12.5,
  },
  personTypeContainer: {
    backgroundColor: COLORS.white,
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOptionDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  radioLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6F7DA0',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  sectionContainer: {
    gap: 10,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#0F172A',
    paddingHorizontal: 5,
  },
  inputGroup: {
    height: 64,
    gap: 6,
  },
  labelContainer: {
    paddingHorizontal: 6,
  },
  inputLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.labelText,
  },
  inputContainer: {
    height: 36,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  footerCancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  footerCancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  footerSaveButton: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  footerSaveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});

export default InformationGroupContactsNewContact;
