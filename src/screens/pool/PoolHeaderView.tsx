import * as React from 'react';
import { StyleSheet } from 'react-native';
import { BackButton } from '~/components/buttons/BackButton';
import { Button } from '~/components/buttons/Button';
import { PDText } from '~/components/PDText';
import { PDView } from '~/components/PDView';
import { Pool } from '~/models/Pool';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useThunkDispatch, useTypedSelector } from '~/redux/AppState';
import { clearPool } from '~/redux/selectedPool/Actions';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useNavigation } from '@react-navigation/native';

export const PoolHeaderView: React.FC = () => {
    const navigation = useNavigation<PDStackNavigationProps>();
    const deviceSettings = useTypedSelector(state => state.deviceSettings);
    const pool = useTypedSelector((state) => state.selectedPool) as Pool;
    const dispatch = useThunkDispatch();

    const handlePressedEdit = () => {
        // TODO: Type composite
        navigation.navigate('PDPoolNavigator', { screen: 'EditPoolScreen' });

    };
    const handlePressedBack = () => {
        dispatch(clearPool());
        navigation.goBack();
    };

    const volumeDisplay = VolumeUnitsUtil.getDisplayVolume(pool.gallons, deviceSettings);
    const detailsText = `${getDisplayForWaterType(pool.waterType)} | ${volumeDisplay}`;

    return (
        <PDView style={ styles.container } bgColor="white">
            <PDView style={ styles.navRow }>
                <PDView style={ styles.backButtonContainer }>
                    <BackButton title={ pool.name } onPress={ handlePressedBack } scale={ { scale: true, scaleLines: 2 } } />
                </PDView>
                <PDView style={ styles.editButtonContainer }>
                    <Button
                        title="Edit"
                        onPress={ handlePressedEdit }
                        styles={ styles.editButton }
                        textStyles={ styles.editButtonText }
                        hitSlop={ 12 }
                    />
                </PDView>
            </PDView>
            <PDView style={ styles.infoRow }>
                <PDText type="default" style={ styles.poolVolumeText }>
                    {detailsText}
                </PDText>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingHorizontal: 18,
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 2,
    },
    navRow: {
        flexDirection: 'row',
    },
    infoRow: {
        marginTop: 15,
        marginBottom: 15,
    },
    poolVolumeText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 18,
        fontWeight: '600',
    },
    editButtonContainer: {
        alignSelf: 'center',
    },
    backButtonContainer: {
        flexGrow: 1,
    },
    editButton: {
        backgroundColor: 'rgba(30,107,255,.1)',
        borderRadius: 15,
    },
    editButtonText: {
        color: '#2D5FFF',
        textAlign: 'center',
        marginTop: '2%',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
});
