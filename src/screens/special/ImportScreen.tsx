import * as React from 'react';
import { PDMigrator } from '~/services/migrator/NativeModule';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { NativeEventEmitter, StyleSheet } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PoolDoctorImportService, PoolDoctorPool } from '~/services/special/PoolDoctorImportService';
import { useNavigation } from '@react-navigation/native';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useImportablePools } from './PoolDoctorImportHooks';
import { ScrollView } from 'react-native-gesture-handler';
import { ForumPrompt } from '../home/footer/ForumPrompt';
import { useStandardStatusBar } from '~/hooks/useStatusBar';
import { Config } from '~/services/Config/AppConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HR } from '~/components/Hr';
import { PDButtonSolid } from '~/components/buttons/PDButtonSolid';
import { PDButton } from '~/components/buttons/PDButton';
import { BoringButton } from '~/components/buttons/BoringButton';

export const ImportScreen: React.FC = () => {
    const [hasImported, setHasImported] = useState(false);
    const [hasStartedImport, setHasStartedImport] = useState(false);
    const [createdPools, setCreatedPools] = useState(0);
    const [skippedPools, setSkippedPools] = useState(0);
    const [createdLogs, setCreatedLogs] = useState(0);
    const [skippedLogs, setSkippedLogs] = useState(0);
    const numPools = useImportablePools();
    useStandardStatusBar();

    // Button text:
    const buttonText = 'Import from CSV';

    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { navigate } = useNavigation<PDStackNavigationProps>();

    const handlePressedPoolDoctor = () => {
        navigate('PoolDoctorImport');
    };

    // called whenever the native module learns about a new pool:
    const poolListener = useCallback(async (e: PoolDoctorPool) => {
        const result = await PoolDoctorImportService.importPool(e);
        if (result.poolStatus === 'created') {
            setCreatedPools(cp => cp + 1);
        } else if (result.poolStatus === 'skipped') {
            setSkippedPools(up => up + 1);
        }
        setSkippedLogs(sl => sl + result.logsSkipped);
        setCreatedLogs(cl => cl + result.logsCreated);
    }, [setSkippedPools, setCreatedPools, setCreatedLogs, setSkippedLogs]);

    useEffect(() => {
        // If we're all done importing:
        if (!hasStartedImport) { return; }
        if (skippedPools + createdPools + 1 === numPools) {
            setHasImported(true);
        }
    }, [skippedPools, createdPools, numPools, hasStartedImport]);

    useEffect(() => {
        if (!Config.isIos) { return; }
        const emitter = new NativeEventEmitter(PDMigrator);
        emitter.addListener('pool', poolListener);
        return () => {
            emitter.removeAllListeners('pool');
        };
    }, [poolListener]);

    const goToImportFromDevice = () => {
      navigate('ImportFromDevice');
    };

    const getPoolDoctorContent = () => {
      if (Config.isIos && numPools > 0) {
        return <>
          <PDText type="heading" color="black">Pool Doctor</PDText>
          <PDText type="bodyRegular" color="greyDark">
            Want to import pools from the Pool Doctor app?
          </PDText>
          <PDButtonSolid onPress={ handlePressedPoolDoctor } title="Import from Pool Doctor" textColor="black"/>
          <HR/>
        </>;
      }
      return <></>;
    };

    return (
        <PDSafeAreaView style={ { backgroundColor: theme.colors.white } } forceInset={ { bottom: 'never' } } >
            <ScreenHeader textType="heading" color="blue">
                Import Pools
            </ScreenHeader>
            <ScrollView style={ { flex: 1 } } contentInset={ { bottom: insets.bottom } }>
                <PDView style={ styles.container }>
                    { getPoolDoctorContent() }
                    <BoringButton title={ buttonText } onPress={ goToImportFromDevice } containerStyles={ { backgroundColor: theme.colors.blue } } />
                    <PDText type="bodyMedium" color="greyDarker" style={ { marginTop: PDSpacing.xl } }>Want to import pools from somewhere else? Tell us on the support forum:</PDText>
                    <ForumPrompt />
                </PDView>
            </ScrollView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: PDSpacing.md,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
        marginBottom: 18,
    },
    bottomSpace: {
        marginBottom: PDSpacing.sm,
    },
});

