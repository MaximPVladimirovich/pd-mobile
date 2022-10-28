import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';

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
        // Define type for ios devices using Uniform Type Identifiers
      });

      console.log(res);


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
