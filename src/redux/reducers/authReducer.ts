import {DispatchObject} from "../../data/types";
import {authActions} from "../actions";

const initialState = {
  token: null,
  refreshToken: null,
  profile: null,
  error: null,
};

export default (state = initialState, {type, payload}: DispatchObject) => {
  switch (type) {
    case authActions.GET_TOKEN:
      return {...state, ...payload};
    case authActions.PROFILE:
      debugger;
      return {...state, ...payload};
    case authActions.ERROR:
      debugger;
      return {...state, ...payload};
    default:
      return state;
  }
};
