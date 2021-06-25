import * as React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Pool } from '~/models/Pool';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';
import { ChipButton } from './ChipButton';

interface PoolListItemProps {
    pool: Pool;
    handlePoolPressed: (p: Pool) => void;
    handleEnterReadingsPressed: (p: Pool) => void;
}

export const PoolListItem: React.FC<PoolListItemProps> = (props) => {

    const { pool, handlePoolPressed, handleEnterReadingsPressed } = props;

    const { ds } = useDeviceSettings();
    const volume = VolumeUnitsUtil.getAbbreviatedDisplayVolume(pool.gallons, ds);

    return (
        <TouchableScale onPress={ () => handlePoolPressed(pool) } activeScale={ 0.97 } key={ pool.objectId }>
            <PDView bgColor="white" borderColor="border" style={ styles.containerPool }>
                <PDText type="bodyBold" color="black" numberOfLines={ 3 }>
                    {pool.name}
                </PDText>
                <PDText type="bodyMedium" color="greyDark">
                    { getDisplayForWaterType(pool.waterType) }, {volume}
                </PDText>
                <ChipButton onPress={ () => handleEnterReadingsPressed(pool) } icon="play" title="Enter Readings" />
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    containerPool: {
        paddingTop: PDSpacing.sm,
        paddingBottom: PDSpacing.md,
        paddingHorizontal: PDSpacing.lg,
        borderWidth: 2,
        borderRadius: 24,
        marginBottom: PDSpacing.xs,
    },
});
