import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { connect, DispatchProp } from 'react-redux';

import { images } from 'assets/images';
import { BackButton } from 'components/buttons/BackButton';
import { DismissStackButton } from 'components/buttons/DismissStackButton';
import { TextButton } from 'components/buttons/TextButton';
import { PDText } from 'components/PDText';
import { SeparatorLine } from 'components/SeparatorLine';
import { TextInputWithTitle } from 'components/TextInputWithTitle';
import { User } from 'models/User';
import { updateUserAction } from 'redux/user/Actions';
import { AppState } from 'redux/AppState';
import { CognitoService } from 'services/CognitoService';

interface RegistrationVerificationProps {
    navigation: NavigationScreenProp<any>;
    user: User;
}

type RegistrationVerificationCombinedProps = RegistrationVerificationProps & DispatchProp<any>;

interface RegistrationVerificationState {
    confirmationCode: string;
}

class RegistrationVerificationComponent extends
    React.PureComponent<RegistrationVerificationCombinedProps, RegistrationVerificationState> {
    private cognitoService: CognitoService;

    constructor (props: RegistrationVerificationCombinedProps) {
        super(props);

        this.state = { confirmationCode: '' };

        this.cognitoService = new CognitoService();
    }

    onConfirmationCodeChanged = (code: string): void => {
        this.setState({ confirmationCode: code });
    }

    handleConfirmationCodeEntered = async (): Promise<void> => {
        const email = this.props.navigation.getParam('email');
        const cognitoUser = this.props.user.auth.cognitoUser;
        if (!email) {
            // some error occurred - lets take them back to register and try again
        }
        const registrationConfirmed = await this.cognitoService.confirmRegistration(this.state.confirmationCode, email);

        if (registrationConfirmed) {
            // Authenticate user using props.user
            const password = this.props.navigation.getParam('password');
            const session = await this.cognitoService.authenticateUser(email, password);
            console.warn('session after register & auth - ', session);

            const firstNameAttribute = await this.cognitoService.getUserAttribute('given_name', cognitoUser);
            const lastNameAttribute = await this.cognitoService.getUserAttribute('family_name', cognitoUser);

            const name = `${firstNameAttribute.getValue()} ${lastNameAttribute.getValue()}`;
            console.warn('name - ', name);

            // save session in app state
            this.props.dispatch(updateUserAction({ email, auth: { cognitoUser } }));

            // navigate to confirm purchase
            this.props.navigation.navigate('ConfirmPurchase', {
                prevScreen: 'RegistrationVerification',
                email,
                name
            });
        }
    }

    handleBackPressed = (): void => {
        this.props.navigation.goBack();
    }

    handleDismissPressed = (): void => {
        this.props.navigation.navigate('PoolScreen');
    }

    render () {
        return (
            <SafeAreaView style={styles.safeAreaContainer} forceInset={{ bottom: 'never', top: 'never' }}>
                <Image source={images.blueAuthenticationBackground} resizeMode={'cover'} style={styles.backgroundImage}/>
                <LinearGradient
                    colors={['black', 'transparent']}
                    locations={[0.67, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientBackground} >
                <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                    <View>
                        <View style={styles.titleContainer}>
                        <View style={styles.navButtonContainer}>
                            <BackButton
                                title={''}
                                imageSource={images.backWhite}
                                handleBackPressed={this.handleBackPressed} />
                            <DismissStackButton handleBackPressed={this.handleDismissPressed}/>
                        </View>
                            <Image source={images.pdProTitle} />
                        </View>
                        <PDText style={styles.title}>{'Confirm Account'}</PDText>
                        <SeparatorLine lineStyles={styles.horizontalPadding} />
                        <View style={styles.formContainer}>
                            <TextInputWithTitle
                                autoCorrect={false}
                                inputStyles={{ color: '#50b4ff' }}
                                titleTextStyles={styles.inputTitleText}
                                titleText={'Confirmation Code'}
                                onTextChanged={this.onConfirmationCodeChanged} />
                        </View>
                        <TextButton
                            text={'Continue'}
                            onPress={this.handleConfirmationCodeEntered}
                            containerStyles={styles.mainAuthButton}
                            textStyles={styles.mainAuthButtonText} />
                        <Text style={styles.resendConfirmationCodeText}>Did not receive the confirmation code?</Text>
                    </View>
                </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    container: {
        paddingTop: 30,
        paddingHorizontal: 20,
        width: '100%'
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
        paddingBottom: 5,
        fontFamily: 'Avenir Next'
    },
    horizontalPadding: {
        marginHorizontal: 15
    },
    formContainer: {
        marginHorizontal: 15,
        paddingTop: 30
    },
    inputTitleText: {
        color: 'white',
        fontFamily: 'Avenir Next',
        fontSize: 22,
        fontWeight: '600'
    },
    mainAuthButton: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 15
    },
    mainAuthButtonText: {
        color: 'black',
        paddingVertical: 15,
        fontFamily: 'Avenir Next',
        fontSize: 22
    },
    resendConfirmationCodeText: {
        color: '#9b9b9b',
        fontFamily: 'Avenir Next',
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 15,
        fontWeight: '500'
    },
});

const mapStateToProps = (state: AppState, ownProps: RegistrationVerificationProps): RegistrationVerificationProps => {
    return {
        navigation: ownProps.navigation,
        user: state.user
    };
};

export const RegistrationVerificationScreen = connect(mapStateToProps)(RegistrationVerificationComponent);