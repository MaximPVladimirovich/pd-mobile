import * as React from 'react';
import { RecipeKey } from '~/models/recipe/RecipeKey';
import { BuyScreen } from '~/screens/buy/BuyScreen';
import CustomTargetsScreen from '~/screens/customTargets/CustomTargetsScreen';
// TODO: change this back to EditPoolScreen when the  new edit pool screen is fully functional
import { EditPoolScreen } from '~/screens/editPool/EditPoolScreenOld';
import { PoolScreen } from '~/screens/pool/PoolScreen';
import { PoolListScreen } from '~/screens/poolList/PoolListScreen';
import { ReadingListScreen } from '~/screens/readings/ReadingListScreen';
import { RecipeListScreen } from '~/screens/recipes/RecipeListScreen';
import { RecipeScreen } from '~/screens/recipes/RecipeScreen';
import { SettingsScreen } from '~/screens/settings/SettingsScreen';
import { TreatmentListScreen } from '~/screens/treatments/TreatmentListScreen';
import { PoolHistoryScreen } from '~/screens/trends/PoolHistoryScreen';

import { createStackNavigator } from '@react-navigation/stack';

// This defines the navigation params accepted by each possible screen in PDCardNavigator
export type PDCardNavigatorParams = {
    PoolList: undefined;
    CreatePool: undefined;
    PoolScreen: undefined;
    EditPool: undefined;
    ReadingList: undefined;
    TreatmentList: undefined;
    Settings: undefined;
    RecipeList: { prevScreen: 'ReadingList' | 'PoolScreen' };
    RecipeDetails: { recipeKey: RecipeKey; prevScreen: 'ReadingList' | 'PoolScreen' };
    PoolHistory: undefined;
    Buy: undefined;
    CustomTargets: undefined;
};

const CardStack = createStackNavigator<PDCardNavigatorParams>();

export const PDCardNavigator = (): JSX.Element => {
    return (
        <CardStack.Navigator headerMode="none" mode="card">
            <CardStack.Screen name="PoolList" component={ PoolListScreen } />
            <CardStack.Screen name="CreatePool" component={ EditPoolScreen } />
            <CardStack.Screen name="PoolScreen" component={ PoolScreen } />
            <CardStack.Screen name="EditPool" component={ EditPoolScreen } />
            <CardStack.Screen name="ReadingList" component={ ReadingListScreen } />
            <CardStack.Screen name="TreatmentList" component={ TreatmentListScreen } />
            <CardStack.Screen name="RecipeList" component={ RecipeListScreen } />
            <CardStack.Screen name="RecipeDetails" component={ RecipeScreen } />
            <CardStack.Screen name="PoolHistory" component={ PoolHistoryScreen } />
            <CardStack.Screen name="Settings" component={ SettingsScreen } />
            <CardStack.Screen name="Buy" component={ BuyScreen } />
            <CardStack.Screen name="CustomTargets" component={ CustomTargetsScreen } />
            {/* <Stack.Screen name="PurchasePro" component={ PurchaseProStack } /> */ }
        </CardStack.Navigator>
    );
};