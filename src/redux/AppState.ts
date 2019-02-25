import { createStore } from 'redux';

import { InputEntry } from '../models/recipe/InputEntry';
import { OutputEntry } from '../models/recipe/OutputEntry';
import { Pool } from '../models/Pool';
import { readingsReducer } from './Reducers';

// Describes the shape of the application redux state.
export interface AppState {
    // All of the readings that a user has recorded
    inputs: InputEntry[];

    // All of the outputs currently perscribed
    outputs: OutputEntry[];

    // The currently selected swimming pool, if any
    selectedPool?: Pool;

    // The currently selected recipe, if any
    recipeId?: string;

    // This increments whenever we update the list of pools
    poolsLastUpdated: number;
}

const initialAppState: AppState = {
    inputs: [],
    outputs: [],
    poolsLastUpdated: 0,
    recipeId: '002_initial_big3'
};

export const store = createStore(readingsReducer, initialAppState);

export const dispatch = store.dispatch;