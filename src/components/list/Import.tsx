import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFilePicker } from '~/hooks/useFilePicker';
import { IPool } from '~/models/Pool';
import { ImportService } from '~/services/importService';
import { PDText } from '../PDText';
import { PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { SVG } from '~/assets/images';
import { BoringButton } from '../buttons/BoringButton';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Config } from '~/services/Config/AppConfig';
import { TempCsvRepo } from '~/repository/TempCsvRepo';
import { readString } from 'react-native-csv';
import { Database } from '~/repository/Database';
import { LogEntryV4 } from '~/models/logs/LogEntry/LogEntryV4';

export const Import = (): any => {
  const { setFile, file, fileData, pickFile } = useFilePicker();
  const { navigate } = useNavigation<PDStackNavigationProps>();
  const theme = useTheme();

  const importCSV = async () => {
      let pools;
      let numberOfErrors = 0;

      if (Config.isAndroid) {
        const { data: json } = readString(fileData, { header: true });

        pools = ImportService.convertJSON_To_Pools(json);

      } else {
        const readFileData = await TempCsvRepo.readCSV(file.uri);
        const { data } = ImportService.convertCSV_To_JSON(readFileData);

        pools = ImportService.convertJSON_To_Pools(data);
      }

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
    } else {
      alertSuccess(poolNames);
    }

    removeFile();
    navigate('Home');
  };

  const alertSuccess = (names: Array<string>) => {
    Alert.alert('Imported', `Imported ${names.length} ${names.length === 1 ? 'pool' : 'pools'}: ${names.join(', ')}`);
  };

  const alertFailure = (numberOfErrors: number) => {
    Alert.alert('Error', `There were ${numberOfErrors} errors while importing the CSV file. Please check the file and try again.`);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
    <PDText type="heading" color="black">CSV Import</PDText>
          <PDText type="bodyRegular" color="greyDark">
            Want to import pools from a .csv file?
          </PDText>
      <BoringButton title="Import from csv" onPress={ pickFile } containerStyles={ { backgroundColor: theme.colors.blue, marginTop: PDSpacing.lg } } />

      { file?.uri ? <PDView key={ file.uri } style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: PDSpacing.lg } }>
        <PDText type="buttonSmall" color="greyDarker">
          { file.name }
        </PDText>
          <TouchableOpacity onPress={ () => importCSV() }>
            <SVG.IconImportData fill={ theme.colors.blue } />
          </TouchableOpacity>
          <TouchableOpacity onPress={ removeFile }>
            <SVG.IconDeleteOutline fill={ theme.colors.red } />
          </TouchableOpacity>
      </PDView> : null }
    </>
  );
};
