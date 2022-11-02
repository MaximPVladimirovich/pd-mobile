import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';

interface useFilePickerProps {
  pickFile: () => Promise<void>;
  setFiles: (file: any) => void;
  files: Files;
}

type Files = Array<File>;

type File = {
  name: string;
  uri: string;
  type: string;
  fileCopyUri: string;
  size: number;
}

export const useFilePicker = ():useFilePickerProps => {
  const [files, setFiles] = useState([] as Files);

  const pickFile = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
        allowMultiSelection: true,
      });


      setFiles(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Err msg or cancel message.
        setFiles([] as Files);
      } else {
        throw err;
      }
    }
  };

  return { files, pickFile, setFiles };
};
