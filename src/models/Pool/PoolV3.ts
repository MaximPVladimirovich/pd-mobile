import { FormulaID } from '~/formulas/models/FormulaID';
import { ReadingEntryV2 } from '../logs/ReadingEntry/ReadingEntryV2';
import { TreatmentEntryV2 } from '../logs/TreatmentEntry/TreatmentEntryV2';
import { IPool } from './IPool';
import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';

/**
 * Represents a swimming pool (duh).
 */
export class PoolV3 implements IPool {
    // The pool's volume, in gallons.
    gallons!: number;

    // The pool's user-visible name
    name!: string;

    // An ID that uniquely identifies this pool
    objectId!: string;

    // The formula id chosen for the pool
    formulaId?: FormulaID;

    // [Deprecated] the id + timestamp of the old-style formula
    legacyFormulaKey?: string;

    // The pool water type
    waterType!: WaterTypeValue;

    // The pool wall type
    wallType!: WallTypeValue;

    // The pool email
    email?: string;

    // Pool Doctor's old id for the pool (if imported)
    poolDoctorId?: string;

    // The pool's logs
    logs?: Array<PoolLog>;

    // For Realm purposes
    static schema = {
        name: 'Pool',
        primaryKey: 'objectId',
        properties: {
            gallons: 'double',
            name: 'string',
            objectId: 'string',
            formulaId: 'string?',
            legacyFormulaKey: 'string?',
            waterType: 'string',
            wallType: 'string',
            email: 'string?',
            poolDoctorId: 'string?',
        },
    };
}

export type PoolLog = {
    type: string;
    objectId: string;
    userTs: string;
    formulaId: string;
    readingEntries: Array<ReadingEntryV2>;
    treatmentEntries: Array<TreatmentEntryV2>;
};
