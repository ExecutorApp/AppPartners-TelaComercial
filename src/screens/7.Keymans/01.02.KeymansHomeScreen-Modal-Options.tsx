import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Svg, Path, Rect, G, ClipPath, Defs } from 'react-native-svg';

// Cores do tema
const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
  danger: '#E53935',
};

// Ícone Editar Perfil
const EditIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.83873 0.581039L4.16126 6.25851C4.03725 6.38252 3.96758 6.55072 3.96758 6.72609V9.37115C3.96758 9.73636 4.26364 10.0324 4.62885 10.0324H7.2739C7.44928 10.0324 7.61748 9.96275 7.74149 9.83873L13.419 4.16126C14.1937 3.38654 14.1937 2.13048 13.419 1.35576L12.6442 0.581039C11.8695 -0.19368 10.6135 -0.19368 9.83873 0.581039ZM12.4838 2.29093L12.5388 2.35322C12.7405 2.61263 12.7222 2.98772 12.4838 3.2261L6.99882 8.70989H5.29011V6.99986L10.7739 1.51621C11.0321 1.25797 11.4508 1.25797 11.7091 1.51621L12.4838 2.29093Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M6.63302 1.43598C6.63302 1.07078 6.33696 0.774719 5.97175 0.774719H3.30632L3.1629 0.777774C1.4034 0.852868 0 2.30306 0 4.08104V10.6937L0.00305472 10.8371C0.0781494 12.5966 1.52834 14 3.30632 14H9.91896L10.0624 13.9969C11.8219 13.9218 13.2253 12.4717 13.2253 10.6937V7.44137L13.2208 7.36426C13.1826 7.03539 12.9031 6.78011 12.564 6.78011C12.1988 6.78011 11.9028 7.07617 11.9028 7.44137V10.6937L11.8994 10.8102C11.839 11.8516 10.9754 12.6775 9.91896 12.6775H3.30632L3.18976 12.6741C2.14839 12.6138 1.32253 11.7502 1.32253 10.6937V4.08104L1.3259 3.96448C1.38623 2.92311 2.24983 2.09725 3.30632 2.09725H5.97175L6.04887 2.0928C6.37774 2.0546 6.63302 1.7751 6.63302 1.43598Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

// Ícone Contatos
const ContactsIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.495432 15.2497C0.429108 15.2464 0.366629 15.2176 0.320938 15.1694C0.275248 15.1212 0.249848 15.0573 0.250001 14.9909C0.249954 14.1758 0.41047 13.3688 0.722379 12.6158C1.03429 11.8628 1.49148 11.1786 2.06785 10.6023C2.64412 10.026 3.32829 9.56877 4.08129 9.25686C4.83428 8.94495 5.64134 8.78444 6.45638 8.78448H9.0431C12.4711 8.78448 15.25 11.5634 15.25 14.9914C15.25 15.2353 14.9914 15.25 14.9914 15.25H0.508621L0.495432 15.2497ZM14.7268 14.7328H0.77319C0.839616 13.2701 1.46739 11.8894 2.52592 10.8778C3.58445 9.86626 4.99223 9.30175 6.45638 9.30172H9.0431C12.0987 9.30172 14.5918 11.7105 14.7268 14.7328ZM7.75 0.25C5.5375 0.25 3.74138 2.04612 3.74138 4.25862C3.74138 6.47112 5.5375 8.26724 7.75 8.26724C9.9625 8.26724 11.7586 6.47112 11.7586 4.25862C11.7586 2.04612 9.9625 0.25 7.75 0.25ZM7.75 0.767241C9.67698 0.767241 11.2414 2.33164 11.2414 4.25862C11.2414 6.1856 9.67698 7.75 7.75 7.75C5.82302 7.75 4.25862 6.1856 4.25862 4.25862C4.25862 2.33164 5.82302 0.767241 7.75 0.767241Z"
      fill={COLORS.textPrimary}
      stroke={COLORS.textPrimary}
      strokeWidth="0.5"
    />
  </Svg>
);

// Ícone Rank
const RankIcon = () => (
  <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <Path
      d="M7.50015 8.91965C5.1572 8.92795 3.19808 7.48863 2.99549 5.61021L2.50633 0.621433C2.47208 0.307016 2.76103 0.0297632 3.15174 0.00219905C3.17247 0.000723193 3.19328 -1.05108e-05 3.21409 1.13743e-07H11.7859C12.1785 0.000123998 12.4965 0.256285 12.4964 0.572127C12.4964 0.588573 12.4955 0.605019 12.4937 0.621402L12.0048 5.60761C11.8037 7.48702 9.84417 8.92773 7.50015 8.91965ZM3.21409 0.428577C3.1894 0.42862 3.165 0.432791 3.14242 0.440826C3.11984 0.448861 3.09959 0.460584 3.08294 0.475252C3.06629 0.48992 3.05361 0.507212 3.0457 0.526032C3.0378 0.544852 3.03484 0.564789 3.03702 0.584578L3.52617 5.57401C3.72892 7.34016 5.67245 8.63961 7.86711 8.47645C9.78225 8.33408 11.2987 7.11271 11.4741 5.57144L11.963 0.584578C11.9653 0.564773 11.9624 0.544806 11.9545 0.525955C11.9466 0.507104 11.9339 0.489782 11.9173 0.475099C11.9006 0.460417 11.8803 0.448695 11.8577 0.440684C11.8351 0.432673 11.8106 0.42855 11.7859 0.428577H3.21409ZM12.5675 15H2.4488V13.3648C2.45041 12.2565 3.56643 11.3585 4.94357 11.3572H10.0727C11.4498 11.3585 12.5658 12.2566 12.5674 13.3648L12.5675 15ZM2.98137 14.5715H12.0349V13.3648C12.0336 12.4932 11.1558 11.7868 10.0727 11.7857H4.94357C3.86042 11.7868 2.98267 12.4931 2.98133 13.3648L2.98137 14.5715Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M9.95794 11.7857H5.04236V11.1577C5.04775 10.6705 5.54291 10.279 6.14833 10.2833C6.17227 10.2835 6.19621 10.2843 6.22011 10.2857H8.77988C9.38365 10.2494 9.90971 10.6138 9.9549 11.0997C9.9567 11.119 9.9577 11.1383 9.9579 11.1577L9.95794 11.7857ZM5.57493 11.3572H9.42537V11.1576C9.4144 10.9022 9.14812 10.7022 8.83068 10.7111C8.81371 10.7115 8.79678 10.7126 8.77992 10.7143H6.22015C5.90487 10.683 5.6178 10.8633 5.57893 11.117C5.57685 11.1305 5.57555 11.1441 5.57497 11.1576L5.57493 11.3572Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M8.30697 8.58278H8.83954V10.5004H8.30697V8.58278ZM6.17673 8.5873H6.7093V10.5004H6.17673V8.5873ZM2.71508 13.2857H12.3012V13.7143H2.71508V13.2857ZM13.64 5.36059H11.7846V4.93201H13.1384L13.3211 2.44628H12.0687V2.01773H13.8861L13.64 5.36059Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M13.6539 6.25713H11.6509V5.82856H13.6539C13.9546 5.82862 14.2032 5.64004 14.2208 5.39849L14.466 2.03569C14.4871 1.78467 14.2512 1.56744 13.9393 1.5505C13.9258 1.54976 13.9123 1.54942 13.8988 1.54948H12.1549V1.12093H13.8988C14.0493 1.12095 14.1982 1.14566 14.3364 1.19356C14.4747 1.24146 14.5993 1.31154 14.7027 1.39952C14.8059 1.48741 14.8853 1.59153 14.9361 1.70534C14.9868 1.81915 15.0077 1.94018 14.9975 2.06081L14.7525 5.42253C14.719 5.89103 14.2371 6.25713 13.6539 6.25713ZM3.21544 5.36059H1.35999L1.11395 2.01773H2.93157V2.44628H1.67896L1.86193 4.93201H3.21544V5.36059Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M3.3491 6.25713H1.34641C0.763308 6.25726 0.281311 5.89137 0.247482 5.42293L0.00248039 2.06056C-0.00764769 1.94014 0.0133127 1.81933 0.0640422 1.70575C0.114772 1.59216 0.194172 1.48825 0.297244 1.40057C0.400641 1.31257 0.525267 1.24247 0.663493 1.19457C0.80172 1.14667 0.950639 1.12197 1.10114 1.12199H2.84501V1.55056H1.10114C0.788632 1.54945 0.534163 1.7524 0.532778 2.00389C0.532701 2.01442 0.533124 2.02498 0.533971 2.03551L0.779203 5.39979C0.797638 5.64093 1.04618 5.8288 1.34637 5.82859H3.34906L3.3491 6.25713Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

// Ícone Excluir
const DeleteIcon = () => (
  <Svg width="13" height="14" viewBox="0 0 13 14" fill="none">
    <Path
      d="M5.2 5.72727C5.53334 5.72727 5.80808 5.97293 5.84563 6.28942L5.85 6.36364V10.1818C5.85 10.5333 5.55899 10.8182 5.2 10.8182C4.86666 10.8182 4.59192 10.5725 4.55437 10.256L4.55 10.1818V6.36364C4.55 6.01218 4.84101 5.72727 5.2 5.72727Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M8.44563 6.28942C8.40808 5.97293 8.13334 5.72727 7.8 5.72727C7.44101 5.72727 7.15 6.01218 7.15 6.36364V10.1818L7.15437 10.256C7.19192 10.5725 7.46666 10.8182 7.8 10.8182C8.15899 10.8182 8.45 10.5333 8.45 10.1818V6.36364L8.44563 6.28942Z"
      fill={COLORS.textPrimary}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.8 0C8.83849 0 9.68738 0.794767 9.74669 1.79692L9.75 1.90909V2.54545H12.35C12.709 2.54545 13 2.83036 13 3.18182C13 3.50817 12.7491 3.77714 12.4258 3.8139L12.35 3.81818H11.7V12.0909C11.7 13.1076 10.8882 13.9387 9.86458 13.9968L9.75 14H3.25C2.21151 14 1.36262 13.2052 1.30331 12.2031L1.3 12.0909V3.81818H0.65C0.291015 3.81818 0 3.53327 0 3.18182C0 2.85547 0.250926 2.5865 0.574196 2.54974L0.65 2.54545H3.25V1.90909C3.25 0.892385 4.0618 0.0613067 5.08542 0.0032408L5.2 0H7.8ZM2.6 3.81818V12.0909C2.6 12.4173 2.85093 12.6862 3.1742 12.723L3.25 12.7273H9.75C10.0833 12.7273 10.3581 12.4816 10.3956 12.1651L10.4 12.0909V3.81818H2.6ZM8.45 2.54545H4.55V1.90909L4.55437 1.83488C4.59192 1.51839 4.86666 1.27273 5.2 1.27273H7.8L7.8758 1.27701C8.19907 1.31377 8.45 1.58274 8.45 1.90909V2.54545Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

interface KeymanOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  keymanId: number;
  keymanName: string;
  contactsCount: number;
  rankPosition: number;
  onEditProfile: () => void;
  onViewContacts: () => void;
  onViewRank: () => void;
  onDelete: () => void;
  anchorPosition?: { x: number; y: number };
}

const KeymanOptionsModal: React.FC<KeymanOptionsModalProps> = ({
  visible,
  onClose,
  keymanId,
  keymanName,
  contactsCount,
  rankPosition,
  onEditProfile,
  onViewContacts,
  onViewRank,
  onDelete,
  anchorPosition,
}) => {
  const handleEditProfile = () => {
    onClose();
    onEditProfile();
  };

  const handleViewContacts = () => {
    onClose();
    onViewContacts();
  };

  const handleViewRank = () => {
    onClose();
    onViewRank();
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.modalContainer,
            anchorPosition && {
              position: 'absolute',
              top: anchorPosition.y,
              right: 16,
            },
          ]}
        >
          <View style={styles.optionsContainer}>
            {/* Editar Perfil */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <EditIcon />
              <Text style={styles.optionText}>Editar Perfil</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Contatos */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleViewContacts}
              activeOpacity={0.7}
            >
              <ContactsIcon />
              <Text style={styles.optionText}>
                Contatos ({contactsCount.toString().padStart(2, '0')})
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Rank */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleViewRank}
              activeOpacity={0.7}
            >
              <RankIcon />
              <Text style={styles.optionText}>
                Rank ({rankPosition.toString().padStart(2, '0')})
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Excluir */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <DeleteIcon />
              <Text style={styles.optionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    position: 'absolute',
    top: 150,
    right: 16,
    width: 224,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#676E76',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionsContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 20,
  },
  optionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 4.5,
  },
});

export default KeymanOptionsModal;
