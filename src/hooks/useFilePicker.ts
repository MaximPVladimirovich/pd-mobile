import { useEffect, useState } from 'react';
import * as ScopedStorage from 'react-native-scoped-storage';
import { Config } from '~/services/Config/AppConfig';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

interface useFilePickerProps {
    pickFile: () => Promise<void>;
    setFile: (file: any) => void;
    file: any;
    fileData: any;
    finishedImport: boolean;
}

export type FileType = {
  uri: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  lastModified: number;
  data: string;
  mime: string;
};

export const useFilePicker = (): useFilePickerProps => {
    // Android and ios will return slightly different file types.
    const [file, setFile] = useState({} as FileType | DocumentPickerResponse | null | undefined);
    const [fileData, setFileData] = useState({} as any);
    const [finishedImport, setFinishedImport] = useState(false);

    useEffect(() => {
        if (file) {
          setFinishedImport(true);
        }
    }, [file]);

    const pickFile = async () => {
            try {
              if (Config.isAndroid) {
                  const doc = await ScopedStorage.openDocument(true, 'utf8');

                  setFile(doc);
                  // openDocument() also reads the file's data, This requires less steps in the import process.
                  setFileData(doc.data);
                  setFinishedImport(true);
              } else if (Config.isIos) {
                  const doc = await DocumentPicker.pickSingle({
                      type: [DocumentPicker.types.csv],
                  });

                  setFile(doc);
                  setFinishedImport(true);
                }
            } catch (err) {
                console.log(err);
                setFile({} as FileType | DocumentPickerResponse | null | undefined);
            }
        };

    return { file, fileData, pickFile, setFile, finishedImport };
};
