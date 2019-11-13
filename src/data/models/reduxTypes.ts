export type DispatchFun<P> = ({ type, payload }: Action<P>) => void;

export type Action<P> = { type: string; payload?: P };

export type GetTokens = ({ authCode }: { authCode: string }) => void;
