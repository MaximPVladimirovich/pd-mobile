import { CognitoUser } from 'amazon-cognito-identity-js';
import * as React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationScreenProp } from 'react-navigation';
import { connect, DispatchProp } from 'react-redux';

import { images } from 'assets/images';
import { BackButton } from 'components/buttons/BackButton';
import { DismissStackButton } from 'components/buttons/DismissStackButton';
import { TextButton } from 'components/buttons/TextButton';
import { PDText } from 'components/PDText';
import { SeparatorLine } from 'components/SeparatorLine';
import { TextInputWithTitle } from 'components/TextInputWithTitle';
import { updateValidSubscription } from 'redux/hasValidSubscription/Actions';
import { updateUserAction } from 'redux/user/Actions';
import { AppState } from 'redux/AppState';
import { CognitoService } from 'services/CognitoService';
import { InAppPurchasesService, PurchaserInfo } from 'services/InAppPurchasesService';

interface AuthenticationProps {
    /**  */
    navigation: NavigationScreenProp<any>;
}

type AuthenticationCombinedProps = AuthenticationProps & DispatchProp<any>;

interface AuthenticationState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmationCode: string;
    screenType: 'Login' | 'Register';
}

class AuthenticationComponent extends React.PureComponent<AuthenticationCombinedProps, AuthenticationState> {
    private cognitoService: CognitoService;

    constructor (props: AuthenticationCombinedProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmationCode: '',
            screenType: props.navigation.getParam('screenType')
        };
        this.cognitoService = new CognitoService();
    }

    componentDidMount () {
        const screenType = this.props.navigation.getParam('screenType');
        this.setState({ screenType: screenType });
    }

    onFirstNameChanged = (firstName: string): void => {
        this.setState({ firstName });
    }

    onLastNameChanged = (lastName: string): void => {
        this.setState({ lastName });
    }

    onEmailChanged = (email: string): void => {
        this.setState({ email });
    }

    onPasswordChanged = (password: string): void => {
        this.setState({ password });
    }

    handleAuthButtonPressed = async (): Promise<void> => {
        const { email, password} = this.state;
        if (this.isLogin()) {
            const authenticationSuccess = await this.cognitoService.authenticateUser(email, password);

            if (!authenticationSuccess) {
                Alert.alert('Error logging in', 'An error occurred while logging in. Please try again.');
                return;
            }

            const cognitoUser: CognitoUser = authenticationSuccess.cognitoUser;
            const firstNameAttribute = await this.cognitoService.getUserAttribute('given_name', cognitoUser);
            const lastNameAttribute = await this.cognitoService.getUserAttribute('family_name', cognitoUser);
            // save session in app state
            const user = {
                email,
                firstName: firstNameAttribute.getValue(),
                lastName: lastNameAttribute.getValue(),
                auth: {
                    cognitoSession: authenticationSuccess.cognitoSession,
                    cognitoUser
                }
            };
            this.props.dispatch(updateUserAction(user));

            // configure purchases
            await InAppPurchasesService.configureInAppPurchasesProvider(authenticationSuccess.cognitoUser.getUsername(), (info: PurchaserInfo) => {
                // handle any changes to purchaserInfo
                console.warn('user purchase info updated', info);
                if (info.activeEntitlements.length !== 0) {
                    this.props.dispatch(updateValidSubscription(true));
                }
            });

            // navigate to confirm purchase
            const name = `${firstNameAttribute.getValue()} ${lastNameAttribute.getValue()}`;
            this.props.navigation.navigate('ConfirmPurchase', { prevScreen: 'Authentication', email, name });
        } else {
            this.registerUser();
        }
    }

    handleSwitchAuthButtonPressed = (): void => {
        const isLogin = this.isLogin();
        this.setState({ screenType: isLogin ? 'Register' : 'Login' });
    }

    handleBackPressed = (): void => {
        this.props.navigation.goBack();
    }

    handleDismissPressed = (): void => {
        this.props.navigation.navigate('PoolScreen');
    }

    private registerUser = async () => {
        const { firstName, lastName, email, password } = this.state;

        const cognitoUser = await this.cognitoService.registerUser(firstName, lastName, email, password);
        console.warn('should be called after register success');
        if (cognitoUser) {
            this.props.navigation.navigate('RegistrationVerification',
                {
                    email,
                    password
                }
            );
        } else {
            Alert.alert('Error while registering', 'An error occurred during the registration process. Please try again.');
        }
    }

    private getEmailInput = (themeColor: string): any => {
        return (
            <TextInputWithTitle
                inputStyles={{ color: themeColor }}
                autoCorrect={false}
                autoCapitalize={'none'}
                key={'email input'}
                titleTextStyles={styles.inputTitleText}
                titleText={'Email'}
                keyboardType={'email-address'}
                onTextChanged={this.onEmailChanged} />
        );
    }

    private getPasswordInput = (themeColor: string): any => {
        return (
            <TextInputWithTitle inputStyles={{ color: themeColor }} key={'password input'} autoCorrect={false} secureTextEntry={true} titleTextStyles={styles.inputTitleText} titleText={'Password'} onTextChanged={this.onPasswordChanged} />
        );
    }

    private getRegisterInputs = (themeColor: string): any => {
        const nameInputs = (
            <View key={'nameInputs'}>
                <TextInputWithTitle inputStyles={{ color: themeColor }} autoCorrect={false} titleTextStyles={styles.inputTitleText} titleText={'First Name'} onTextChanged={this.onFirstNameChanged} />
                <TextInputWithTitle inputStyles={{ color: themeColor }} autoCorrect={false} titleTextStyles={styles.inputTitleText} titleText={'Last Name'} onTextChanged={this.onLastNameChanged} />
            </View>
        );
        return [nameInputs, this.getEmailInput(themeColor), this.getPasswordInput(themeColor)];
    }

    private getLoginInputs = (themeColor: string): any => {
        return [this.getEmailInput(themeColor), this.getPasswordInput(themeColor)];
    }

    private isLogin = (): boolean => {
        return this.state.screenType === 'Login';
    }

    render () {
        const isLogin = this.isLogin();
        const screenThemeColor = isLogin ? '#00c89f' : '#50b4ff';
        const inputs = isLogin ? this.getLoginInputs(screenThemeColor) : this.getRegisterInputs(screenThemeColor);
        const switchAuthButtonText = isLogin ? 'Login' : 'Create account';
        const backgroundImage = isLogin ? images.greenAuthenticationBackground : images.blueAuthenticationBackground;
        const secondaryActionPromptText = isLogin ? `Don't have an account yet?` : `Already have an account?`;
        const secondaryButtonText = isLogin ? 'Create Account' : 'Login';
        return (
            <View style={styles.container}>
                <Image source={backgroundImage} resizeMode={'cover'} style={styles.backgroundImage}/>
                <LinearGradient
                    colors={['black', 'transparent']}
                    locations={[0.67, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientBackground} >
                    <ScrollView style={styles.contentContainer} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                        <View>
                            <View style={styles.titleContainer}>
                            <View style={styles.navButtonContainer}>
                                <BackButton title={''} imageSource={images.backWhite} onPress={this.handleBackPressed} />
                                <DismissStackButton handleBackPressed={this.handleDismissPressed}/>
                            </View>
                                <Image source={images.pdProTitle} />
                            </View>
                            <PDText style={styles.title}>{this.state.screenType}</PDText>
                            <SeparatorLine lineStyles={styles.horizontalPadding} />
                            <View style={styles.formContainer}>
                                { inputs }
                            </View>
                            <TextButton
                                    text={switchAuthButtonText}
                                    onPress={this.handleAuthButtonPressed}
                                    containerStyles={[styles.mainAuthButton, { backgroundColor: screenThemeColor} ]}
                                    textStyles={styles.mainAuthButtonText} />
                            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                        </View>
                        <View style={styles.createAccountContainer}>
                                <Text style={styles.noAccountText}>{secondaryActionPromptText}</Text>
                                <TextButton
                                    text={secondaryButtonText}
                                    onPress={this.handleSwitchAuthButtonPressed}
                                    containerStyles={styles.createAccountButton}
                                    textStyles={styles.mainAuthButtonText} />
                        </View>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%'
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    gradientBackground: {
        flex: 1,
        height: '100%'
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        flex: 1,
        height: '100%'
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 50
    },
    navButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 15
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        paddingBottom: 5
    },
    horizontalPadding: {
        marginHorizontal: 15
    },
    formContainer: {
        marginHorizontal: 15,
        paddingTop: 30
    },
    input: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        marginBottom: 15,
        fontFamily: 'Avenir Next',
        fontSize: 18,
        paddingHorizontal: 5
    },
    inputTitleText: {
        color: 'white',
        fontFamily: 'Avenir Next',
        fontSize: 22,
        fontWeight: '600'
    },
    createAccountContainer: {
        position: 'absolute',
        bottom: 15,
        justifyContent: 'center',
        width: '100%'
    },
    noAccountText: {
        color: 'white',
        fontFamily: 'Avenir Next',
        fontSize: 18,
        fontWeight: '700',
        paddingLeft: 20
    },
    mainAuthButton: {
        paddingHorizontal: 20,
        backgroundColor: '#00c89f',
        borderRadius: 8,
        marginTop: 15
    },
    mainAuthButtonText: {
        color: 'black',
        paddingVertical: 15,
        fontFamily: 'Avenir Next',
        fontSize: 22
    },
    forgotPasswordText: {
        color: '#9b9b9b',
        fontFamily: 'Avenir Next',
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 15,
        fontWeight: '500'
    },
    createAccountButton: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 8
    }
});

const mapStateToProps = (_: AppState, ownProps: AuthenticationProps): AuthenticationProps => {
    return {
        navigation: ownProps.navigation
    };
};

export const AuthenticationScreen = connect(mapStateToProps)(AuthenticationComponent);