import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Platform } from 'react-native';
import styles from './02.02.InformationGroup-Contacts-NewContact04';
import { COLORS, BRAZIL_STATES, UF_NAME_MAP } from './02.02.InformationGroup-Contacts-NewContact03';
import { ChevronDownIcon, StepArrowButtonIcon, ImportExcelIcon, TrashButtonIcon, AddButtonIcon } from './02.02.InformationGroup-Contacts-NewContact02';

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  editable?: boolean;
  error?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  editable = true,
  error,
}) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>
          {label}
          {required ? '*' : ''}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={editable ? onChangeText : () => {}}
          placeholder={placeholder ?? label}
          placeholderTextColor={COLORS.textTertiary}
          editable={editable}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

type StateSelectorProps = {
  value: string;
  onChange: (uf: string) => void;
  disabled?: boolean;
};

const getStateLabel = (value: string) => {
  const v = (value ?? '').trim();
  if (!v) return '';
  if (UF_NAME_MAP[v]) return UF_NAME_MAP[v];
  if (v.includes(' - ')) return v;
  const match = BRAZIL_STATES.find((label) => label.toLowerCase().endsWith(`- ${v.toLowerCase()}`));
  return match ?? v;
};

export const StateSelector: React.FC<StateSelectorProps> = ({ value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const chevronAnim = useRef(new Animated.Value(0)).current;
  const chevronRotate = chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] });

  const filteredStates = useMemo(
    () => BRAZIL_STATES.filter((s) => s.toLowerCase().includes(search.toLowerCase().trim())),
    [search]
  );

  useEffect(() => {
    Animated.timing(chevronAnim, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [chevronAnim, open]);

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>Estado</Text>
      </View>
      <TouchableOpacity
        style={[styles.dropdownInput, styles.stateSelectRow, focused ? styles.inputFocused : null]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Seletor de estado"
        accessibilityHint="Toque para selecionar um estado"
        onPress={
          disabled
            ? undefined
            : () => {
                setFocused(true);
                setOpen((prev) => !prev);
              }
        }
      >
        <Text style={[styles.dropdownText, !value ? styles.placeholderText : null]}>
          {value ? getStateLabel(value) : 'Selecione um estado'}
        </Text>
        <Animated.View style={[styles.dropdownChevron, { transform: [{ rotate: chevronRotate }] }]}>
          <ChevronDownIcon />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setOpen(false);
          setSearch('');
          setFocused(false);
        }}
      >
        <View style={[styles.dropdownModalContainer, { backgroundColor: COLORS.white }]} pointerEvents="box-none">
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estado"
              placeholderTextColor={COLORS.textTertiary}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            <ScrollView style={styles.stateList} keyboardShouldPersistTaps="always">
              {filteredStates.map((label) => (
                <View key={label}>
                  <TouchableOpacity
                    style={[styles.stateItem, (getStateLabel(value) === label) && styles.stateItemSelected]}
                    onPress={() => {
                      const uf = label.split(' - ')[0];
                      onChange(uf);
                      setSearch('');
                      setOpen(false);
                      setFocused(false);
                    }}
                    accessibilityLabel={`Selecionar estado ${label}`}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.stateItemText}>{label}</Text>
                  </TouchableOpacity>
                  <View style={styles.stateDivider} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

type StepperProps = {
  tabs: number[];
  activeTab: number;
  canGoLeft: boolean;
  canGoRight: boolean;
  onStepLeft: () => void;
  onStepRight: () => void;
  onSelectTab: (tab: number) => void;
  tabsWithErrors?: number[];
};

export const Stepper: React.FC<StepperProps> = ({
  tabs,
  activeTab,
  canGoLeft,
  canGoRight,
  onStepLeft,
  onStepRight,
  onSelectTab,
  tabsWithErrors,
}) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const BOX_W = 40;
  const BOX_GAP = 10;
  const SAFE_PAD = 0;

  const totalContentWidth = useMemo(() => {
    if (!Array.isArray(tabs) || tabs.length === 0) return 0;
    return tabs.length * BOX_W + (tabs.length - 1) * BOX_GAP + SAFE_PAD * 2;
  }, [tabs]);

  const scrollToTabIndex = (idx: number) => {
    if (idx < 0) return;
    const baseLeft = idx * (BOX_W + BOX_GAP);
    const baseRight = baseLeft + BOX_W;
    const maxX = Math.max(0, totalContentWidth - containerWidth);
    let targetX = baseLeft;
    const visibleRightEdge = (x: number) => x + containerWidth - SAFE_PAD;
    if (baseRight > visibleRightEdge(targetX)) {
      targetX = baseRight - (containerWidth - SAFE_PAD);
    }
    targetX = Math.max(0, Math.min(targetX, maxX));
    scrollRef.current?.scrollTo({ x: targetX, animated: true });
  };

  useEffect(() => {
    const idx = tabs.findIndex((t) => t === activeTab);
    if (idx >= 0) scrollToTabIndex(idx);
  }, [activeTab, tabs, containerWidth, totalContentWidth]);

  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity activeOpacity={0.8} onPress={onStepLeft} disabled={!canGoLeft} style={styles.stepperArrowLeftContainer}>
        <StepArrowButtonIcon direction="left" disabled={!canGoLeft} />
      </TouchableOpacity>

      <View style={styles.stepperCenter} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ alignItems: 'center', paddingLeft: SAFE_PAD, paddingRight: SAFE_PAD }}
        >
          {tabs.map((step, idx) => (
            <TouchableOpacity
              key={step}
              activeOpacity={0.8}
              onPress={() => {
                onSelectTab(step);
                scrollToTabIndex(idx);
              }}
              style={{ marginRight: idx === tabs.length - 1 ? 0 : BOX_GAP }}
            >
              <View
                style={[
                  styles.stepBox,
                  step === activeTab ? styles.stepBoxActive : null,
                  tabsWithErrors?.includes(step) ? styles.stepBoxError : null,
                ]}
              >
                <Text style={[styles.stepText, step === activeTab ? styles.stepTextActive : null]}>
                  {String(step).padStart(2, '0')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={onStepRight} disabled={!canGoRight} style={styles.stepperArrowRightContainer}>
        <StepArrowButtonIcon direction="right" disabled={!canGoRight} />
      </TouchableOpacity>
    </View>
  );
};

type HeaderActionsProps = {
  onImportExcel: () => void;
  onDeleteTab: () => void;
  onAddTab: () => void;
};

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onImportExcel, onDeleteTab, onAddTab }) => {
  return (
    <View style={styles.headerActionsRow}>
      <View style={styles.importButtonHeader}>
        <TouchableOpacity
          style={styles.importButton}
          onPress={Platform.OS === 'web' ? undefined : onImportExcel}
          onPressIn={Platform.OS === 'web' ? onImportExcel : undefined}
          activeOpacity={0.8}
        >
          <ImportExcelIcon />
          <Text style={styles.importButtonText}>Importar planilha do Excel</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={onDeleteTab}>
        <TrashButtonIcon />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={onAddTab}>
        <AddButtonIcon />
      </TouchableOpacity>
    </View>
  );
};

export default {};
