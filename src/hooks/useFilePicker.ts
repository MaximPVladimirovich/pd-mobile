import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { ImportService } from '~/services/importService';

interface useFilePickerProps {
  pickFile: () => Promise<void>;
  file: File | null;
}

type File = {
  uri: string;
  type: string;
}

export const useFilePicker = ():useFilePickerProps => {
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    try {
      const res: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv],
      });

      if (res.type === 'text/csv') {
        const fileData = await ImportService.importCSV(res.uri);

        // This should be in another place. I have this here just for testing functionality.
        const json = ImportService.convertCSV_To_JSON(fileData);

        console.log('useFilePicker hook result', json);
      } else {
        console.log('File type not supported');
      }

      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Err msg or cancel message.
      } else {
        throw err;
      }
    }
  };

  return { file, pickFile };
};
