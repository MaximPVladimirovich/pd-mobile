import * as React from 'react';
import * as Yup from 'yup';
import { StyleSheet, TextInput } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { Formik } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER, USERNAME_CHECK } from '~/services/gql/AuthAPI';
import { checkUsername, checkUsernameVariables } from '~/services/gql/generated/checkUsername';
import { Register, RegisterVariables } from '~/services/gql/generated/Register';
import { AuthTextField } from './AuthTextField';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { SVG } from '~/assets/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ErrorParser } from './ErrorParser';
import { LinkText } from '~/components/misc/LinkText';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';

interface Values {
    email: string;
    username: string;
    password: string;
    password2: string;
}

const initialValues: Values = {
    email: '',
    username: '',
    password: '',
    password2: '',
};


export const LoginScreen: React.FC = () => {

    const theme = useTheme();
    const [checkUsernameMutation] = useMutation<checkUsername, checkUsernameVariables>(USERNAME_CHECK);
    const [register] = useMutation<Register, RegisterVariables>(REGISTER);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);
    const { navigate } = useNavigation<PDStackNavigationProps>();

    const emailRef = React.useRef<TextInput>(null);
    const usernameRef = React.useRef<TextInput>(null);
    const pwRef = React.useRef<TextInput>(null);
    const pw2Ref = React.useRef<TextInput>(null);

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(2, 'Username must be at least 2 characters')
            .matches(/^\w+$/, { message: 'Username can only contain letters, numbers, and underscore characters' })
            .test('checkUsernameUnique', 'Username is taken, try another', async username => {
                if (!username) { return true; }
                const result = await checkUsernameMutation({ variables: { username } });
                return result.data?.checkUsername?.available ?? false;
            })
            .required('Required'),
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .required('Required'),
    });

    const formikSubmit = async (values: Values) => {
        console.log('Submitting!');
        console.log(JSON.stringify(values));
        try {
            const res = await register({
                variables: {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                },
            });
            if (res?.data?.register?.id) {
                console.log('we did it!');
                // handleAuthSuccess(res.data.register);
            } else {
                // TODO: check errors
                // setErrorMessage(
                //     ErrorParser.getUserError(
                //         Util.firstOrNull(
                //             res?.errors
                //         )?.message ?? null
                //     )
                // );
            }
        } catch (e) {
            console.error(e);
            setErrorMessage(
                ErrorParser.getUserError(
                    JSON.stringify(e)
                )
            );
        }
    };

    const handleSIA = () => {
        // TODO: sign in with apple.
        console.log('sia!');
    };

    // const getMe = async () => {
    //     const res = await client.query<Me>({ query: ME });
    //     console.log(JSON.stringify(res));
    // };

    return <PDSafeAreaView forceInset={ { bottom: 'never' } } bgColor="white">

        <ScreenHeader hasBackButton color="blue" textType="nav">Sign In</ScreenHeader>
        <KeyboardAwareScrollView style={ { ...styles.scrollView, backgroundColor: theme.colors.background } } extraScrollHeight={ 65 }>
            <PDText type="content" color="greyDark" textAlign="center" style={ styles.headerText }>
                Login to your account
            </PDText>
            <Formik
                initialValues={ initialValues }
                validationSchema={ validationSchema }
                onSubmit={ formikSubmit }
                validateOnMount={ true }
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid, errors }) => {
                    console.log(JSON.stringify(errors));
                    console.log(`has submitted: ${hasSubmittedForm}`);
                    return <>
                        { errorMessage && <PDText type="content" color="red" textAlign="center">{errorMessage}</PDText>}
                        <AuthTextField
                            label="Email Or Username"
                            name="email"
                            type="email"
                            placeholder="Email or Username"
                            onBlur={ handleBlur('email') }
                            onChangeText={ handleChange('email') }
                            value={ values.email }
                            errorText={ hasSubmittedForm && errors.email }
                            ref={ emailRef }
                            nextRef={ usernameRef }
                            returnKeyType="next"
                            keyboardType="email-address" />
                        <AuthTextField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onBlur={ handleBlur('password') }
                            onChangeText={ handleChange('password') }
                            value={ values.password }
                            errorText={ hasSubmittedForm && errors.password }
                            secure
                            ref={ pwRef }
                            nextRef={ pw2Ref }returnKeyType="done"
                            onSubmit={ () => { setHasSubmittedForm(true); handleSubmit(); } } />
                        <ButtonWithChildren
                            onPress={ () => { setHasSubmittedForm(true); handleSubmit(); } }
                            styles={ [
                                { backgroundColor: (isValid || !hasSubmittedForm) ? theme.colors.blue : theme.colors.greyLight },
                                styles.buttonContainer,
                            ] }>
                                <PDText type="subHeading" color="alwaysWhite">Create Account</PDText>
                        </ButtonWithChildren>
                        {/* <button className={ styles.enterButton } type="submit">Create Account</button>
                        <div className={ styles.formInfo }>Already have an account? <Link href={ getLoginLink(props) }><a>Log in</a></Link></div> */}
                    </>;
                }}
            </Formik>
            <ButtonWithChildren
                onPress={ handleSIA }
                styles={ [
                    { backgroundColor: theme.colors.black },
                    styles.buttonContainer,
                ] }>
                    {
                        theme.isDarkMode
                        ? <SVG.IconAppleBlack height={ 21 } width={ 15 } style={ styles.buttonIcon } />
                        : <SVG.IconAppleWhite height={ 21 } width={ 15 } style={ styles.buttonIcon } />
                    }
                    <PDText type="subHeading" color="white">Sign In with Apple</PDText>
            </ButtonWithChildren>
            <LinkText spans={ [
                { text: "Don't have an account yet? " },
                { text: 'Create one now!', action: () => navigate('CreateAccount') },
            ] }/>

        </KeyboardAwareScrollView>
    </PDSafeAreaView>;

};


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding: PDSpacing.lg,
    },
    headerText: {
        marginBottom: PDSpacing.md,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: PDSpacing.xs,
        marginBottom: PDSpacing.xs,
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 27.5,
    },
    buttonIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: PDSpacing.xs,
    },
    terms: {
        marginVertical: PDSpacing.md,
    },
});
