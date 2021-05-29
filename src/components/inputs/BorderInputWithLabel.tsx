import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { PDText } from '../PDText';
import { PDView } from '../PDView';

interface BorderInputWithLabel extends TextInputProps {
    label: string;
    labelStyleProps?: TextStyle | TextStyle[];
    textInputStyleProps?: TextStyle | TextStyle[];
    containerStyles?: ViewStyle;
}

const BorderInputWithLabel = React.forwardRef<TextInput, BorderInputWithLabel>((props, ref) => {
    const { label, labelStyleProps, textInputStyleProps, ...restTextInputProps } = props;
    const defaultStyle = { ...styles.textInput, ...textInputStyleProps };

    return (
        <PDView style={ props.containerStyles }>
            <PDText type="bodyGreyBold" color="grey" style={ labelStyleProps }>
                {label}
            </PDText>
            <TextInput
                ref={ ref }
                style={ defaultStyle }
                placeholderTextColor="#BBBBBB"
                blurOnSubmit
                allowFontScaling
                maxFontSizeMultiplier={ 1.4 }
                { ...restTextInputProps }
            />
        </PDView>
    );
});

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#F0F0F0',
        borderWidth: 2,
        borderRadius: 6,
        paddingVertical: 8,
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        color: '#1E6BFF',
        paddingLeft: 8,
        minWidth: 100,
    },
});

export default BorderInputWithLabel;
