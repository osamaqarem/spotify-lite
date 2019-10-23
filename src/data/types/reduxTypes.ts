export type DispatchFun = ({ type, payload }: Action) => void;

export type Action = { type: string; payload?: any };

export type GetToken = ({ authCode }: { authCode: string }) => void;
