import React, { useEffect, useState } from 'react';
import { useFilePicker } from '~/hooks/useFilePicker';
import { IPool } from '~/models/Pool';
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
    const poolNames = pools.map((pool: IPool) => pool.name);

    pools.map((pool: any) => {
      const savePool = Database.saveNewPool(pool);

      if (savePool === null || savePool === undefined) {
        numberOfErrors += 1;

        return;
      }

      const { logs } = pool;

      logs.length > 0 && logs.map((log: LogEntryV4) => {
        Database.saveNewLogEntry(log);
      });
    });

    if (numberOfErrors > 0) {
      alertFailure(numberOfErrors);
      numberOfErrors = 0;
      setPools([]);
      handleCancelImport();
    } else {
      alertSuccess(poolNames);
      setIsImported(true);
    }
  };

  const handleCancelImport = () => {
    reset(setPools, setIsImported);
  };

  const goHome = () => {
    navigate('Home');
  };

  const alertSuccess = (names: Array<string>) => {
    Alert.alert('Imported', `Imported ${names.length} ${names.length === 1 ? 'pool' : 'pools'}: ${names.join(', ')}`);
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
      { pools?.length > 0 &&
        <PDText type="subHeading" color="greyDarker">
          { pools.length } { pluralize('pool', pools.length) } found!
        </PDText>
      }
      <BoringButton title={ pools.length > 0 ? isImported ? 'Go Home' : `Import ${pools.length} pools` : 'Import' } onPress={ pools.length > 0 && isLoaded ? isImported ? goHome : savePools : pickFile } containerStyles={ styles.boringButtonContainer } />
      <PDText type="bodyRegular" color="greyDark" style={ styles.cancelButtonContainer }>
        Want to start over? You can delete everything imported.
      </PDText>
      <PDButtonSolid
        bgColor="red"
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
