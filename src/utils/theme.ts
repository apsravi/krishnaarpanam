export interface ThemeTokens {
  bg: string
  bgPattern: string
  surface: string
  surfaceBorder: string
  surfaceShadow: string
  text: string
  textMid: string
  textLight: string
  textPlaceholder: string
  inputBorder: string
  inputBorderFocus: string
  inputBg: string
  inputText: string
  statsBg: string
  statsBorder: string
  tabBg: string
  tabBorder: string
  rowEven: string
  rowHover: string
  modalBg: string
  modalOverlay: string
  footerBg: string
  footerBorder: string
  quoteBg: string
  quoteBorder: string
  dropzoneBorder: string
  dropzoneBorderActive: string
  dropzoneBg: string
  checkboxAccent: string
  badgeGradient: string
  headerGradient: string
  btnPrimaryBg: string
  btnPrimaryText: string
  btnSecondaryBg: string
  btnSecondaryText: string
  btnGhostBg: string
  btnGhostText: string
  btnGhostBorder: string
  btnDangerBg: string
  btnDangerText: string
  btnDangerBorder: string
  successBg: string
  successBorder: string
  successText: string
  errorBg: string
  errorBorder: string
  errorText: string
  gridAssignedBg: string
  gridAssignedBorder: string
  gridAssignedText: string
  gridUnassignedBg: string
  gridUnassignedBorder: string
  gridUnassignedText: string
  gridDupBg: string
  gridDupBorder: string
  gridDupText: string
  gridHoveredBg: string
  progressBg: string
  progressFill: string
  progressFillComplete: string
  tableHeadBg: string
  tableHeadText: string
  tableBorder: string
}

export function getTheme(dark: boolean): ThemeTokens {
  if (dark) {
    return {
      bg: '#0F0A05',
      bgPattern: 'radial-gradient(circle at 15% 15%, rgba(255,107,0,0.06) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(201,168,76,0.08) 0%, transparent 50%)',
      surface: 'rgba(28,16,5,0.97)',
      surfaceBorder: 'rgba(201,168,76,0.18)',
      surfaceShadow: '0 4px 32px rgba(0,0,0,0.6)',
      text: '#F5E6C8',
      textMid: '#C9A84C',
      textLight: '#9B8A70',
      textPlaceholder: '#6B5A42',
      inputBorder: 'rgba(201,168,76,0.25)',
      inputBorderFocus: '#C9A84C',
      inputBg: 'rgba(255,255,255,0.04)',
      inputText: '#F5E6C8',
      statsBg: 'linear-gradient(135deg, rgba(139,26,26,0.18), rgba(201,168,76,0.10))',
      statsBorder: 'rgba(212,168,67,0.18)',
      tabBg: 'rgba(201,168,76,0.06)',
      tabBorder: 'rgba(201,168,76,0.14)',
      rowEven: 'rgba(255,243,224,0.04)',
      rowHover: 'rgba(201,168,76,0.07)',
      modalBg: '#1C0F05',
      modalOverlay: 'rgba(0,0,0,0.75)',
      footerBg: 'rgba(15,10,5,0.95)',
      footerBorder: 'rgba(212,168,67,0.14)',
      quoteBg: 'linear-gradient(135deg, rgba(139,26,26,0.08), rgba(201,168,76,0.06))',
      quoteBorder: 'rgba(212,168,67,0.15)',
      dropzoneBorder: 'rgba(201,168,76,0.28)',
      dropzoneBorderActive: '#C9A84C',
      dropzoneBg: 'rgba(201,168,76,0.04)',
      checkboxAccent: '#C9A84C',
      badgeGradient: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
      headerGradient: 'linear-gradient(135deg, #1C1008 0%, #4A2510 30%, #8B1A1A 60%, #C9A84C 100%)',
      btnPrimaryBg: 'linear-gradient(135deg, #FF6B00, #FF9A3C)',
      btnPrimaryText: '#fff',
      btnSecondaryBg: 'linear-gradient(135deg, #8B1A1A, #A52828)',
      btnSecondaryText: '#FDF6E3',
      btnGhostBg: 'transparent',
      btnGhostText: '#C9A84C',
      btnGhostBorder: 'rgba(201,168,76,0.4)',
      btnDangerBg: 'transparent',
      btnDangerText: '#F87171',
      btnDangerBorder: 'rgba(248,113,113,0.35)',
      successBg: 'rgba(22,163,74,0.10)',
      successBorder: 'rgba(22,163,74,0.28)',
      successText: '#4ADE80',
      errorBg: 'rgba(220,38,38,0.10)',
      errorBorder: 'rgba(220,38,38,0.28)',
      errorText: '#F87171',
      gridAssignedBg: '#1A3A2A',
      gridAssignedBorder: '#2D6A4F',
      gridAssignedText: '#74C69D',
      gridUnassignedBg: 'rgba(30,20,8,0.8)',
      gridUnassignedBorder: 'rgba(201,168,76,0.2)',
      gridUnassignedText: '#6B5A42',
      gridDupBg: '#3A1A1A',
      gridDupBorder: '#7F2A2A',
      gridDupText: '#F87171',
      gridHoveredBg: '#2D5A3A',
      progressBg: 'rgba(201,168,76,0.12)',
      progressFill: 'linear-gradient(90deg, #8B1A1A, #C9A84C)',
      progressFillComplete: 'linear-gradient(90deg, #16A34A, #22C55E)',
      tableHeadBg: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
      tableHeadText: '#FDF6E3',
      tableBorder: 'rgba(201,168,76,0.18)',
    }
  }
  return {
    bg: '#FDF6E3',
    bgPattern: 'radial-gradient(circle at 15% 15%, rgba(255,107,0,0.04) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(201,168,76,0.06) 0%, transparent 50%)',
    surface: 'rgba(253,246,227,0.95)',
    surfaceBorder: 'rgba(212,168,67,0.28)',
    surfaceShadow: '0 4px 24px rgba(201,168,76,0.14)',
    text: '#1C1008',
    textMid: '#8B6914',
    textLight: '#8B7355',
    textPlaceholder: '#B8A585',
    inputBorder: 'rgba(201,168,76,0.38)',
    inputBorderFocus: '#FF6B00',
    inputBg: 'transparent',
    inputText: '#1C1008',
    statsBg: 'linear-gradient(135deg, rgba(139,26,26,0.05), rgba(201,168,76,0.08))',
    statsBorder: 'rgba(212,168,67,0.24)',
    tabBg: 'rgba(201,168,76,0.08)',
    tabBorder: 'rgba(201,168,76,0.20)',
    rowEven: 'rgba(255,243,224,0.55)',
    rowHover: 'rgba(201,168,76,0.07)',
    modalBg: '#FDF6E3',
    modalOverlay: 'rgba(28,16,8,0.65)',
    footerBg: 'rgba(253,246,227,0.92)',
    footerBorder: 'rgba(212,168,67,0.20)',
    quoteBg: 'linear-gradient(135deg, rgba(139,26,26,0.04), rgba(201,168,76,0.06))',
    quoteBorder: 'rgba(212,168,67,0.20)',
    dropzoneBorder: 'rgba(201,168,76,0.35)',
    dropzoneBorderActive: '#C9A84C',
    dropzoneBg: 'transparent',
    checkboxAccent: '#C9A84C',
    badgeGradient: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
    headerGradient: 'linear-gradient(135deg, #1C1008 0%, #4A2510 30%, #8B1A1A 60%, #C9A84C 100%)',
    btnPrimaryBg: 'linear-gradient(135deg, #FF6B00, #FF9A3C)',
    btnPrimaryText: '#fff',
    btnSecondaryBg: 'linear-gradient(135deg, #8B1A1A, #A52828)',
    btnSecondaryText: '#FDF6E3',
    btnGhostBg: 'transparent',
    btnGhostText: '#8B6914',
    btnGhostBorder: '#D4A843',
    btnDangerBg: 'transparent',
    btnDangerText: '#DC2626',
    btnDangerBorder: 'rgba(220,38,38,0.30)',
    successBg: 'rgba(22,163,74,0.07)',
    successBorder: 'rgba(22,163,74,0.25)',
    successText: '#16A34A',
    errorBg: 'rgba(220,38,38,0.07)',
    errorBorder: 'rgba(220,38,38,0.25)',
    errorText: '#DC2626',
    gridAssignedBg: '#E8F5E9',
    gridAssignedBorder: '#A5D6A7',
    gridAssignedText: '#1B5E20',
    gridUnassignedBg: 'rgba(255,243,224,0.6)',
    gridUnassignedBorder: 'rgba(201,168,76,0.28)',
    gridUnassignedText: '#8B7355',
    gridDupBg: '#FFEBEE',
    gridDupBorder: '#EF9A9A',
    gridDupText: '#B71C1C',
    gridHoveredBg: '#C8E6C9',
    progressBg: 'rgba(201,168,76,0.14)',
    progressFill: 'linear-gradient(90deg, #8B1A1A, #C9A84C)',
    progressFillComplete: 'linear-gradient(90deg, #16A34A, #22C55E)',
    tableHeadBg: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
    tableHeadText: '#FDF6E3',
    tableBorder: 'rgba(212,168,67,0.20)',
  }
}
