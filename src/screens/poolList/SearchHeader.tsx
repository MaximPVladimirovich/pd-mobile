import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { useDispatch } from 'react-redux';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PDStackNavigationProps } from '~/navigator/shared';
import { clearPool } from '~/redux/selectedPool/Actions';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { DS } from '~/services/DSUtil';

import { useNavigation } from '@react-navigation/native';

interface SearchHeaderProps {
    numPools: number;
    searchText?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = (props) => {
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const { ds } = useDeviceSettings();
    const dispatch = useDispatch();


    const promptUpgrade = () => {
        Alert.alert(
            'Sorry, but...',
            'You must upgrade the app to add multiple pools.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Upgrade',
                    onPress: () => navigate('Subscription'),
                    style: 'default',
                },
            ],
            { cancelable: true },
        );
    };

    const handleAddButtonPressed = () => {
        const hasUpgraded = DS.isSubscriptionValid(ds, Date.now());
        if (hasUpgraded || (props.numPools === 0)) {
            dispatch(clearPool());
            navigate('EditPoolNavigator');
        } else {
            promptUpgrade();
        }
    };

    const handleSettingButtonPressed = () => {
        navigate('Settings');
    };

    const shouldShowSearch = !!((props.numPools > 0) || (props.searchText));
    const searchBar = shouldShowSearch && (
        <PDView style={ styles.containerSearch }>
            {props.children}
        </PDView>
    );

    return (
        <PDView bgColor="white" style={ styles.containerBottom }>
            <PDView  style={ styles.container  }>
                <PDView style={ styles.sideContainer }>
                    <TouchableScale  onPress={ handleSettingButtonPressed } hitSlop={ { top: 7, bottom: 7, left: 7, right: 7 } }>
                        <SVG.IconSettings height={ 32 } width={ 32 } fill={ 'blue' } />
                    </TouchableScale>
                </PDView>
                <PDView style={ styles.centerContainer }>
                    <PDText type={ 'heading' } color="black" style={ styles.text }>
                        My Pools
                    </PDText>
                </PDView>
                <PDView style={ styles.sideContainer }>
                    <TouchableScale onPress={ handleAddButtonPressed }>
                        <SVG.IconCircleAdd height={ 32 } width={ 32 } fill={ 'blue' } />
                    </TouchableScale>
                </PDView>
            </PDView>
            {searchBar}
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: PDSpacing.md,
    },
    containerSearch: {
        marginHorizontal: PDSpacing.md,
        marginBottom: PDSpacing.md,
    },
    containerBottom: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 2,
    },
    sideContainer: {
        flexShrink: 1,
        minWidth: 32,
    },
    centerContainer: {
        flexGrow: 2,
    },
    text: {
        textAlign: 'center',
    },
});
