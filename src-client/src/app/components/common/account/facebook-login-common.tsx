export type FacebookLoginProps = {
    onLoginFinished: (accessToken: string) => void,
    onLogoutFinished?: () => void,
    onError: (err: string, data: any) => void,
};

export interface FacebookAccessType {
    getCurrentAccessToken(): Promise<string>;
}
