import * as React from 'react';
import { View, StyleSheet, Image, NativeSyntheticEvent, TextInputEndEditingEventData, TextStyle } from 'react-native';
// import Slider from '@react-native-community/slider';
// @ts-ignore
import Slider from 'react-native-slider';

import { PDText } from '../../components/PDText';
import { Reading } from '../../models/recipe/Reading';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';

import { images } from '~/assets/images';
import { TextInput } from 'react-native-gesture-handler';

export interface ReadingState {
    reading: Reading;
    value?: string;
    isOn: boolean;
}

interface ReadingListItemProps {
    readingState: ReadingState;
    onSlidingStart: () => void;
    onSlidingComplete: (varName: string) => void;
    onSliderUpdatedValue: (varName: string, value: number) => void;
    onTextboxUpdated: (varName: string, text: string) => void;
    onTextboxFinished: (varName: string, text: string) => void;
    handleIconPressed: (varName: string) => void;
    inputAccessoryId?: string;
}

export const ReadingListItem: React.FunctionComponent<ReadingListItemProps> = (props) => {

    const [isSliding, setIsSliding] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);

    const isEditing = isSliding || textIsEditing;

    const rs = props.readingState;
    const r = rs.reading;

    const readingTaken = rs.isOn;
    const leftImageSource = readingTaken
        ? images.greenCheck
        : images.incomplete;

    // The continuous slider would glitch around very slightly when dragging because of
    // how we're updating the rs.value prop. The steps mitigate this, and also are more precise.
    const sliderStep = Math.pow(10, -r.decimalPlaces);

    // Keep the slider in range sliderMin <= x <= sliderMax
    let sliderValue = (rs.value) ? parseFloat(rs.value) : 0;
    sliderValue = Math.max(Math.min(sliderValue, r.sliderMax), r.sliderMin);

    let readingNameText = r.name;
    if (r.units) {
        readingNameText = `${r.name} (${r.units})`;
    }

    const textInputStyles: TextStyle[] = [styles.textInput];
    if (!rs.isOn && !isEditing) {
        textInputStyles.push(styles.textInputDisabled);
    };

    const onTextBeginEditing = () => {
        setTextIsEditing(true);
    };

    const onTextChange = (newText: string) => {
        props.onTextboxUpdated(r.variableName, newText);
    };

    const onTextEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        setTextIsEditing(false);
        const finalText = event.nativeEvent.text;
        props.onTextboxFinished(r.variableName, finalText);
    };

    const onSliderStart = () => {
        setIsSliding(true);
        props.onSlidingStart();
    };

    const onSliderEnd = () => {
        setIsSliding(false);
        props.onSlidingComplete(r.variableName);
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                <View style={ styles.topRow }>
                    <TouchableScale
                        onPress={ () => props.handleIconPressed(r.variableName) }
                        activeScale={ 1.2 }
                        hitSlop={ { left: 25, right: 25, top: 25, bottom: 25 } }>
                        <Image
                            style={ styles.circleImage }
                            source={ leftImageSource }
                            width={ 28 }
                            height={ 28 } />
                    </TouchableScale>
                    <PDText style={ styles.readingName }>{ readingNameText }</PDText>
                    <TextInput
                        style={ textInputStyles }
                        onFocus={ onTextBeginEditing }
                        onChangeText={ onTextChange }
                        onEndEditing={ onTextEndEditing }
                        keyboardType={ 'decimal-pad' }
                        inputAccessoryViewID={ props.inputAccessoryId }>
                        { rs.value }
                    </TextInput>
                </View>
                <Slider
                    style={ styles.slider }
                    minimumValue={ r.sliderMin }
                    maximumValue={ r.sliderMax }
                    minimumTrackTintColor="#E3E3E3"
                    maximumTrackTintColor="#E3E3E3"
                    thumbImage={ images.sliderThumb }
                    onSlidingStart={ onSliderStart }
                    onSlidingComplete={ onSliderEnd }
                    onValueChange={ (value: number) => props.onSliderUpdatedValue(r.variableName, value) }
                    value={ sliderValue }
                    step={ sliderStep }
                    thumbTouchSize={ { width: 75, height: 55 } }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignContent: 'stretch',
        borderRadius: 10
    },
    content: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.11,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 12,
        marginHorizontal: 16
    },
    topRow: {
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 3
    },
    slider: {
        flex: 1,
        marginHorizontal: 12,
        marginBottom: 6
    },
    circleImage: {
        marginRight: 10
    },
    readingName: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlignVertical: 'center',
        marginTop: 3
    },
    textInput: {
        width: 80,
        borderWidth: 2,
        borderColor: '#F8F8F8',
        borderRadius: 6,
        color: '#3910E8',
        fontFamily: 'Avenir Next',
        fontWeight: '600',
        fontSize: 22,
        textAlign: 'center'
    },
    textInputDisabled: {
        color: '#BEBEBE'
    }
});