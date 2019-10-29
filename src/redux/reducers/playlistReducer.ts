import { Action } from "../../data/types";

const initialState = {};

export default (state = initialState, { type, payload }: Action) => {
  switch (type) {
    default:
      return state;
  }
};
