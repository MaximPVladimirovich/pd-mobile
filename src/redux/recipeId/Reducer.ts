import { AnyAction } from 'redux';

import { SelectRecipeAction, SELECT_RECIPE } from './Actions';

export const recipeIdReducer = (previousState: string | null = null, action: AnyAction): string | null => {
    switch (action.type) {
        case SELECT_RECIPE:
            const selectRecipeAction = action as SelectRecipeAction;
            return selectRecipeAction.recipe.objectId;
        default:
            return previousState;
    }
};