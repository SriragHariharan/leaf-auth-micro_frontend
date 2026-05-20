// types.d.ts
declare module 'hostApp/GlobalStore' {
  export interface GlobalState {
    username: string | null;
    profilePic: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUsername: (username: string) => void;
    setProfilePic: (profilePic: string) => void;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    clearTokens: () => void;
  }

  const globalStore: import('zustand').Store<GlobalState>;
  export default globalStore;
}

declare module "hostApp/themeBootstrap" {
  export const themeBootstrapReady: boolean;
}

declare module 'hostApp/toast' {
  import type { ComponentType } from 'react';

  export const Toaster: ComponentType;
  export const toastOptions: { position: 'bottom-right'; duration: number };
  export const showErrorToast: (message: string) => void;
  export const showSuccessToast: (message: string) => void;
}

declare module "hostApp/designRecipes" {
  export const designRecipes: {
    modalOverlay: string;
    modalContainer: string;
    modalHeader: string;
    inputBase: string;
    inputError: string;
    buttonPrimary: string;
    buttonSecondary: string;
    iconButton: string;
    panel: string;
    topbarShell: string;
    navItemBase: string;
    navItemActive: string;
    navItemIdle: string;
    badgeDanger: string;
    statusSuccess: string;
    statusWarning: string;
    statusDanger: string;
    authFormShell: string;
    authFormContent: string;
    authDecorBlurTop: string;
    authDecorBlurBottom: string;
    inputWithIcon: string;
    formLabel: string;
    formError: string;
    buttonSubmitFull: string;
    linkBrand: string;
    authDivider: string;
    authSplitLayout: string;
    authSplitCarouselCol: string;
    authSplitFormCol: string;
    profileHeaderCard: string;
    profileBioCard: string;
    profileCover: string;
    profileCoverGradient: string;
    profileAvatar: string;
    profileEditIconBtn: string;
    profileCoverEditBtn: string;
    profileMetaEditBtn: string;
    compactBtnPrimary: string;
    compactBtnWarning: string;
    compactBtnReport: string;
    compactStatusSuccess: string;
    compactIcon: string;
    pageShell: string;
    pageCenter: string;
    pageContainer: string;
    pageContainerWide: string;
    panelHover: string;
    panelList: string;
    avatarFeed: string;
    feedActionButton: string;
    feedActionWithCount: string;
    dropdownMenu: string;
    dropdownMenuItem: string;
    segmentedControlShell: string;
    segmentedControlShellGrid: string;
    segmentedTab: string;
    segmentedTabActive: string;
    segmentedTabIdle: string;
    searchStickyHeader: string;
    inputSearchPill: string;
    tabButton: string;
    tabButtonActive: string;
    statusPanelDanger: string;
    statusPanelWarning: string;
    notificationRow: string;
    notificationRowUnread: string;
    notificationSkeleton: string;
    notificationTypeBadge: string;
    emptyStateCard: string;
    buttonDangerSecondary: string;
    notificationStickyHeader: string;
    avatarNotification: string;
  };
}
