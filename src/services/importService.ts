// This service should recieve a file and return a list of objects.
import { TempCsvRepo } from '../repository/TempCsvRepo';
import { readString } from 'react-native-csv';
import { PoolV3 } from '../models/Pool/PoolV3';
export { PoolV3 as Pool } from '../models/Pool/PoolV3';


type convertCSV_To_JSONProps = {
    data: Array<PoolV3>;
    errors: Array<errors>;
    meta: Meta;
};

type Logs = {
    objectId: string;
};

type errors = {
    type: string;
    code: string;
    message: string;
    row: number;
};

type Meta = {
    aborted: boolean;
    delimiter: string;
    linebreak: string;
    truncated: boolean;
    fields: Array<string>;
};

export namespace ImportService {
    export const importFileAsCSV = async (filePath: string) => {
        const csv = await TempCsvRepo.readCSV(filePath);

        return csv;
    };

    export const convertCSV_To_JSON = (csvData: string): any => {
        const data = readString(csvData, {
            header: true,
        });

        return data;
    };

    export const convertJSON_To_Pools = (json: any): Array<PoolV3> => {
        const pools = json.map((pool: any) => {
            const { logs } = pool;

            const parsedLogs = JSON.parse(logs);

            const newPool = {
                objectId: pool.objectId,
                name: pool.pool,
                waterType: pool.waterType,
                gallons: parseInt(pool.usGallons, 10),
                wallType: pool.wallType,
                formulaId: pool.formulaId,
                logs: parsedLogs,
                imperialGallons: parseInt(pool.imperialGallons, 10),
                liters: parseInt(pool.liters, 10),
            };

            return newPool;
        });

        return pools;
    };
}
