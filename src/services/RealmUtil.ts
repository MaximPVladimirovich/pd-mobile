import { LogEntry } from '~/models/logs/LogEntry';
import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { Pool } from '~/models/Pool';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { ReadingValue } from '~/models/ReadingValue';
import { Recipe } from '~/models/recipe/Recipe';

import { Util } from './Util';

// Every time we add a property to these classes, we have to mirror them here (yuck).
const PoolProps = ['name', 'gallons', 'waterType', 'wallType', 'objectId', 'recipeKey', 'email'];
const LogEntryProps = ['objectId', 'poolId', 'ts', 'readingEntries', 'treatmentEntries', 'recipeKey', 'formulaName', 'notes'];
const TargetRangeProps = ['objectId', 'poolId', 'var', 'min', 'max'];

/**
 * if you need to parser, cast or convert any data form realm, you should use in this util class.
 */
export class RealmUtil {
    /**
     *  Parser Pool RealmObject to POJO
     * @param rawPools RealmCollection<Pool>
     * @returns array plain pool
     */
    static poolsToPojo = (rawPools: Realm.Collection<Pool>) => {
        const parserData = Util.toArrayPojo<Pool>(PoolProps, rawPools);
        return parserData;
    };

    /**
     *  Parser LogEntry RealmObject to POJO
     * @param rawLogEntry RealmCollection<LogEntry>
     * @returns array plain LogEntry
     */
    static logEntriesToPojo = (realmLogEntries: Realm.Collection<LogEntry>) => {
        return Util.toArrayPojo<LogEntry>(LogEntryProps, realmLogEntries);
    };

    /**
     *  Parser Custom Target RealmObject to POJO
     * @param rawCustomTargers RealmCollection<TargetRangeOverride>
     * @returns array plain custom target
     */
    static customTargetToPojo = (rawCustomTargers: Realm.Collection<TargetRangeOverride>) => {
        const parserData = Util.toArrayPojo<TargetRangeOverride>(TargetRangeProps, rawCustomTargers);
        return parserData;
    };

    static createReadingEntriesFromReadingValues = (values: ReadingValue[], formula: Recipe): ReadingEntry[] => {
        const entries: ReadingEntry[] = [];
        values.forEach(v => {
            const reading = Util.firstOrNull(formula.readings.filter(r => r.var === v.var));
            if (reading) {
                const e = ReadingEntry.make(reading, v.value);
                entries.push(e);
            }
        });
        return entries;
    }
}
