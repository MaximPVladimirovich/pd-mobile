import { LogEntry } from '~/models/logs/LogEntry';
import { Pool } from '~/models/Pool';
import { Database } from '~/repository/Database';
import { jsonToCSV } from 'react-native-csv';


import { ConversionUtil } from './ConversionsUtil';
import { Util } from './Util';

export namespace DataService {
    /// Returns the base64 encoded file data.
    /// Really, this should stream to a file & not happen on the main thread.
    /// But, Android file-sharing is tedious, and idk if multi-threading in RN or js even works.
    export const generateCsvFileForAllPools = (): string => {
        let dataString = 'pool_dash,export\n';

        dataString += Database.loadPools()
            .map((pool) => generateCSVEntriesForPool(pool))
            .join('\n**************\n');

        return dataString;
    };

    export const newGenerateCsvFileForAllPools = () => {
      const data = {
        dataString: 'pool_dash,export',
        data: Database.loadPools().map((pool) => {
          return generateJSONForPool(pool);
      }),
      };

      const json = JSON.stringify(data);

      const csv = jsonToCSV(json);

      return csv;

    };

    export const generateJSONForPool = (pool: Pool) => {
      const logsToJson = Database.loadLogEntriesForPool(pool.objectId, null, true).map((log) => {
        return newGetRowsForEntry(log);
      });


      const data = {
        pool: pool.name,
        usGallons: pool.gallons,
        liters: ConversionUtil.usGallonsToLiters(pool.gallons),
        imperialGallons: ConversionUtil.usGallonsToImpGallon(pool.gallons),
        waterType: pool.waterType,
        wallType: pool.wallType,
        formulaId: pool.formulaId || '' ,
        objectId: pool.objectId,
        logs: JSON.stringify(logsToJson),
      };

      return data;
    };


    const newGetRowsForEntry = (entry: LogEntry) => {
      const readingEntries = entry.readingEntries.map((reading) => {
        return {
          type: 'reading',
          name: reading.readingName,
          id: reading.id,
          value: reading.value,
          units: reading.units || '',
        };
      });

      const treatmentEntries = entry.treatmentEntries.map((treatment) => {
        return {
          type: 'treatment',
          name: Util.getDisplayNameForTreatment({ name: treatment.treatmentName, concentration: treatment.concentration }),
          id: treatment.id,
          amount: treatment.displayAmount,
          units: treatment.displayUnits || '',
          ounces: treatment.ounces + 'ounces',
        };});

      const data = {
        type: 'log_entry',
        userTs: new Date(entry.userTS).toISOString(),
        formulaId: entry.formulaId,
        objectId: entry.objectId,
        readingEntries: readingEntries,
        treatmentEntries: treatmentEntries,
      };


      return data;

    };


    /// Returns the base64 encoded file data
    export const generateCsvFileForPool = (pool: Pool): string => {
        let dataString = 'pool_dash,export\n';

        dataString += generateCSVEntriesForPool(pool);

        return dataString;
    };

    const generateCSVEntriesForPool = (pool: Pool): string => {
        let result = `\npool,\
            ${pool.name},\
            ${pool.gallons},\
            us gallons,\
            ${ConversionUtil.usGallonsToLiters(pool.gallons)},\
            liters,\
            ${ConversionUtil.usGallonsToImpGallon(pool.gallons)},\
            imperial gallons,\
            ${pool.waterType},\
            ${pool.wallType},\
            ${pool.formulaId ?? ''},\
            ${pool.objectId}`;
        const logs = Database.loadLogEntriesForPool(pool.objectId, null, true);
        logs.forEach((entry) => {
            result += `${getRowsForEntry(entry)}\n`;
        });
        return result;
    };

    const getRowsForEntry = (logEntry: LogEntry): string => {
        let result = `\nlog_entry,\
            ${new Date(logEntry.userTS).toISOString()},\
            ${logEntry.notes ?? '---'},\
            ${logEntry.formulaId},\
            ${logEntry.objectId}`;
        logEntry.readingEntries.forEach((re) => {
            result += `\nreading,\
                ${re.readingName},\
                ${re.id},\
                ${re.value},\
                ${re.units ?? ''}`;
        });
        logEntry.treatmentEntries.forEach((te) => {
            result += `\ntreatment,\
                ${Util.getDisplayNameForTreatment({ name: te.treatmentName, concentration: te.concentration })},\
                ${te.id},\
                ${te.displayAmount},\
                ${te.displayUnits ?? ''},\
                ${te.ounces},\
                ounces`;
        });
        return result;
    };
}
