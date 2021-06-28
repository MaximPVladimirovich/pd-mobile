import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';


export interface IPool {
    // Even before being saved, the objectId must be resolved.
    objectId: string;

    gallons: number;
    name: string;
    recipeKey?: string;
    waterType: WaterTypeValue;
    wallType: WallTypeValue;
    email?: string;
}
