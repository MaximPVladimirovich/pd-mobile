import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFilePicker } from '~/hooks/useFilePicker';
import { IPool } from '~/models/Pool';
import { dispatch } from '~/redux/AppState';
import { saveNewPool } from '~/redux/selectedPool/Actions';
import { ImportService } from '~/services/importService';
import { PDText } from '../PDText';
import { PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { SVG } from '~/assets/images';
import { BoringButton } from '../buttons/BoringButton';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


export const Import = (): any => {
  const { setFiles, files, pickFile } = useFilePicker();
  const { navigate } = useNavigation<PDStackNavigationProps>();
  const theme = useTheme();


  const importCSV = async (file: any) => {
    const { data } = await ImportService.importFileAsCSV(file.uri);

    if (!data) {
      return;
    }

    const pools = ImportService.convertJSON_To_Pools(data);

    if (!pools) {
      return;
    }

    const poolNames = pools.map((pool: IPool) => pool.name);

    pools.map((pool: IPool) => {
      dispatch(saveNewPool(pool));

      // TODO: check for existing pools and update them instead.
      // I've attempted the something similar to below but it doesn't work.
      // const selected = dispatch(selectPool(pool));
      // if (selected)... update.
    });

    removeFile(file);
    alert(poolNames);
    navigate('Home');
};

  const alert = (names:any) => {
    return Alert.alert('Imported', `Imported ${names.length} ${names.length === 1 ? 'pool' : 'pools'}: ${names.join(', ')}`);
  };

  const removeFile = ({ uri }: any) => {
    const newFiles = files.filter((f) => f.uri !== uri);
    setFiles(newFiles);
  };

  return (
    <>
      <BoringButton title="Import from device" onPress={ pickFile } containerStyles={ { backgroundColor: theme.colors.blue, marginTop: PDSpacing.lg } } />

      { files && files.map((file: any) => {
        return (
          <PDView key={ file.uri } style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: PDSpacing.lg } }>
            <PDText type="buttonSmall" color="greyDarker">
              { file.name }
            </PDText>
            <TouchableOpacity onPress={ () => importCSV(file) }>
              <SVG.IconImportData fill={ theme.colors.blue } />
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => removeFile(file) }>
              <SVG.IconDeleteOutline fill={ theme.colors.red } />
            </TouchableOpacity>
          </PDView>
        );
      }) }
    </>
  );
};
