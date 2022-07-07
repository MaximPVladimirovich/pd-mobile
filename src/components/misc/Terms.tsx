import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleProp, StyleSheet, TouchableHighlight, ViewStyle } from 'react-native';
import { PDStackNavigationProps } from '~/navigator/shared';
import { PDText, textStyles } from '../PDText';
import { useTheme } from '../PDTheme';
import { PDView } from '../PDView';

interface Props {
    type: 'subscribe' | 'account';
    containerStyles?: StyleProp<ViewStyle>;
}

export const PDTerms: React.FC<Props> = ({ type, containerStyles }) => {

    const { navigate } = useNavigation<PDStackNavigationProps>();
    const theme = useTheme();

    const handlePressedTerms = () => {
        navigate('TermsOfService');
    };

    const handlePressedPrivacy = () => {
        navigate('PrivacyPolicy');
    };

    const topText = (type === 'account')
        ? 'By creating an account, you agree to our'
        : 'By subscribing, you agree to our';

    const plainTextStyles = (type === 'account')
        ? textStyles.tooltip
        : styles.termsTextAccount;

    const linkTextStyles = (type === 'account')
        ? { ...textStyles.tooltip, color: theme.colors.blue }
        : styles.termsLink;

    return (
        <PDView style={ [styles.termsContainer, containerStyles] }>
            <PDText type="default" color="black" style={ plainTextStyles }>
                { topText }
                {' '}
            </PDText>
            <TouchableHighlight
                underlayColor="transparent"
                onPress={ handlePressedTerms }>
                <PDText type="default" style={ linkTextStyles }>
                    Terms of Service
                </PDText>
            </TouchableHighlight>
            <PDText type="default" style={ plainTextStyles }>
                {' '}
                and
                {' '}
            </PDText>
            <TouchableHighlight
                underlayColor="transparent"
                onPress={ handlePressedPrivacy }>
                <PDText type="default" style={ linkTextStyles }>
                    Privacy Policy
                </PDText>
            </TouchableHighlight>
        </PDView>
    );
};

const styles = StyleSheet.create({
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    termsTextAccount: {
        fontSize: 14,
    },
    termsLink: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
