import Share, { Options, MultipleOptions } from 'react-native-share';
import { Config } from './Config';
import { Util } from './Util';

export namespace ExportService {

    export const shareCSVFile = async (fileData: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const fileName = `pd-${(new Date()).toISOString()}.csv`;
            const shareOptions: Options | MultipleOptions = {};
            if (Config.isAndroid) {
                const sharableURL = `data:text/comma-separated-values;base64,${fileData}`;
                console.log(sharableURL);
                shareOptions.url = sharableURL;
                shareOptions.type = 'text/csv';
                shareOptions.filename = Util.stringToBase64(fileName);
            } else {
                const sharableURL = `data:text/comma-separated-values;base64,${fileData}`;
                console.log(sharableURL);
                shareOptions.activityItemSources = [
                    {
                        placeholderItem: { type: 'text', content: 'pooldash.csv' },
                        item: {
                            default: {
                                type: 'url', content: sharableURL
                            },
                        },
                        dataTypeIdentifier: { default: 'kUTTypeCommaSeparatedText' },
                        subject: { default: fileName },
                        linkMetadata: {
                            title: 'pooldash export',
                            originalUrl: fileName
                        }
                    }
                ];
            }

            Share.open(shareOptions)
                .then((res) => {
                    console.log(res);
                    resolve();
                })
                .catch((err) => {
                    err && console.log(err);
                    reject(err);
                });
        });
    }
}
