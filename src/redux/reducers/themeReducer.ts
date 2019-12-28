import { themeActions } from "../actions";
import { Action } from "../../data/models";

type ThemeReducerType = {
  showTabBar: boolean;
};

const initialState = {
  showTabBar: true,
};

export default (
  state = initialState,
  { type }: Action<any>,
): ThemeReducerType => {
  switch (type) {
    case themeActions.SHOW_TAB_BAR:
      return { ...state, showTabBar: true };
    case themeActions.HIDE_TAB_BAR:
      return { ...state, showTabBar: false };
    default:
      return state;
  }
};
