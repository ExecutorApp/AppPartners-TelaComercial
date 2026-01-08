import { Platform } from 'react-native';

export const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  labelText: '#64748B',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

export const BRAZIL_STATES: string[] = [
  'AC - Acre',
  'AL - Alagoas',
  'AP - Amapá',
  'AM - Amazonas',
  'BA - Bahia',
  'CE - Ceará',
  'DF - Distrito Federal',
  'ES - Espírito Santo',
  'GO - Goiás',
  'MA - Maranhão',
  'MT - Mato Grosso',
  'MS - Mato Grosso do Sul',
  'MG - Minas Gerais',
  'PA - Pará',
  'PB - Paraíba',
  'PR - Paraná',
  'PE - Pernambuco',
  'PI - Piauí',
  'RJ - Rio de Janeiro',
  'RN - Rio Grande do Norte',
  'RS - Rio Grande do Sul',
  'RO - Rondônia',
  'RR - Roraima',
  'SC - Santa Catarina',
  'SP - São Paulo',
  'SE - Sergipe',
  'TO - Tocantins',
];

export const UF_NAME_MAP: Record<string, string> = BRAZIL_STATES.reduce((acc, label) => {
  const [uf] = label.split(' - ');
  acc[uf] = label;
  return acc;
}, {} as Record<string, string>);

export type PersonType = 'fisica' | 'juridica';

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

export type ColumnKey = keyof ProfileFormData | 'personType';

export type ContactImport = { data: ProfileFormData; personType: PersonType };

export function normalizeHeaderValue(value: unknown): string {
  const raw = String(value ?? '').trim().toLowerCase();
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function digitsOnly(value: string): string {
  return (value || '').replace(/\D+/g, '');
}

export function detectPersonTypeFromValue(value: string): PersonType | null {
  const v = normalizeHeaderValue(value);
  if (!v) return null;
  if (v === 'pf' || v.includes(' pf ') || v.endsWith(' pf') || v.startsWith('pf ')) return 'fisica';
  if (v === 'pj' || v.includes(' pj ') || v.endsWith(' pj') || v.startsWith('pj ')) return 'juridica';
  if (v.includes('jur') || v.includes('cnpj')) return 'juridica';
  if (v.includes('fis') || v.includes('cpf')) return 'fisica';
  return null;
}

export function detectPersonTypeFromDocument(cpfCnpj: string): PersonType | null {
  const d = digitsOnly(cpfCnpj);
  if (d.length === 11) return 'fisica';
  if (d.length === 14) return 'juridica';
  return null;
}

export const HEADER_SYNONYMS: Record<ColumnKey, string[]> = {
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

export function matchColumnKey(headerCell: unknown): ColumnKey | null {
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

export function isEmptyRow(row: unknown[]): boolean {
  return (row || []).every((c) => String(c ?? '').trim() === '');
}

export function createEmptyFormData(): ProfileFormData {
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

export function createFormDataFromContactData(contactData?: Partial<ProfileFormData>): ProfileFormData {
  const base = createEmptyFormData();
  if (!contactData) return base;
  return { ...base, ...contactData };
}

export function findHeaderRow(rows: unknown[][]): { headerRowIndex: number; columnIndexByKey: Partial<Record<ColumnKey, number>> } | null {
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

export function parseImportedContacts(rows: unknown[][]): ContactImport[] {
  const contacts: ContactImport[] = [];

  const getCell = (row: unknown[], index: number): string => {
    return String((row as any[])?.[index] ?? '').trim();
  };

  const getSafePhotoSourceFromCell = (raw: string) => {
    const uri = String(raw ?? '').trim();
    if (!uri) return undefined;

    const isHttp = /^https?:\/\//i.test(uri);
    const isDataImage = /^data:image\//i.test(uri);
    const isBlob = /^blob:/i.test(uri);
    const isFile = /^file:\/\//i.test(uri);

    if (Platform.OS === 'web') {
      if (isHttp || isDataImage || isBlob) return { uri };
      return undefined;
    }

    if (isHttp || isDataImage || isFile) return { uri };
    return undefined;
  };

  const COL = {
    tipoCadastro: 3,
    nomeOrRazao: 5,
    cpfOrCnpj: 6,
    responsavelNome: 8,
    responsavelCpf: 9,
    email: 11,
    whatsapp: 12,
    estado: 14,
    cep: 15,
    cidade: 16,
    bairro: 17,
    endereco: 18,
    numero: 19,
    complemento: 20,
    foto: 22,
  } as const;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (isEmptyRow(row)) continue;

    const data = createEmptyFormData();

    const personTypeRaw = getCell(row, COL.tipoCadastro);
    const docRaw = getCell(row, COL.cpfOrCnpj);
    const personTypeRawNorm = normalizeHeaderValue(personTypeRaw);
    const isTypeLabel = personTypeRawNorm.includes('fis') && personTypeRawNorm.includes('jur');
    const personType =
      isTypeLabel
        ? null
        : detectPersonTypeFromValue(personTypeRaw) ??
          (String(personTypeRaw ?? '').trim() ? null : detectPersonTypeFromDocument(docRaw));
    if (!personType) continue;

    data.nome = getCell(row, COL.nomeOrRazao);
    data.cpfCnpj = docRaw;
    data.email = getCell(row, COL.email);
    data.whatsapp = getCell(row, COL.whatsapp);
    data.estado = getCell(row, COL.estado);
    data.cep = getCell(row, COL.cep);
    data.cidade = getCell(row, COL.cidade);
    data.bairro = getCell(row, COL.bairro);
    data.endereco = getCell(row, COL.endereco);
    data.numero = getCell(row, COL.numero);
    data.complemento = getCell(row, COL.complemento);

    if (personType === 'juridica') {
      data.responsavelNome = getCell(row, COL.responsavelNome);
      data.responsavelCpf = getCell(row, COL.responsavelCpf);
    }

    const photo = getCell(row, COL.foto);
    const safePhotoSource = getSafePhotoSourceFromCell(photo);
    if (safePhotoSource) data.keymanPhoto = safePhotoSource;

    const meaningful =
      Boolean(digitsOnly(data.cpfCnpj)) ||
      Boolean(data.email) ||
      Boolean(digitsOnly(data.whatsapp));
    if (!meaningful) continue;

    contacts.push({ data, personType });
  }

  if (contacts.length) return contacts;

  const header = findHeaderRow(rows);
  if (!header) return [];

  const { headerRowIndex, columnIndexByKey } = header;
  const headerContacts: ContactImport[] = [];

  const get = (row: unknown[], k: ColumnKey) => {
    const idx = columnIndexByKey[k];
    if (idx == null) return '';
    return String((row as any[])?.[idx] ?? '').trim();
  };

  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (isEmptyRow(row)) continue;

    const data = createEmptyFormData();
    data.nome = get(row, 'nome');
    data.cpfCnpj = get(row, 'cpfCnpj');
    data.email = get(row, 'email');
    data.whatsapp = get(row, 'whatsapp');
    data.estado = get(row, 'estado');
    data.cep = get(row, 'cep');
    data.cidade = get(row, 'cidade');
    data.bairro = get(row, 'bairro');
    data.endereco = get(row, 'endereco');
    data.numero = get(row, 'numero');
    data.complemento = get(row, 'complemento');

    const personTypeRaw = get(row, 'personType');
    const personType =
      detectPersonTypeFromValue(personTypeRaw) ??
      detectPersonTypeFromDocument(data.cpfCnpj) ??
      'fisica';

    const photo = get(row, 'keymanPhoto');
    const safePhotoSource = getSafePhotoSourceFromCell(photo);
    if (safePhotoSource) data.keymanPhoto = safePhotoSource;

    const meaningful =
      Boolean(digitsOnly(data.cpfCnpj)) ||
      Boolean(data.email) ||
      Boolean(digitsOnly(data.whatsapp));
    if (!meaningful) continue;

    headerContacts.push({ data, personType });
  }

  return headerContacts;
}
