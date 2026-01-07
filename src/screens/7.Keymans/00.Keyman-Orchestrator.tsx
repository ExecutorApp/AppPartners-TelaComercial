import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';

// ===== BLOCO: ORQUESTRADOR E TIPOS =====
import KeymansHomeScreen from './01.01.KeymansHomeScreen';
import InformationGroup from './02.00.InformationGroup';

// Tipos do stack do módulo Keymans
export type KeymansStackParamList = {
  KeymansHome: undefined;
  InformationGroupProfile: {
    mode: 'criar' | 'editar';
    keymanName?: string;
    keymanId?: number;
  };
  InformationGroupContacts: {
    keymanId?: string;
    keymanName?: string;
  };
  InformationGroupRank: {
    keymanId?: string;
    keymanName?: string;
  };
};

// Instância do Stack Navigator
const Stack = createStackNavigator<KeymansStackParamList>();

// Tipagem dos wrappers de tela do orquestrador
type InformationGroupProfileScreenProps = StackScreenProps<
  KeymansStackParamList,
  'InformationGroupProfile'
>;
type InformationGroupContactsScreenProps = StackScreenProps<
  KeymansStackParamList,
  'InformationGroupContacts'
>;
type InformationGroupRankScreenProps = StackScreenProps<
  KeymansStackParamList,
  'InformationGroupRank'
>;

// Wrapper: Perfil (conteúdo-only) em cascata de props
const InformationGroupProfileScreen: React.FC<InformationGroupProfileScreenProps> = ({
  navigation,
  route,
}) => (
  <InformationGroup
    mode={route.params.mode}
    keymanName={route.params.keymanName}
    keymanId={route.params.keymanId}
    initialTab="perfil"
    onClose={() => navigation.goBack()}
  />
);

// Wrapper: Contatos (conteúdo-only) em cascata de props
const InformationGroupContactsScreen: React.FC<InformationGroupContactsScreenProps> = ({
  navigation,
  route,
}) => (
  <InformationGroup
    mode="editar"
    keymanName={route.params.keymanName}
    keymanId={route.params.keymanId ? Number(route.params.keymanId) : undefined}
    initialTab="contatos"
    onClose={() => navigation.goBack()}
  />
);

// Wrapper: Rank (conteúdo-only) em cascata de props
const InformationGroupRankScreen: React.FC<InformationGroupRankScreenProps> = ({
  navigation,
  route,
}) => (
  <InformationGroup
    mode="editar"
    keymanName={route.params.keymanName}
    keymanId={route.params.keymanId ? Number(route.params.keymanId) : undefined}
    initialTab="rank"
    onClose={() => navigation.goBack()}
  />
);

// Container: Orquestrador com rotas e opções de apresentação
const KeymanOrchestrator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="KeymansHome"
      screenOptions={
        {
          headerShown: false,
          animation: 'slide_from_right',
        } as any
      }
    >
      <Stack.Screen 
        name="KeymansHome" 
        component={KeymansHomeScreen}
      />
      <Stack.Screen 
        name="InformationGroupProfile" 
        component={InformationGroupProfileScreen}
        options={
          {
            presentation: 'modal',
            animation: 'slide_from_bottom',
          } as any
        }
      />
      <Stack.Screen 
        name="InformationGroupContacts" 
        component={InformationGroupContactsScreen}
        options={
          {
            presentation: 'modal',
            animation: 'slide_from_bottom',
          } as any
        }
      />
      <Stack.Screen 
        name="InformationGroupRank" 
        component={InformationGroupRankScreen}
        options={
          {
            presentation: 'modal',
            animation: 'slide_from_bottom',
          } as any
        }
      />
    </Stack.Navigator>
  );
};

export default KeymanOrchestrator;
