// This service should recieve a file and return a list of objects.
import { TempCsvRepo } from '../repository/TempCsvRepo';
import { readString } from 'react-native-csv';
export { PoolV3 as Pool } from '../models/Pool/PoolV3';

type convertCSV_To_JSONProps = {
  data: Array<{
    formulaId: string;
    imperialGallons: string;
    liters: string;
    logs?: Array<Logs>
    objectId: string;
    pool?: string;
    usGallons: string;
    waterType?: string;
    wallType?: string;
  }>,
  errors: Array<errors>,
  meta: Meta
}

type Logs = {
  objectId: string;
}

type errors = {
  error: string;
}

type Meta = {
  aborted: boolean;
  cursor: number;
  delimiter: string;
  linebreak: string;
  truncated: boolean;
  fields: Array<string>;
}



export namespace ImportService {
    export const importCSV = async (filePath: string) => {
        const fileData = await TempCsvRepo.readCSV(filePath);

        return fileData;
    };

    export const convertCSV_To_JSON = (csvData: string): any => {
        const data = readString(csvData, {
            header: true,
        });

        return data;
    };
}
