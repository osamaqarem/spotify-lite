export type DispatchFun<P> = ({ type, payload }: Action<P>) => void;

export type Action<P> = { type: string; payload?: P };

export type GetToken = ({ authCode }: { authCode: string }) => void;
