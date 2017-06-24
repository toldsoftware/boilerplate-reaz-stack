import { autoTimeout } from '../utils/auto-timeout';
import * as RX from 'reactxp';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { FacebookLoginProps, FacebookAccessType } from "./facebook-login-common";

// accessToken : FBAccessToken
// accessToken : "EAAEUu0kGkf4BAEN..."
// accessTokenSource  : undefined
// applicationID  : "304..."
// declinedPermissions  :Array(0)
// expirationTime : 1502148061494.051
// lastRefreshTime : 1497044532495.755
// permission : Array(1)
// 0:"public_profile"
// length:1
// userID:"2025456147677441"
interface FacebookAccessTokenResponse {
    accessToken: string;
    applicationID: string;

    permissions: string[];
    declinedPermissions: string[];

    expirationTime: number;
    lastRefreshTime: number;
}

// Reference: https://github.com/facebook/react-native-fbsdk
export const FacebookLogin = (props: FacebookLoginProps) => {

    const onLoginFinished = (error: any, result: any) => {
        if (error) {
            props.onError && props.onError('Error: Facebook Login', result.error);
        } else if (result.isCancelled) {
            props.onError && props.onError('Error: Facebook Login', 'Login Cancelled');
        } else {
            FacebookAccess.getCurrentAccessToken().then(
                (accessToken) => {
                    console.log('AccessToken.getCurrentAccessToken()', accessToken);
                    props.onLoginFinished(accessToken.toString())
                }
            ).catch(err => {
                props.onError && props.onError('Error: Facebook Login', err);
            });
        }
    };

    //                publishPermissions={[]}
    return (
        <RX.View>
            <LoginButton
                onLoginFinished={onLoginFinished}
                onLogoutFinished={props.onLogoutFinished}
            />
        </RX.View>
    );
};

class FacebookAccessClass implements FacebookAccessType {
    getCurrentAccessToken(): Promise<string> {
        return autoTimeout({
            timeoutErrorMessage: 'Timeout: FacebookAccessClass.getCurrentAccessToken (native)',
            errorMessage: 'Error: FacebookAccessClass.getCurrentAccessToken (native)',
        }, async () => {
            console.log('START getCurrentAccessToken (native)');

            const p = AccessToken.getCurrentAccessToken() as Promise<FacebookAccessTokenResponse>;
            console.log('CONT getCurrentAccessToken (native)', p);

            const r = await p;
            console.log('END getCurrentAccessToken (native)', r);
            return r && r.accessToken || null;
        });
    }
}

export const FacebookAccess = new FacebookAccessClass();
