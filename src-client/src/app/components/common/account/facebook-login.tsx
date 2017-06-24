import { autoTimeout } from '../utils/auto-timeout';
import * as RX from 'reactxp';
import { FacebookLoginProps, FacebookAccessType } from "./facebook-login-common";
import { createIconStyle } from "../icons/icon-base";
import { FacebookIcon } from "../icons/facebook";
import { loadFacebookSdk } from "./facebook-sdk-web";
import { styles } from "../../../styles";


export class FacebookLogin extends RX.Component<FacebookLoginProps, { isLoggedIn: boolean }> {

    onLoginPress = async () => {
        try {
            await autoTimeout({
                timeoutErrorMessage: 'Timeout: Facebook Login',
                errorMessage: 'Error: Facebook Login',
            }, async () => {
                const fb = await loadFacebookSdk();
                const result = await fb.login();
                this.setState({
                    isLoggedIn: result.status === 'connected',
                });

                if (result.error) {
                    this.props.onError('Error: Facebook Login', result.error);
                } else if (result.status !== 'connected') {
                    this.props.onError('Error: Facebook Login', 'Not Connected');
                }
            });
        } catch (err) {
            this.props.onError('Error: Facebook Login', err);
        }
    };

    onLogoutPress = async () => {
        const fb = await loadFacebookSdk();
        const result = await fb.logout();
        this.setState({
            isLoggedIn: result.status === 'connected',
        });
    };

    render() {
        if (this.state.isLoggedIn === undefined) {
            setTimeout(async () => {
                try {
                    const fb = await loadFacebookSdk();
                    const result = await fb.getLoginStatus();
                    this.setState({
                        isLoggedIn: result.status === 'connected',
                    });
                }
                catch (err) {
                    this.setState({
                        isLoggedIn: false,
                    });
                }
            });
        }

        return (!this.state.isLoggedIn ? (
            <RX.Button style={styles.facebook_button} onPress={this.onLoginPress}>
                <FacebookIcon style={styles.facebook_icon} /> <RX.Text style={styles.facebook_button_text}>Continue with Facebook</RX.Text>
            </RX.Button>
        ) : (
                <RX.Button style={styles.facebook_button} onPress={this.onLogoutPress}>
                    <RX.Text style={styles.facebook_button_text}>Logout of Facebook</RX.Text>
                </RX.Button>
            ));
    }
};

class FacebookAccessClass implements FacebookAccessType {
    async getCurrentAccessToken(): Promise<string> {
        console.log('START FacebookAccessClass.getCurrentAccessToken()');


        const fb = await loadFacebookSdk();
        console.log('FacebookAccessClass.getCurrentAccessToken() loadedFacebookSdk');

        const result = await fb.getLoginStatus();
        console.log('FacebookAccessClass.getCurrentAccessToken() got login status');

        const token = result.status === 'connected' && result.authResponse.accessToken;

        console.log('END FacebookAccessClass.getCurrentAccessToken()', { token, result });
        return token || null;
    }
}

export const FacebookAccess = new FacebookAccessClass();
