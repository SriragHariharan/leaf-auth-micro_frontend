// types.d.ts
declare module 'hostApp/GlobalStore' {
  // Define the type of the store's state (adjust according to your actual state shape)
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

  // Define the type of the exported store (React component or Zustand store)
  const globalStore: import('zustand').Store<GlobalState>;  // Zustand store type
  export default globalStore;
}

declare module "hostApp/themeBootstrap" {
  export const themeBootstrapReady: boolean;
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
  };
}
