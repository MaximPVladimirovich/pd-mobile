import { useState } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
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
};

export const useFilePicker = (): useFilePickerProps => {
    const [files, setFiles] = useState([] as Files);

    const grantPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            return false;
        } catch (err) {
            console.warn(err);
            Alert.alert('Storage Permission Not Granted');
            return false;
        }
    };

    const pickFile = async () => {
        const permissionGranted = await grantPermission();

        if (!permissionGranted) {
            return;
        } else {
            try {
                const res: any = await DocumentPicker.pick({
                    type: [DocumentPicker.types.csv],
                    allowMultiSelection: true,
                    copyTo: 'cachesDirectory',
                });

                console.log('res', res);


                setFiles(res);
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // Err msg or cancel message.
                    setFiles([] as Files);
                } else {
                    throw err;
                }
            }
        }
    };

    return { files, pickFile, setFiles };
};
