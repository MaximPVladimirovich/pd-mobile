import { Input } from '../models/recipe/Input';
import { InputEntry } from '../models/recipe/InputEntry';
import { Output } from '../models/recipe/Output';
import { OutputEntry } from '../models/recipe/OutputEntry';
import { Recipe } from '../models/recipe/Recipe';
import { Pool } from '../models/Pool';
import { Database } from '../repository/Database';

export class CalculationService {
    static calculateTreatments = (recipe: Recipe, pool: Pool, recordedInputs: InputEntry[]): OutputEntry[] => {

        // const freeChlorineReading = readings.filter(r => r.identifier === 'free_chlorine');
        // const free_chlorine = freeChlorineReading[0].value;
        // const chlorineAmount = eval(chlorineFormula);

        // Get all of the inputs as a single string w/ all paramaters.
        // Call each output function with the parameters, store results in array.
        // Filter & display array.

        const recipeParamNames = recipe.inputs.map(input => input.variableName);
        recipeParamNames.splice(0, 0, 'volume');
        const paramString = recipeParamNames.join(', ');

        /// Ensure these are in the correct order
        const inputValues = recipe.inputs.map(input => {
            const record = recordedInputs.find(ri => ri.inputID === input.objectId);
            if ((record === null) || (record === undefined)) {
                return null;  // TODO: handle case where some inputs are empty?
            }
            return record.value;
        });
        inputValues.splice(0, 0, pool.volume);
        const inputString = inputValues.join(', ');

        console.log(paramString);
        console.log(inputString);

        const outputs = recipe.outputs.map(output => {
            const formula = 'function x(' + paramString + ') { ' + output.formula + ' } x(' + inputString + ');';
            const value = eval(formula);
            console.log('formula: ' + formula);
            console.log('value: ' + String(value));
            return OutputEntry.make(output, value);
        });

        return outputs;
    };
}

const calculateValueForOutput = (
    output: Output,
    poolVolume: number,
    inputs: Input[],
    inputEntries: InputEntry[]): number => {

        const formula = output.formula;
        // TODO: finish this, my brain === mush
        const params = inputs.map(r => {
            if (inputEntries.filter(e => e.inputID === r.objectId).length > 0) {
                return '';
            }
        });

        return 0;
};