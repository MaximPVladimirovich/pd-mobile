import * as React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { Recipe } from 'models/recipe/Recipe';
import { Pool } from 'models/Pool';
import { selectRecipe } from 'redux/recipeId/Actions';
import { dispatch, AppState } from 'redux/AppState';
import { Database } from 'repository/Database';

import { RecipeListItem } from './RecipeListItem';

interface RecipeListScreenProps {
    navigation: NavigationScreenProp<{}, {}>;

    // The id of the selected pool
    selectedPool?: Pool;
}

const mapStateToProps = (state: AppState, ownProps: RecipeListScreenProps): RecipeListScreenProps => {
    return {
        navigation: ownProps.navigation,
        selectedPool: state.selectedPool
    };
};

interface RecipeListScreenState {
    initialLoadFinished: boolean;
}

class RecipeListScreenComponent extends React.Component<RecipeListScreenProps, RecipeListScreenState> {
    pool!: Pool;
    recipes!: Realm.Results<Recipe>;

    constructor(props: RecipeListScreenProps) {
        super(props);

        this.state = {
            initialLoadFinished: false
        };
    }

    static navigationOptions = (navigation: any) => {
        const { state } = navigation;
        if (state === undefined) {
            return {};
        }
        const selectedPoolName = state.params.poolName;
        return { title: selectedPoolName };
    }

    componentDidMount() {
        // Fetch pool from persistent storage
        if (this.props.selectedPool !== null && this.props.selectedPool !== undefined) {
            this.pool = Database.loadPool(this.props.selectedPool);
            this.props.navigation.setParams({ poolName: this.pool.name });
        }
        this.recipes = Database.loadRecipes();

        this.setState({ initialLoadFinished: true });
    }

    handleRecipeSelected = (recipe: Recipe): void => {
        Database.commitUpdates(() => {
            this.pool.recipeId = recipe.objectId;
        });
        dispatch(selectRecipe(recipe));
        this.props.navigation.navigate('ReadingList');
    }

    render() {
        const recipes = (this.recipes === undefined) ? [] : this.recipes.map(p => p);
        return (
            <View style={styles.container}>
                <SectionList
                    style={{ flex: 1 }}
                    renderItem={({ item }) => <RecipeListItem recipe={item} onRecipeSelected={this.handleRecipeSelected} />}
                    renderSectionHeader={({ section }) => null}
                    sections={[
                        { data: recipes, title: 'Recipes' }
                    ]}
                    keyExtractor={item => (item as Recipe).objectId} />
            </View>
        );
    }
}

export const RecipeListScreen = connect(mapStateToProps)(RecipeListScreenComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#070D14'
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#005C9E',
        height: 45,
        margin: 15
    },
    editStyle: {
        margin: 5,
        marginRight: 10,
    }
});
