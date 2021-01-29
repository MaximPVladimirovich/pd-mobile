import * as React from 'react';
import {
    View,
    StyleSheet,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
    InputAccessoryView,
    Keyboard,
} from 'react-native';
// import Slider from '@react-native-community/slider';
// @ts-ignore
import Slider from 'react-native-slider';

import { PDText } from '../../components/PDText';
import { images } from '~/assets/images';
import { TextInput } from 'react-native-gesture-handler';
import { BoringButton } from '~/components/buttons/BoringButton';
import { Haptic } from '~/services/HapticService';
import { PlatformSpecific } from '~/components/PlatformSpecific';

export interface PickerSliderState {
    value?: string;
}

interface PickerSliderProps {
    sliderState: PickerSliderState;
    onSlidingStart: () => void;
    onSlidingComplete: () => void;
    onSliderUpdatedValue: (value: number) => void;
    onTextboxUpdated: (text: string) => void;
    onTextboxFinished: (text: string) => void;
}

export const PickerSlider: React.FunctionComponent<PickerSliderProps> = (props) => {
    const [isSliding, setIsSliding] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);

    const isEditing = isSliding || textIsEditing;
    const keyboardAccessoryViewId = 'picker-percent-keyboard-accessory-view-id';

    const rs = props.sliderState;

    // The continuous slider would glitch around very slightly when dragging because of
    // how we're updating the rs.value prop. The steps mitigate this, and also are more precise.
    const sliderStep = 1;
    const sliderMin = 1;
    const sliderMax = 100;

    // Keep the slider in range sliderMin <= x <= sliderMax
    let sliderValue = rs.value ? parseInt(rs.value) : sliderMin;
    sliderValue = Math.max(Math.min(sliderValue, sliderMax), sliderMin);

    const onTextBeginEditing = () => {
        setTextIsEditing(true);
    };

    const onTextChange = (newText: string) => {
        props.onTextboxUpdated(newText);
    };

    const onTextEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        setTextIsEditing(false);
        const finalText = event.nativeEvent.text;
        props.onTextboxFinished(finalText);
    };

    const onSliderStart = () => {
        setIsSliding(true);
        props.onSlidingStart();
    };

    const onSliderEnd = () => {
        setIsSliding(false);
        props.onSlidingComplete();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={styles.topRowContent}>
                        <TextInput
                            style={styles.textInput}
                            onFocus={onTextBeginEditing}
                            onChangeText={onTextChange}
                            onEndEditing={onTextEndEditing}
                            keyboardType={'number-pad'}
                            inputAccessoryViewID={keyboardAccessoryViewId}>
                            {rs.value}
                        </TextInput>
                        <PDText style={styles.unitsText}>%</PDText>
                    </View>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={sliderMin}
                    maximumValue={sliderMax}
                    minimumTrackTintColor="#E3E3E3"
                    maximumTrackTintColor="#E3E3E3"
                    thumbImage={images.sliderThumbBlue}
                    onSlidingStart={onSliderStart}
                    onSlidingComplete={onSliderEnd}
                    onValueChange={(value: number) => props.onSliderUpdatedValue(value)}
                    value={sliderValue}
                    step={sliderStep}
                    thumbTouchSize={{ width: 55, height: 55 }}
                />
            </View>
            <PlatformSpecific include={['ios']}>
                <InputAccessoryView nativeID={keyboardAccessoryViewId}>
                    <View style={styles.keyboardAccessoryContainer}>
                        <BoringButton
                            containerStyles={styles.keyboardAccessoryButton}
                            textStyles={styles.keyboardAccessoryButtonText}
                            onPress={() => {
                                Keyboard.dismiss();
                                Haptic.light();
                            }}
                            title="Save"
                        />
                    </View>
                </InputAccessoryView>
            </PlatformSpecific>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        alignContent: 'stretch',
        borderRadius: 10,
        marginTop: 22,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 24,
        borderColor: '#F0F0F0',
        borderWidth: 2,
        elevation: 2,
        marginBottom: 6,
        marginHorizontal: 16,
    },
    topRow: {
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 3,
        marginBottom: 8,
        justifyContent: 'center',
    },
    topRowContent: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    slider: {
        flex: 1,
        marginHorizontal: 12,
        marginBottom: 12,
    },
    textInput: {
        width: 80,
        borderWidth: 2,
        borderColor: '#F8F8F8',
        borderRadius: 6,
        color: '#1E6BFF',
        fontFamily: 'Avenir Next',
        fontWeight: '600',
        fontSize: 22,
        textAlign: 'center',
    },
    unitsText: {
        color: '#1E6BFF',
        fontSize: 22,
        textAlignVertical: 'center',
        marginLeft: 6,
    },
    keyboardAccessoryContainer: {
        backgroundColor: '#F8F8F8',
        padding: 12,
    },
    keyboardAccessoryButton: {
        backgroundColor: '#1E6BFF',
        marginHorizontal: 24,
    },
    keyboardAccessoryButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
