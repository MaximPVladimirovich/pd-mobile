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

export const Import = (): any => {
  const { setFile, file, fileData, pickFile } = useFilePicker();
  const { navigate } = useNavigation<PDStackNavigationProps>();
  const theme = useTheme();

  const importCSV = async () => {
      let pools;

      if (Config.isAndroid) {
        const { data: json } = readString(fileData, { header: true });

        pools = ImportService.convertJSON_To_Pools(json);

      } else {
        const readFileData = await TempCsvRepo.readCSV(file.uri);
        const { data } = ImportService.convertCSV_To_JSON(readFileData);

        pools = ImportService.convertJSON_To_Pools(data);
      }

    const poolNames = pools.map((pool: IPool) => pool.name);

    pools.map((pool: IPool) => {
      Database.saveNewPool(pool);

      // TODO: check for existing pools and update them instead.
      // I've attempted the something similar to below but it doesn't work.
      // const selected = dispatch(selectPool(pool));
      // if (selected)... update.
    });

    removeFile();
    alert(poolNames);
    navigate('Home');
  };

  const alert = (names: any) => {
    return Alert.alert('Imported', `Imported ${names.length} ${names.length === 1 ? 'pool' : 'pools'}: ${names.join(', ')}`);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
      <BoringButton title="Import from device" onPress={ pickFile } containerStyles={ { backgroundColor: theme.colors.blue, marginTop: PDSpacing.lg } } />

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
