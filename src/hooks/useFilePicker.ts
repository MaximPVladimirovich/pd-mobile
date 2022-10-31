import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';

interface useFilePickerProps {
  pickFile: () => Promise<void>;
  setFile: (file: any) => void;
  file: File;
}

type File = {
  name: string;
  uri: string;
  type: string;
  fileCopyUri: string;
  size: number;
}

export const useFilePicker = ():useFilePickerProps => {
  const [file, setFile] = useState({} as File);

  const pickFile = async () => {
    try {
      const res: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv],
      });


      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Err msg or cancel message.
        setFile({} as File);
      } else {
        throw err;
      }
    }
  };

  return { file, pickFile, setFile };
};
