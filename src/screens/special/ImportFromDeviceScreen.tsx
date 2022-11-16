import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { Import } from '~/components/list/Import';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

export const ImportFromDeviceScreen = (): JSX.Element => {
    const styles = getStyles(useTheme(), StyleSheet, useSafeAreaInsets());

    return (
      <PDSafeAreaView style={ styles.container } forceInset={ { bottom: 'never' } } >
        <ScreenHeader textType="heading" color="blue">
          Import Pools
        </ScreenHeader>
        <ScrollView style={ styles.scrollView } contentInset={ styles.contentInset }>
          <PDView style={ styles.bodyContainer }>
            <Import/>
          </PDView>
        </ScrollView>
      </PDSafeAreaView>
    );
};

const getStyles = (theme: any, styleSheet: any, insets: any) => {
  return styleSheet.create({
    container: {
      backgroundColor: 'fff',
    },
    bodyContainer: {
        flex: 1,
        padding: PDSpacing.md,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    body: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyText: {
        fontSize: 18,
        color: theme.colors.text,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentInset: {
        bottom: insets.bottom,
    },
    scrollView: {
        flex: 1,
    },
});
};


