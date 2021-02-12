import { CustomTarget } from '~/models/recipe/CustomTarget';
import { Recipe } from '~/models/recipe/Recipe';
import { AppState } from '~/redux/AppState';

import { createSelector } from '@reduxjs/toolkit';

const getSelectedPoolAndCurrentRecipe = (state: AppState, props: Recipe | null) => ({
    pool: state.selectedPool,
    recipe: props,
});

export const getCustomTargetsBySelectedPool = createSelector([getSelectedPoolAndCurrentRecipe], ({ pool, recipe }) => {
    const customTargets =
        recipe?.custom?.map((customTarget) => ({
            ...customTarget,
            defaults: customTarget.defaults.filter((cs) => cs.waterType === pool?.waterType),
        })) ?? [];

    return customTargets as CustomTarget[];
});