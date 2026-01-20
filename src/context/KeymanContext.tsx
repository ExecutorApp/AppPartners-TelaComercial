import React, { createContext, useContext, useState, useMemo } from 'react';

// Tipo do Keyman
export type Keyman = {
  id: number;                              // Identificador unico
  name: string;                            // Nome do keyman
  photo: string | null;                    // URI da foto
  contacts: number;                        // Quantidade de contatos
  conversions: number;                     // Quantidade de conversoes
  rank: number;                            // Ranking
  cpfCnpj?: string;                        // CPF ou CNPJ
  email?: string;                          // Email
  whatsapp?: string;                       // Whatsapp
  estado?: string;                         // Estado
  cep?: string;                            // CEP
  cidade?: string;                         // Cidade
  bairro?: string;                         // Bairro
  endereco?: string;                       // Endereco
  numero?: string;                         // Numero
  complemento?: string;                    // Complemento
  personType?: 'fisica' | 'juridica';      // Tipo de pessoa
  nomeResponsavel?: string;                // Nome do responsavel (juridica)
  cpfResponsavel?: string;                 // CPF do responsavel (juridica)
};

// Interface do contexto
interface KeymanContextValue {
  keymans: Keyman[];                                      // Lista de keymans
  addKeyman: (keyman: Omit<Keyman, 'id'>) => void;        // Adiciona keyman
  updateKeyman: (id: number, data: Partial<Keyman>) => void; // Atualiza keyman
  deleteKeyman: (id: number) => void;                     // Remove keyman
}

// Criacao do contexto
const KeymanContext = createContext<KeymanContextValue | undefined>(undefined);

// Provider do contexto
export const KeymanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado da lista de keymans
  const [keymans, setKeymans] = useState<Keyman[]>([]);

  // Funcao para adicionar keyman
  const addKeyman = (keymanData: Omit<Keyman, 'id'>) => {
    const newId = keymans.length > 0
      ? Math.max(...keymans.map(k => k.id)) + 1
      : 1;
    const newKeyman: Keyman = { ...keymanData, id: newId };
    setKeymans(prev => [...prev, newKeyman]);
  };

  // Funcao para atualizar keyman
  const updateKeyman = (id: number, data: Partial<Keyman>) => {
    setKeymans(prev => prev.map(k => k.id === id ? { ...k, ...data } : k));
  };

  // Funcao para remover keyman
  const deleteKeyman = (id: number) => {
    setKeymans(prev => prev.filter(k => k.id !== id));
  };

  // Valor do contexto memoizado
  const value = useMemo(() => ({
    keymans,
    addKeyman,
    updateKeyman,
    deleteKeyman,
  }), [keymans]);

  // Renderiza provider com children
  return (
    <KeymanContext.Provider value={value}>
      {children}
    </KeymanContext.Provider>
  );
};

// Hook para usar o contexto
export const useKeyman = () => {
  const ctx = useContext(KeymanContext);
  if (!ctx) throw new Error('useKeyman must be used within KeymanProvider');
  return ctx;
};
