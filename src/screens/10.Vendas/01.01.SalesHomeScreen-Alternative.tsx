import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

type AlternativeScreenItem = {
  id: string;
  date: string;
  client?: string | null;
  amount?: string | null;
  status?: string | null;
};

type AlternativeScreenProps = {
  items: AlternativeScreenItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onOpenMenu?: (id: string) => void;
};

const BLUE_ICON_XML = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5357 7.46434C13.7915 7.46434 14.0479 7.36668 14.2427 7.17137L17.0713 4.34273C17.462 3.95258 17.462 3.3193 17.0713 2.92867C16.6807 2.53805 16.0469 2.53805 15.6573 2.92867L12.8286 5.7573C12.438 6.14746 12.438 6.78121 12.8286 7.17137C13.0234 7.36672 13.2798 7.46434 13.5357 7.46434ZM19 9H15C14.4477 9 14 9.44777 14 10C14 10.5523 14.4477 11 15 11H19C19.5523 11 20 10.5523 20 10C20 9.44777 19.5523 9 19 9ZM12.8286 14.2427L15.6573 17.0713C15.8521 17.2666 16.1084 17.3643 16.3643 17.3643C16.6202 17.3643 16.876 17.2666 17.0713 17.0713C17.462 16.6807 17.462 16.0474 17.0713 15.6573L14.2427 12.8286C13.8525 12.438 13.2188 12.438 12.8286 12.8286C12.438 13.2188 12.438 13.8525 12.8286 14.2427ZM9 19C9 19.5523 9.44777 20 10 20C10.5523 20 11 19.5523 11 19V15C11 14.4477 10.5523 14 10 14C9.44777 14 9 14.4477 9 15V19ZM4.34277 17.0713L7.17141 14.2427C7.56203 13.8525 7.56203 13.2187 7.17141 12.8286C6.78125 12.438 6.1475 12.438 5.75734 12.8286L2.92871 15.6572C2.53809 16.0474 2.53809 16.6807 2.92871 17.0713C3.12402 17.2666 3.37988 17.3643 3.63574 17.3643C3.8916 17.3643 4.14793 17.2666 4.34277 17.0713ZM0 10C0 10.5523 0.447734 11 1 11H5C5.55223 11 6 10.5523 6 10C6 9.44777 5.55223 9 5 9H1C0.447734 9 0 9.44777 0 10ZM4.34277 2.92871C3.95312 2.53809 3.31934 2.53809 2.92871 2.92871C2.53809 3.31934 2.53809 3.95262 2.92871 4.34277L5.75734 7.17141C5.95215 7.36672 6.20852 7.46438 6.46438 7.46438C6.72023 7.46438 6.9766 7.36672 7.17141 7.17141C7.56203 6.78125 7.56203 6.1475 7.17141 5.75734L4.34277 2.92871ZM10 6C10.5523 6 11 5.55223 11 5V1C11 0.447734 10.5523 0 10 0C9.44777 0 9 0.447734 9 1V5C9 5.55223 9.44777 6 10 6Z" fill="#1777CF"/>
</svg>
`;

const GREEN_CHECK_ICON_XML = `
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 1.6875C10.9394 1.6875 12.7994 2.45792 14.1707 3.82928C15.5421 5.20064 16.3125 7.0606 16.3125 9C16.3125 10.9394 15.5421 12.7994 14.1707 14.1707C12.7994 15.5421 10.9394 16.3125 9 16.3125C7.0606 16.3125 5.20064 15.5421 3.82928 14.1707C2.45792 12.7994 1.6875 10.9394 1.6875 9C1.6875 7.0606 2.45792 5.20064 3.82928 3.82928C5.20064 2.45792 7.0606 1.6875 9 1.6875ZM9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18ZM12.9727 7.34766C13.3031 7.01719 13.3031 6.48281 12.9727 6.15586C12.6422 5.82891 12.1078 5.82539 11.7809 6.15586L7.87852 10.0582L6.22617 8.40586C5.8957 8.07539 5.36133 8.07539 5.03437 8.40586C4.70742 8.73633 4.70391 9.2707 5.03437 9.59766L7.28437 11.8477C7.61484 12.1781 8.14922 12.1781 8.47617 11.8477L12.9727 7.34766Z" fill="#1B883C"/>
</svg>
`;

const MORE_ICON_XML = `
<svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_1472_6165)">
    <path d="M4 1.77778C4 2.75962 3.10457 3.55556 2 3.55556C0.895431 3.55556 0 2.75962 0 1.77778C0 0.795938 0.895431 0 2 0C3.10457 0 4 0.795938 4 1.77778Z" fill="#7D8592"/>
    <path d="M4 8C4 8.98184 3.10457 9.77778 2 9.77778C0.895431 9.77778 0 8.98184 0 8C0 7.01816 0.895431 6.22222 2 6.22222C3.10457 6.22222 4 7.01816 4 8Z" fill="#7D8592"/>
    <path d="M2 16C3.10457 16 4 15.2041 4 14.2222C4 13.2404 3.10457 12.4444 2 12.4444C0.895431 12.4444 0 13.2404 0 14.2222C0 15.2041 0.895431 16 2 16Z" fill="#7D8592"/>
  </g>
  <defs>
    <clipPath id="clip0_1472_6165">
      <rect width="4" height="16" rx="2" fill="white"/>
    </clipPath>
  </defs>
</svg>
`;

const formatDate = (dateIso: string) => {
  const d = new Date(`${dateIso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const normalizeStatus = (status?: string | null) => {
  if (!status) return 'Aguardando pagamento';
  return status;
};

const isStatusConfirmed = (status?: string | null) => {
  if (!status) return false;
  return /confirmado/i.test(status);
};

const AlternativeScreen: React.FC<AlternativeScreenProps> = ({ items, selectedId, onSelect, onOpenMenu }) => {
  return (
    <View>
      {items.map((item) => {
        const statusLabel = normalizeStatus(item.status);
        const statusConfirmed = isStatusConfirmed(statusLabel);
        const isSelected = item.id === selectedId;
        const containerStyle = isSelected
          ? [styles.cardContainer, styles.cardContainerSelected]
          : [styles.cardContainer, styles.cardContainerDefault];

        return (
          <TouchableOpacity
            key={item.id}
            style={containerStyle}
            activeOpacity={0.85}
            onPress={() => onSelect(item.id)}
          >
            <View style={styles.leftColumn}>
              <View style={styles.leftInner}>
                <View style={styles.iconWrapper}>
                  <SvgXml xml={statusConfirmed ? GREEN_CHECK_ICON_XML : BLUE_ICON_XML} width={20} height={20} />
                </View>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.headerRow}>
                <Text style={styles.clientName} numberOfLines={1}>
                  {item.client || 'Nova venda'}
                </Text>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => onOpenMenu?.(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir menu do card ${item.id}`}
                >
                  <SvgXml xml={MORE_ICON_XML} width={4} height={16} />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.valueText} numberOfLines={1}>
                  {item.amount || '—'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text
                  style={[
                    styles.statusText,
                    statusConfirmed ? styles.statusTextGreen : styles.statusTextBlue,
                  ]}
                  numberOfLines={1}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default AlternativeScreen;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardContainerSelected: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderWidth: 1,
    borderColor: '#1777CF',
  },
  cardContainerDefault: {
    backgroundColor: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#D8E0F0',
  },
  leftColumn: {
    width: 75,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    overflow: 'hidden',
    marginRight: 12,
  },
  leftInner: {
    padding: 5,
  },
  iconWrapper: {
    backgroundColor: '#FCFCFC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dateBox: {
    marginTop: 5,
    backgroundColor: '#FCFCFC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  dateText: {
    width: 64,
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 17,
  },
  clientName: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  moreButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D8E0F0',
    marginTop: 6,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statusTextBlue: {
    color: '#1777CF',
  },
  statusTextGreen: {
    color: '#1B883C',
  },
});
