import { Reading } from '~/models/recipe/Reading';

/**
 * Represents the value of a reading or observation
 */
export class ReadingEntry {
    // The value of the input
    value!: number;

    // Variable name (defined by the recipe)
    var!: string;

    // human-friendly name of the reading
    readingName!: string;

    // for convenience, store the reading units here as well
    units?: string;

    // For Realm purposes
    static schema = {
        name: 'ReadingEntry',
        properties: {
            readingName: 'string',
            var: 'string',
            value: 'double',
            units: 'string?'
        },
    };

    static make(reading: Reading, value: number): ReadingEntry {
        let readingEntry = new ReadingEntry();
        readingEntry.var = reading.var;
        readingEntry.readingName = reading.name;
        readingEntry.value = value;
        readingEntry.units = reading.units || undefined;
        return readingEntry;
    }
}
