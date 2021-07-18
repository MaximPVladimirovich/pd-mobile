import Realm from 'realm';
import { LogEntryV0 } from '~/models/logs/LogEntry/LogEntryV0';
import { LogEntryV1 } from '~/models/logs/LogEntry/LogEntryV1';
import { LogEntryV2 } from '~/models/logs/LogEntry/LogEntryV2';
import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';
import { PoolV0 } from '~/models/Pool/PoolV0';
import { PoolV1 } from '~/models/Pool/PoolV1';
import { PoolV2 } from '~/models/Pool/PoolV2';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';

/**
 * List of schemas for the Realm database. This array should be updated every
 * time there is a change to the data model.
 */
export const schemas = [
    {
        schema: [PoolV0.schema, LogEntryV0.schema, ReadingEntry.schema, TreatmentEntry.schema, TargetRangeOverride.schema],
        schemaVersion: 0,
    },
    {
        schema: [PoolV1.schema, LogEntryV0.schema, ReadingEntry.schema, TreatmentEntry.schema, TargetRangeOverride.schema],
        schemaVersion: 1,
    },
    {
        schema: [PoolV1.schema, LogEntryV1.schema, ReadingEntry.schema, TreatmentEntry.schema, TargetRangeOverride.schema],
        schemaVersion: 2,
    },
    {
        schema: [PoolV2.schema, LogEntryV1.schema, ReadingEntry.schema, TreatmentEntry.schema, TargetRangeOverride.schema],
        schemaVersion: 3,
    },
    {
        schema: [PoolV2.schema, LogEntryV2.schema, ReadingEntry.schema, TreatmentEntry.schema, TargetRangeOverride.schema],
        schemaVersion: 4,
    },
];

/**
 * Class that handles Realm migrations when Realm is loaded on app start.
 */
export class Migrator {
    /** Run each migration sequentially. */
    public static runMigrations() {
        let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
        while (nextSchemaIndex < schemas.length) {
            const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
            migratedRealm.close();
        }
    }

    /** Get the latest schema from the schema list */
    public static getCurrentSchemaVersion(): Realm.Configuration {
        return schemas[schemas.length - 1];
    }
}
