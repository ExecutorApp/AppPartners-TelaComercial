import React from 'react';
import type { ProfileFormData } from './02.02.InformationGroup-Contacts-NewContact03';
import InformationGroupContactsNewContact from './02.02.InformationGroup-Contacts-NewContact01';
 
interface ViewContactProps {
  visible: boolean;
  onClose: () => void;
  contactData?: Partial<ProfileFormData>;
}
 
const InformationGroupContactsView: React.FC<ViewContactProps> = ({
  visible,
  onClose,
  contactData,
}) => {
  return (
    <InformationGroupContactsNewContact
      visible={visible}
      onClose={onClose}
      mode="visualizar"
      contactData={contactData}
    />
  );
};
 
export default InformationGroupContactsView;
