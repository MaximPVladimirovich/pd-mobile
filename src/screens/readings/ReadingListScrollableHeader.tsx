import React from 'react';
import { StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Pool } from '~/models/Pool';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { useTypedSelector } from '~/redux/AppState';
import { Util } from '~/services/Util';


/// The reading list header is partially scrollable -- this is the part that disappears under the navbar:
export const ReadingListScrollableHeader: React.FC<{}> = () => {
    const theme = useTheme();
    const pool = useTypedSelector((state) => state.selectedPool) as Pool;
    const deviceSettings = useTypedSelector((state) => state.deviceSettings);
    const volumeDisplay = Util.getDisplayVolume(pool.gallons, deviceSettings);
    const detailsText = getDisplayForWaterType(pool.waterType);

    return (
        <PDView style={styles.container} bgColor="white">
            <PDText type="subHeading">{pool.name}</PDText>
            <PDView style={styles.row}>
                <PDView style={styles.containerIcon}>
                    <SVG.IconInformation fill={theme.grey} />
                </PDView>
                <PDText type="bodyRegular" color="grey">
                    {volumeDisplay}, {detailsText}
                </PDText>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PDSpacing.md,
        // This creates the least-surprising background color when over-scrolling:
        marginTop: -10000000,
        paddingTop: 10000000 + PDSpacing.md,
    },
    containerIcon: {
        paddingRight: PDSpacing.xs,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PDSpacing.xs,
    },
});
