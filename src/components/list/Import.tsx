import React, { useEffect, useState } from 'react';
import { useFilePicker } from '~/hooks/useFilePicker';
import { ImportService } from '~/services/importService';
import { PDText } from '../PDText';
import { PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { BoringButton } from '../buttons/BoringButton';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet } from 'react-native';
import { Config } from '~/services/Config/AppConfig';
import { TempCsvRepo } from '~/repository/TempCsvRepo';
import { readString } from 'react-native-csv';
import { Database } from '~/repository/Database';
import { LogEntryV4 } from '~/models/logs/LogEntry/LogEntryV4';
import pluralize from 'pluralize';
import { PDButtonSolid } from '../buttons/PDButtonSolid';
import { SVG } from '~/assets/images';

export const Import = (): any => {
  const { file, fileData, pickFile, isLoaded, reset } = useFilePicker();
  const [pools, setPools] = useState([] as any);
  const [isImported, setIsImported] = useState(false);
  const [poolImportStats, setPoolImportStats] = useState({
    poolsImported: 0,
    logsImported: 0,
    poolsNotImported: 0,
    logsNotImported: 0,
  });
  const { navigate } = useNavigation<PDStackNavigationProps>();
  const theme = useTheme();
  const styles = getStyles(theme, StyleSheet);

  useEffect(() => {

    const importCSV = async () => {
      if (Config.isAndroid) {
        const data = readString(fileData, { header: true });
        const result = ImportService.convertJSON_To_Pools(data?.data);

        // Handle the case where the user has no pools in their CSV
        setPools(result);
      } else {
        const readFileData = await TempCsvRepo.readCSV(file.uri);
        const { data } = ImportService.convertCSV_To_JSON(readFileData);

        const result = ImportService.convertJSON_To_Pools(data);

        setPools(result);
      }
    };

    if (isLoaded) {
      importCSV();
    }

  }, [file, fileData, isLoaded]);

  const savePools = () => {
    let numberOfErrors = 0;
    let logErrors = 0;
    const numOfLogs = pools.reduce((acc: number, pool: any) => pool.logs.length + acc, 0);

    pools.map((pool: any) => {
      const savePool = Database.saveNewPool(pool);

      if (savePool === null || savePool === undefined) {
        numberOfErrors += 1;
        logErrors += pool.logs.length;

        return;
      }

      const { logs } = pool;

      logs.length > 0 && logs.forEach(async (log: LogEntryV4) => {
        await Database.saveNewLogEntry(log);
      });
    });

    setPoolImportStats({
      poolsImported: pools.length - numberOfErrors,
      logsImported: numOfLogs - logErrors,
      poolsNotImported: numberOfErrors,
      logsNotImported: logErrors,
    });


    if (numberOfErrors >= pools.length) {
      setIsImported(false);
      alertFailure(numberOfErrors);
      numberOfErrors = 0;
      setPools([]);
      handleCancelImport();
    } else {
      setIsImported(true);
      alertSuccess(pools.length - numberOfErrors);
    }
  };

  const handleCancelImport = () => {
    reset(setPools, setIsImported);
  };

  const goHome = () => {
    navigate('Home');
  };

  const alertSuccess = (imported: number) => {
    Alert.alert('Imported', `Imported ${imported} ${pluralize('pool', imported)}`);
  };

  const alertFailure = (numberOfErrors: number) => {
    Alert.alert('Error', `There were ${numberOfErrors} errors while importing the CSV file. Please check the file and try again.`);
  };

  return (
    <PDView style={ styles.container }>
      <PDText type="heading" color="black">CSV Import</PDText>
      <PDText type="bodyRegular" color="greyDark">
        Want to import pools from a .csv file?
      </PDText>
      {
        isImported && (
          <PDView style={ styles.importStats }>
            <PDText type="bodyRegular" color="greyDark">
              { poolImportStats.poolsImported } { pluralize('pool', poolImportStats.poolsImported) } imported
            </PDText>
            <PDText type="bodyRegular" color="greyDark">
              { poolImportStats.logsImported } { pluralize('log', poolImportStats.logsImported) } imported
            </PDText>
            <PDText type="bodyRegular" color="greyDark">
              { poolImportStats.poolsNotImported } { pluralize('pool', poolImportStats.poolsNotImported) } not imported
            </PDText>
            <PDText type="bodyRegular" color="greyDark">
              { poolImportStats.logsNotImported } { pluralize('log', poolImportStats.logsNotImported) } not imported
            </PDText>
          </PDView>
        )
      }
      <BoringButton title={ pools.length > 0 ? isImported ? 'Go Home' : `Import ${pools.length} pools` : 'Import' } onPress={ pools.length > 0 && isLoaded ? isImported ? goHome : savePools : pickFile } containerStyles={ styles.boringButtonContainer } />
      <PDText type="bodyRegular" color="greyDark" style={ styles.cancelButtonContainer }>
        Want to start over? You can delete everything imported.
      </PDText>
      <PDButtonSolid
        disabled={  !pools.length }
        bgColor={ !pools.length ? 'grey' : 'red' }
        textColor="alwaysWhite"
        onPress={ handleCancelImport }
        icon={ <SVG.IconDeleteOutline fill={ theme.colors.alwaysWhite } /> }
        title="Undo Import"
        style={ styles.cancelButton } />
    </PDView>
  );
};

const getStyles = (theme: any, styleSheet: any) => {
  return styleSheet.create({
    container: {
      flex: 1,
    },
    fileListContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: PDSpacing.lg,
    },
    boringButtonContainer: {
      backgroundColor: theme.colors.blue,
      marginTop: PDSpacing.lg,
    },
    cancelButtonContainer: {
      marginTop: PDSpacing.xl,
    },
    cancelButton: {
      marginBottom: PDSpacing.xl,
      marginTop: PDSpacing.sm,
    },
  });
};
