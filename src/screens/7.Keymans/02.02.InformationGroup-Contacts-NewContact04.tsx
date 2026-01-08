import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './02.02.InformationGroup-Contacts-NewContact03';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modalContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    zIndex: 10001,
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
    justifyContent: 'space-between',
    gap: 10,
  },
  downloadModelContainer: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#1B883C',
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
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#1777CF',
    gap: 10,
    padding: 14,
  },
  importButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.primary,
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
    overflow: 'hidden',
  },
  stepperArrowLeftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperArrowRightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContent: {
    paddingTop: 2,
    paddingBottom: 0,
    gap: 15,
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
    flex: 1,
    alignSelf: 'center',
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
  sectionTopSpacing: {
    marginTop: 15,
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
  dropdownInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dropdownChevron: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 0.5,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },
  placeholderText: {
    color: COLORS.textTertiary,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000055',
  },
  dropdownModalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    padding: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },
  stateList: {
    maxHeight: 180,
    marginTop: 8,
  },
  stateItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  stateItemSelected: {
    backgroundColor: '#D8E0F033',
    borderRadius: 8,
  },
  stateItemText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  stateDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.7,
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
    borderTopWidth: 0,
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

export default styles;
