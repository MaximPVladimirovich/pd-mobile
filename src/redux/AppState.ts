import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';
import { Pool } from '~/models/Pool';
import { User } from '~/models/User';
import { PickerState } from './picker/PickerState';

import { hasValidSubscriptionReducer } from './hasValidSubscription/Reducer';
import { outputsReducer } from './outputs/Reducer';
import { poolsLastUpdatedReducer } from './poolsLastUpdated/Reducer';
import { readingEntriesReducer } from './readingEntries/Reducer';
import { recipeKeyReducer } from './recipeKey/Reducer';
import { selectedPoolReducer } from './selectedPool/Reducer';
import { pickerStateReducer } from './picker/Reducer';
import { userReducer } from './user/Reducer';
import { DeviceSettings } from '~/models/DeviceSettings';
import { DeviceSettingsService } from '~/services/DeviceSettingsService';
import { deviceSettingsReducer } from './deviceSettings/Reducer';
import { RecipeKey } from '~/models/recipe/RecipeKey';

// Describes the shape of the application redux state.
export interface AppState {
    // All of the readings that a user has recorded
    readingEntries: ReadingEntry[];

    // All of the outputs currently perscribed
    outputs: TreatmentEntry[];

    // The currently selected swimming pool, if any
    selectedPool: Pool | null;

    // The currently selected recipe, if any
    recipeKey: RecipeKey;

    // This increments whenever we update the list of pools
    poolsLastUpdated: number;

    // User object including cognito user returned after user signs in
    user: User | null;

    // Whether or not the user has a valid subscription
    hasValidSubscription: boolean;

    // The most recent value from any picker screen
    pickerState: PickerState | null;

    // The device settings:
    deviceSettings: DeviceSettings;
}

const initialAppState: AppState = {
    readingEntries: [],
    outputs: [],
    selectedPool: null,
    recipeKey: '002_initial_big3|1234',
    poolsLastUpdated: 0,
    user: null,
    hasValidSubscription: false,
    pickerState: null,
    deviceSettings: DeviceSettingsService.getDefaultSettings()
};

const reducer = combineReducers({
    readingEntries: readingEntriesReducer,
    outputs: outputsReducer,
    selectedPool: selectedPoolReducer,
    recipeKey: recipeKeyReducer,
    poolsLastUpdated: poolsLastUpdatedReducer,
    user: userReducer,
    hasValidSubscription: hasValidSubscriptionReducer,
    pickerState: pickerStateReducer,
    deviceSettings: deviceSettingsReducer
});

// apply all middleware for application
const middleware = applyMiddleware(ReduxThunk);

// TODO: fix as any on next line?
export const store = createStore(reducer, initialAppState as any, middleware);

export const dispatch = store.dispatch;
