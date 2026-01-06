import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import FullFlow from './02.06.NewSale-FullFlow';

import NewAppointment01 from './02.01.NewSale-Custome';
import NewAppointmentProducts from './02.02.NewSale-Products';
import NewAppointmentActivities from './02.03.NewSale-Activities';
import NewAppointmentAgendaTypes from './02.04.NewSale-TypeOfFees';
import NewAppointmentAgendaTypesPersonalize from './02.04.NewSale-TypeOfFees-Personalize';
import NewSaleFeeDetails from './02.05.NewSale-PaymentMethod';
import DateTimeScreen from './12.NewAppointment-PaymentChecklist';
import NewSaleDiscount from './02.05.NewSale-PaymentMethod-Discount';
import NewSaleSalesContract from './02.06.NewSale-SalesContract';

type TransitionDir = 'forward' | 'backward';

interface ModalShellProps {
  visible: boolean;
  onClose: () => void;
  onCloseImmediate?: () => void;
  onNavigateToDiscountSalesScreen?: () => void;
  autoOpenDiscount?: boolean;
  currentStep: number;
  goToStep: (n: number) => void;
  setTransitionDirection?: (d: TransitionDir) => void;
  transitionDirection?: TransitionDir;
  summaries?: Partial<Record<number, string>>;
  onSelectStep?: (step: number) => void;
  onUpdateSummary?: (step: number, value: string) => void;
  maxAccessibleStep?: number;
  selectedAgendaType?: string | null;
  onSelectAgendaType?: (id: string | null) => void;
  onSchedule?: (payload: { date: any; slots: any[]; client?: { id: string; photoKey?: string; photoUri?: string | null } | null }) => void;
  editing?: boolean;
}

const EyeIcon: React.FC = () => (
  <Svg width={23} height={14} viewBox="0 0 23 14" fill="none">
    <Path d="M11.5 0C5.46878 0 0.364891 6.3 0.149234 6.573C0.0524697 6.6954 0 6.84553 0 7C0 7.15447 0.0524697 7.3046 0.149234 7.427C0.364891 7.7 5.46878 14 11.5 14C17.5312 14 22.6351 7.7 22.8508 7.427C22.9475 7.3046 23 7.15447 23 7C23 6.84553 22.9475 6.6954 22.8508 6.573C22.6351 6.3 17.5312 0 11.5 0ZM11.5 12.6C7.02152 12.6 2.87371 8.4 1.65165 7C2.87371 5.6 7.01433 1.4 11.5 1.4C15.9857 1.4 20.1263 5.6 21.3484 7C20.1263 8.4 15.9857 12.6 11.5 12.6Z" fill="#3A3F51"/>
    <Path d="M15.0943 6.3C15.2129 6.29991 15.3297 6.27122 15.4342 6.21649C15.5387 6.16176 15.6277 6.0827 15.6932 5.98635C15.7586 5.89001 15.7986 5.77937 15.8095 5.66433C15.8204 5.54928 15.8019 5.43339 15.7556 5.327C15.3602 4.56023 14.7517 3.9169 13.9994 3.47018C13.2471 3.02345 12.3811 2.79126 11.5 2.8C10.3561 2.8 9.25902 3.2425 8.45014 4.03015C7.64127 4.8178 7.18685 5.88609 7.18685 7C7.18685 8.11391 7.64127 9.1822 8.45014 9.96985C9.25902 10.7575 10.3561 11.2 11.5 11.2C12.3811 11.2087 13.2471 10.9765 13.9994 10.5298C14.7517 10.0831 15.3602 9.43977 15.7556 8.673C15.8019 8.56661 15.8204 8.45072 15.8095 8.33568C15.7986 8.22063 15.7586 8.11 15.6932 8.01365C15.6277 7.9173 15.5387 7.83824 15.4342 7.78351C15.3297 7.72879 15.2129 7.7001 15.0943 7.7C14.9974 7.7099 14.8994 7.6986 14.8076 7.66692C14.7158 7.63525 14.6324 7.58399 14.5635 7.51691C14.4946 7.44982 14.4419 7.36859 14.4094 7.27916C14.3769 7.18973 14.3653 7.09436 14.3754 7C14.3653 6.90564 14.3769 6.81027 14.4094 6.72084C14.4419 6.63141 14.4946 6.55018 14.5635 6.48309C14.6324 6.41601 14.7158 6.36475 14.8076 6.33308C14.8994 6.3014 14.9974 6.2901 15.0943 6.3Z" fill="#3A3F51"/>
  </Svg>
);

const CloseIcon: React.FC = () => (
  <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
    <Path d="M12.655 0.247926C12.2959 -0.0821192 11.7339 -0.0827124 11.374 0.246573L6.5 4.70646L1.62595 0.246573C1.26609 -0.0827126 0.704125 -0.0821187 0.344999 0.247926L0.291597 0.297004C-0.0977822 0.654853 -0.0971065 1.25701 0.293074 1.61404L5.08634 6L0.293074 10.386C-0.0971063 10.743 -0.0977808 11.3451 0.291598 11.703L0.345 11.7521C0.704126 12.0821 1.26609 12.0827 1.62595 11.7534L6.5 7.29354L11.374 11.7534C11.7339 12.0827 12.2959 12.0821 12.655 11.7521L12.7084 11.703C13.0978 11.3451 13.0971 10.743 12.7069 10.386L7.91366 6L12.7069 1.61404C13.0971 1.25701 13.0978 0.654853 12.7084 0.297004L12.655 0.247926Z" fill="#3A3F51"/>
  </Svg>
);

const DiscountIcon: React.FC = () => (
  <Text style={{ color: '#3A3F51', fontSize: 16, fontFamily: 'Inter_600SemiBold' }}>%</Text>
);

const ModalShell: React.FC<ModalShellProps> = ({
  visible,
  onClose,
  onCloseImmediate,
  onNavigateToDiscountSalesScreen,
  autoOpenDiscount,
  currentStep,
  goToStep,
  setTransitionDirection,
  transitionDirection,
  summaries,
  onSelectStep,
  onUpdateSummary,
  maxAccessibleStep,
  selectedAgendaType,
  onSelectAgendaType,
  onSchedule,
  editing = false,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [fullFlowVisible, setFullFlowVisible] = useState(false);
  const [discountVisible, setDiscountVisible] = useState(false);
  const [discountAutoOpened, setDiscountAutoOpened] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const stepNextHandlerRef = useRef<(() => void) | null>(null);
  const [selectedClient, setSelectedClient] = useState<{ id: string; photoKey?: string; photoUri?: string | null } | null>(null);

  const registerNextHandler = useCallback((fn: () => void) => {
    stepNextHandlerRef.current = fn;
  }, []);

  const onCanProceedChange = useCallback((can: boolean) => {
    setCanProceed(can);
  }, []);

  useEffect(() => {
    try { console.log('[NewSale-Orchestrator] visible=', visible, 'step=', currentStep); } catch {}
    const paymentStep = selectedAgendaType === 'prolabore_success' ? 7 : 6;
    if (visible && currentStep === paymentStep && autoOpenDiscount && !discountVisible && !discountAutoOpened) {
      try { console.log('[ModalShell02] autoOpenDiscount triggered'); } catch {}
      setDiscountVisible(true);
      setDiscountAutoOpened(true);
    }
  }, [visible, currentStep, autoOpenDiscount, discountVisible, discountAutoOpened, selectedAgendaType]);

  useEffect(() => {
    if (!visible) {
      setDiscountAutoOpened(false);
    }
  }, [visible]);

  const handleBack = useCallback(() => {
    setTransitionDirection?.('backward');
    switch (currentStep) {
      case 1: onClose(); break;
      case 2: goToStep(1); break;
      case 3: goToStep(2); break;
      case 4: goToStep(2); break;
      case 5: goToStep(4); break;
      case 6: goToStep(5); break;
      case 7: goToStep(selectedAgendaType === 'prolabore_success' ? 6 : 6); break;
      case 8: goToStep(7); break;
      default: onClose(); break;
    }
  }, [currentStep, goToStep, onClose, selectedAgendaType, setTransitionDirection]);

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    setTransitionDirection?.('forward');
    stepNextHandlerRef.current?.();
  }, [canProceed, setTransitionDirection]);

  const content = useMemo(() => {
    const common = {
      summaries,
      onSelectStep,
      onUpdateSummary,
      maxAccessibleStep,
      transitionDirection,
      embedded: true,
      registerNextHandler,
      onCanProceedChange,
      visible,
    } as const;

    switch (currentStep) {
      case 1:
        return (
          <NewAppointment01
            {...common}
            onClose={onClose}
            onSelectClient={(client: { id: string; photoKey?: string; photoUri?: string | null } | null) => setSelectedClient(client)}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(2); }}
          />
        );
      case 2:
        return (
          <NewAppointmentProducts
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(1); }}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(4); }}
          />
        );
      case 4:
        return (
          <NewAppointmentActivities
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(2); }}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(5); }}
          />
        );
      case 5:
        return (
          <NewAppointmentAgendaTypes
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(4); }}
            onNext={(agendaTypeId: string) => {
              onSelectAgendaType?.(agendaTypeId);
              setTransitionDirection?.('forward');
              goToStep(6);
            }}
            onSelectAgendaType={onSelectAgendaType}
          />
        );
      case 6:
        return selectedAgendaType === 'prolabore_success' ? (
          <NewAppointmentAgendaTypesPersonalize
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(5); }}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(7); }}
          />
        ) : (
          <NewSaleFeeDetails
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(5); }}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(7); }}
          />
        );
      case 7:
        return selectedAgendaType === 'prolabore_success' ? (
          <NewSaleFeeDetails
            {...common}
            onClose={onClose}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(6); }}
            onNext={() => { setTransitionDirection?.('forward'); goToStep(8); }}
          />
        ) : (
          <NewSaleSalesContract
            {...common}
            onClose={onClose}
            onCloseImmediate={onCloseImmediate}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(6); }}
            navigation={navigation}
            onSaveSale={(saleData) => {
              onSchedule?.({ date: new Date(), slots: [], ...saleData, client: selectedClient });
              // Fecha o modal após salvar a venda
              if (onCloseImmediate) {
                onCloseImmediate();
              } else {
                // Fallback: fecha usando navigation reset
                navigation.reset({
                  index: 0,
                  routes: [{ name: ScreenNames.SalesHome as any }],
                });
              }
            }}
          />
        );
      case 8:
        return (
          <NewSaleSalesContract
            {...common}
            onClose={onClose}
            onCloseImmediate={onCloseImmediate}
            onBack={() => { setTransitionDirection?.('backward'); goToStep(7); }}
            navigation={navigation}
            onSaveSale={(saleData) => {
              onSchedule?.({ date: new Date(), slots: [], ...saleData, client: selectedClient });
              // Fecha o modal após salvar a venda
              if (onCloseImmediate) {
                onCloseImmediate();
              } else {
                // Fallback: fecha usando navigation reset
                navigation.reset({
                  index: 0,
                  routes: [{ name: ScreenNames.SalesHome as any }],
                });
              }
            }}
          />
        );
      default:
        return null;
    }
  }, [currentStep, goToStep, maxAccessibleStep, onClose, onSchedule, onSelectAgendaType, onSelectStep, onUpdateSummary, selectedAgendaType, setTransitionDirection, summaries, transitionDirection, registerNextHandler, onCanProceedChange, visible, selectedClient, navigation]);

  return (
    <>
      <Modal visible={visible} transparent animationType="none">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{editing ? 'Editar venda' : 'Nova venda'}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setFullFlowVisible(true)} accessibilityRole="button" accessibilityLabel="Visualizar">
                <EyeIcon />
              </TouchableOpacity>
              {currentStep === (selectedAgendaType === 'prolabore_success' ? 7 : 6) && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setDiscountVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Porcentagem de desconto"
                >
                  <DiscountIcon />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.iconButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
                <CloseIcon />
              </TouchableOpacity>
            </View>
            </View>

            <View style={{ alignSelf: 'stretch', flex: 1 }}>
              {content}
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity
                style={[styles.footerButton]}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Text style={styles.footerButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonPrimary, !canProceed && styles.footerButtonDisabled]}
                disabled={!canProceed}
                accessibilityRole="button"
                accessibilityLabel={
                  currentStep === (selectedAgendaType === 'prolabore_success' ? 8 : 7)
                    ? 'Finalizar'
                    : 'Próximo'
                }
                accessibilityState={{ disabled: !canProceed }}
                onPress={handleNext}
              >
                <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>
                  {currentStep === (selectedAgendaType === 'prolabore_success' ? 8 : 7)
                    ? 'Finalizar'
                    : 'Próximo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <NewSaleDiscount
        visible={discountVisible}
        summaries={summaries}
        onClose={() => setDiscountVisible(false)}
        onApply={(payload) => {
          const stepForSummary = selectedAgendaType === 'prolabore_success' ? 7 : 6;
          const current = (summaries?.[stepForSummary] ?? '').trim();
          const methods = current.length ? current : 'Pix';
          if (!payload || !payload.value) {
            onUpdateSummary?.(stepForSummary, methods);
          } else {
            const v = Number(payload.value);
            const formatted = payload.mode === 'percent'
              ? `${v.toFixed(2).replace('.', ',')}%`
              : `R$ ${v.toFixed(2).replace('.', ',')}`;
            const merged = `${methods}; Desconto: ${formatted}`;
            onUpdateSummary?.(stepForSummary, merged);
          }
          setDiscountVisible(false);
        }}
        onNavigateToDiscountSales={() => {
          setDiscountVisible(false);
          setTimeout(() => {
            if (onNavigateToDiscountSalesScreen) {
              onNavigateToDiscountSalesScreen();
            } else {
              navigation.navigate(ScreenNames.DiscountCustomer as any);
            }
          }, 50);
        }}
      />
      <FullFlow visible={fullFlowVisible} onClose={() => setFullFlowVisible(false)} currentStep={currentStep} summaries={summaries} onSelectStep={onSelectStep} maxAccessibleStep={maxAccessibleStep} />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'web' ? 0.12 : 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    color: '#3A3F51',
    fontFamily: 'Inter_700Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  footerButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#D8E0F0',
  },
  footerButtonPrimary: {
    backgroundColor: '#1777CF',
    borderWidth: 0,
  },
  footerButtonDisabled: {
    opacity: 0.6,
  },
  footerButtonText: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  footerButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default ModalShell;
