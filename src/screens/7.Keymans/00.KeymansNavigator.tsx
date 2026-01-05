import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas do módulo Keymans
import KeymansHomeScreen from './01.01.KeymansHomeScreen';
import KeymansOptionsModal from './01.02.KeymansHomeScreen-Modal-Options';
import InformationGroupProfile from './02.01.InformationGroup-Profile';
import InformationGroupContacts from './02.02.InformationGroup-Contacts';
import InformationGroupContactsSortBy from './02.02.InformationGroup-Contacts-SortBy';
import InformationGroupContactsNewContact from './02.02.InformationGroup-Contacts-NewContact';
import InformationGroupRank from './02.03.InformationGroup-Rank';

// Tipos de parâmetros das rotas
export type KeymansStackParamList = {
  KeymansHome: undefined;
  KeymansOptionsModal: {
    keymanId?: string;
    keymanName?: string;
    contactsCount?: number;
    rankPosition?: number;
  };
  InformationGroupProfile: {
    mode: 'criar' | 'editar';
    keymanName?: string;
    keymanId?: number;
  };
  InformationGroupContacts: {
    keymanId?: string;
    keymanName?: string;
  };
  InformationGroupContactsSortBy: undefined;
  InformationGroupContactsNewContact: {
    mode: 'criar' | 'editar' | 'visualizar';
    contactId?: string;
  };
  InformationGroupRank: {
    keymanId?: string;
    keymanName?: string;
  };
};

const Stack = createNativeStackNavigator<KeymansStackParamList>();

const KeymansNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="KeymansHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Tela Principal - Lista de Keymans */}
      <Stack.Screen 
        name="KeymansHome" 
        component={KeymansHomeScreen}
      />

      {/* Modal de Opções do Card */}
      <Stack.Screen 
        name="KeymansOptionsModal" 
        component={KeymansOptionsModal}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />

      {/* Tela de Perfil do Keyman */}
      <Stack.Screen 
        name="InformationGroupProfile" 
        component={InformationGroupProfile}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Tela de Contatos do Keyman */}
      <Stack.Screen 
        name="InformationGroupContacts" 
        component={InformationGroupContacts}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Modal de Ordenação de Contatos */}
      <Stack.Screen 
        name="InformationGroupContactsSortBy" 
        component={InformationGroupContactsSortBy}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />

      {/* Modal de Novo/Editar Contato */}
      <Stack.Screen 
        name="InformationGroupContactsNewContact" 
        component={InformationGroupContactsNewContact}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Tela de Rank do Keyman */}
      <Stack.Screen 
        name="InformationGroupRank" 
        component={InformationGroupRank}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default KeymansNavigator;
