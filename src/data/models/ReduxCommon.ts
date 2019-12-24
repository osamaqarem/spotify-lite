export type DispatchFun<P> = ({ type, payload }: Action<P>) => void;

export type Action<P> = { type: string; payload?: P };

export type GetTokens = ({ authCode }: { authCode: string }) => void;

export type AlbumType = { name: string; url: string | null; id: string };
