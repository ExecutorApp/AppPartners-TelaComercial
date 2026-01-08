import React from 'react';
import type { ProfileFormData } from './02.02.InformationGroup-Contacts-NewContact03';
import InformationGroupContactsNewContact from './02.02.InformationGroup-Contacts-NewContact01';
 
interface EditContactProps {
  visible: boolean;
  onClose: () => void;
  contactData?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
}
 
const InformationGroupContactsEdit: React.FC<EditContactProps> = ({
  visible,
  onClose,
  contactData,
  onSave,
}) => {
  return (
    <InformationGroupContactsNewContact
      visible={visible}
      onClose={onClose}
      mode="editar"
      contactData={contactData}
      onSave={onSave}
    />
  );
};
 
export default InformationGroupContactsEdit;
