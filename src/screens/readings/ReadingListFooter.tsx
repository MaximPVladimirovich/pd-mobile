import * as React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { PDText } from '~/components/PDText';
import { Recipe } from '~/models/recipe/Recipe';

interface ReadingListFooterProps {
    recipe: Recipe | null;
}

export const ReadingListFooter: React.FunctionComponent<ReadingListFooterProps> = (props) => {

    const [isChangeButtonPressed, setIsChangeButtonPressed] = React.useState(false);

    if (!props.recipe) { return <></>; }

    const changeButtonStyles = isChangeButtonPressed
        ? styles.recipeLinkPressed
        : styles.recipeLinkNormal;

    return (
        <View style={ styles.container }>
            <View style={ styles.topRow }>
                <PDText style={ styles.changeRecipeIntro }> Want different readings? </PDText>
                <TouchableHighlight
                    underlayColor={ 'transparent' }
                    onPressIn={ () => setIsChangeButtonPressed(true) }
                    onPressOut={ () => setIsChangeButtonPressed(false) }
                    onPress={ () => console.log('yo') }>

                    <PDText
                        style={ changeButtonStyles }>

                        Change recipe.
                    </PDText>
                </TouchableHighlight>
            </View>
            <PDText style={ styles.recipeNameIntroText }>
                Current recipe: <PDText style={ styles.recipeNameText } >
                    { props.recipe.name }
                </PDText>
            </PDText>
            <PDText style={ styles.recipeDescriptionText }>
                { props.recipe.description }
            </PDText>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginHorizontal: 16,
        marginBottom: 40,
        backgroundColor: 'transparent'
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    changeRecipeIntro: {
        color: 'rgba(0,0,0,.6)',
        fontSize: 18
    },
    recipeLinkPressed: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 18
    },
    recipeLinkNormal: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    recipeNameIntroText: {
        color: 'rgba(0,0,0,.6)',
        fontSize: 18,
        marginTop: 24
    },
    recipeNameText: {
        color: 'rgba(0,0,0,.6)',
        fontWeight: '600',
        fontSize: 18
    },
    recipeDescriptionText: {
        color: 'rgba(0,0,0,.6)',
        fontSize: 18,
        marginTop: 12
    }
});