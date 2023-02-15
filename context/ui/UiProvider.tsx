import { FC, useReducer } from "react";
import { UiContext } from "./";
import { uiReducer } from "./";

interface ProviderProps {
	children: React.ReactNode;
}

export interface UiState {
	isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
	isMenuOpen: false
};

export const UiProvider: FC<ProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

	const toggleSideMenu = () => {
		dispatch({ type: "[UI] - ToggleMenu" });
	};

	const valueProvider = { ...state, toggleSideMenu };

	return <UiContext.Provider value={valueProvider}>{children}</UiContext.Provider>;
};
