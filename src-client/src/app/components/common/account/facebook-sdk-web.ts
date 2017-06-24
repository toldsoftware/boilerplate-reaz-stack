import { facebookAppId } from "../../../settings";
import { autoTimeout } from "../utils/auto-timeout";

// https://developers.facebook.com/docs/facebook-login/web
export interface FacebookLoginStatusResponse {
    error?: string;
    status: 'connected' | 'not_authorized' | 'unknown';
    authResponse: {
        accessToken: string;
    };
}

type FacebookSdkRaw = {
    init: (options: any) => void;
    login: (callback: (response: FacebookLoginStatusResponse) => void) => void;
    logout: (callback: (response: FacebookLoginStatusResponse) => void) => void;
    getLoginStatus: (callback: (response: FacebookLoginStatusResponse) => void, force?: boolean) => void;
};

interface FacebookSdk {
    login: () => Promise<FacebookLoginStatusResponse>;
    logout: () => Promise<FacebookLoginStatusResponse>;
    getLoginStatus: (force?: boolean) => Promise<FacebookLoginStatusResponse>;
}

declare var FB: FacebookSdkRaw;
let hasStartedLoading = false;
let fb: FacebookSdk;

const getFacebookSdk = () => {
    return fb = fb || {
        getLoginStatus: (force) => {
            return autoTimeout({
                timeoutErrorMessage: 'Timeout: FacebookSdk.getLoginStatus',
                errorMessage: 'Error: FacebookSdk.getLoginStatus',
            }, () => {
                return new Promise<FacebookLoginStatusResponse>((resolve, reject) => {
                    FB.getLoginStatus(r => {
                        resolve(r);
                    }, force || false);
                });
            });
        },
        login: () => {
            return autoTimeout({
                timeoutErrorMessage: 'Timeout: FacebookSdk.getLoginStatus',
                errorMessage: 'Error: FacebookSdk.getLoginStatus',
            }, () => {
                return new Promise<FacebookLoginStatusResponse>((resolve, reject) => {
                    FB.login(r => {
                        resolve(r);
                    });
                });
            });
        },
        logout: () => {
            return autoTimeout({
                timeoutErrorMessage: 'Timeout: FacebookSdk.getLoginStatus',
                errorMessage: 'Error: FacebookSdk.getLoginStatus',
            }, () => {
                return new Promise<FacebookLoginStatusResponse>((resolve, reject) => {
                    FB.logout(r => {
                        resolve(r);
                    });
                });
            });
        },
    };
};

let resolves: ((value: FacebookSdk) => void)[] = [];

const resolveAll = () => {
    const f = getFacebookSdk();
    const r = resolves;
    resolves = [];
    r.forEach(x => x(f));
};

export function loadFacebookSdk(): Promise<FacebookSdk> {
    return new Promise<FacebookSdk>((resolve, reject) => {
        if (fb) {
            resolve(fb);
            return;
        }

        resolves.push(resolve);

        if (hasStartedLoading) {
            return;
        }

        hasStartedLoading = true;
        console.log('START loadFacebookSdk');

        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: facebookAppId,
                cookie: true,  // enable cookies to allow the server to access 
                // the session
                xfbml: false,  // parse social plugins on this page
                version: 'v2.8' // use graph api version 2.8
            });
            // FB.getLoginStatus((response) => {
            //     // statusChangeCallback(response);
            // });
            resolveAll();
            console.log('END loadFacebookSdk');
        };

        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s) as HTMLScriptElement;
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}