import * as React from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { PDNavStackParamList } from '~/navigator/Navigators';
import { Pool } from '~/models/Pool';
import { saveNewPool, updatePool } from '~/redux/selectedPool/Actions';
import { dispatch, AppState } from '~/redux/AppState';
import { selectPool } from '~/redux/selectedPool/Actions';
import { Database } from '~/repository/Database';
import { PoolDetails } from '~/screens/editPool/PoolDetails';
import { PDPickerRouteProps } from '../picker/PickerScreen';
import { PickerState } from '~/redux/picker/PickerState';
import { updatePickerState } from '~/redux/picker/Actions';
import { WaterTypeValue, waterTypeOptions } from '~/models/Pool/WaterType';

interface EditPoolScreenProps {
    navigation: StackNavigationProp<PDNavStackParamList, 'EditPool'>;
    selectedPool: Pool | null;
    pickerState: PickerState | null;
}

const mapStateToProps = (state: AppState, ownProps: EditPoolScreenProps): EditPoolScreenProps => {
    return {
        navigation: ownProps.navigation,
        selectedPool: state.selectedPool,
        pickerState: state.pickerState
    };
};

export const EditPoolComponent: React.FunctionComponent<EditPoolScreenProps> = (props: EditPoolScreenProps) => {

    const pool = props.selectedPool;
    const originalSelectedPoolName = pool?.name;
    const [name, updateName] = React.useState(pool?.name || '');
    const [type, updateType] = React.useState(pool?.waterType || 'salt_water');
    const [volumeText, updateVolumeText] = React.useState(`${pool?.gallons || ''}`);
    // TODO: metric switch

    // Only do this on first load?
    React.useEffect(() => {
        const { pickerState } = props;
        if (pickerState && pickerState.key === 'water_type' && pickerState.value !== null) {
            const selectedType = pickerState.value as WaterTypeValue;
            updateType(selectedType);
            dispatch(updatePickerState(null));
        }
    });

    const { navigate, goBack } = useNavigation();

    const handleDeletePoolPressed = async () => {
        if (pool === undefined || pool === null) {
            return;
        }
        Database.deletePool(pool);
        dispatch(selectPool(null));
        navigate('PoolList');
    }

    const handleSaveButtonPressed = () => {
        if (pool) {
            const updatedPool = { ...pool };
            // TODO: worry about gallons vs liters
            updatedPool.gallons = Number(volumeText);
            updatedPool.name = name;
            updatedPool.waterType = type;
            dispatch(updatePool(updatedPool));
        }
        else {
            const newPool = new Pool();
            newPool.gallons = Number(volumeText);
            newPool.name = name;
            newPool.waterType = type;
            dispatch(saveNewPool(newPool));
        }

        goBack();
    }

    const handlePressedTypeButton = () => {

        Keyboard.dismiss();
        const pickerProps: PDPickerRouteProps = {
            title: 'Water Type',
            subtitle: '',
            items: waterTypeOptions.map((wt) => ({ name: wt.display, value: wt.value })),
            pickerKey: 'water_type'
        };
        navigate('PickerScreen', pickerProps);
    }

    const deleteButtonAction = pool ? handleDeletePoolPressed : null;
    return (
        <PoolDetails
            header={ pool ? 'Edit' : 'Create' }
            originalPoolName={ originalSelectedPoolName ?? '' }
            name={ name }
            volumeText={ volumeText }
            type={ type }
            goBack={ goBack }
            updateVolume={ updateVolumeText }
            updateName={ updateName }
            pressedTypeButton={ handlePressedTypeButton }
            rightButtonAction={ deleteButtonAction }
            handleSavePoolPressed={ handleSaveButtonPressed } />
    );
}

export const EditPoolScreen = connect(mapStateToProps)(EditPoolComponent);