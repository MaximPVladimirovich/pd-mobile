import * as RNFS from 'react-native-fs';
import { Recipe } from 'models/recipe/Recipe';
import { big3 } from './recipes/Big3';
import * as async from 'async';
import { Alert } from 'react-native';

const recipeFolderName = 'recipes';
const defaultRecipes: Recipe[] = [big3];

export class RecipeRepository {
    /// Attempts to load the recipes from the Recipe folder
    loadLocalRecipeWithId = async (recipeId: string): Promise<Recipe> => {
        const filePath = this.getFilepathForRecipeId(recipeId);

        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return Promise.reject('File does not exist!');
        }

        const fileData = await RNFS.readFile(filePath, 'utf8');
        const recipe: Recipe = JSON.parse(fileData);
        // TODO: validate recipe object here

        return recipe;
    }

    /// Saves all the pre-packaged recipes to the file-system:
    savePreloadedRecipes = async () => {
        try {
            await this.ensureRecipeDirectoryExists();
        } catch (e) {
            return Promise.reject(e);
        }
        async.forEach(defaultRecipes, async (recipe, callback) => {
            try {
                await this.saveRecipe(recipe);
                callback();
            } catch (e) {
                callback(e);
            }
        }, (error) => {
            if ((error !== undefined) || (error !== null)) {
                return Promise.reject(error);
            }
            return Promise.resolve();
        });
    }

    /// Saves recipe, will overwrite existing file if it already exists.
    private saveRecipe = async (recipe: Recipe): Promise<Boolean> => {
        const filePath = this.getFilepathForRecipeId(recipe.objectId);
        const fileData = JSON.stringify(recipe);
        
        try {
            await RNFS.writeFile(filePath, fileData, 'utf8');
            return true;
        } catch (e) {
            console.warn(JSON.stringify(e));
            return Promise.reject(e);
        }
    }

    private ensureRecipeDirectoryExists = async () => {
        const dirPath = `${RNFS.DocumentDirectoryPath}/${recipeFolderName}`
        const fileExists = await RNFS.exists(dirPath);
        if (!fileExists) {
            try {
                await RNFS.mkdir(dirPath);
            } catch (e) {
                console.warn(e);
                return Promise.reject(e);
            }
        }
    }

    private getFilepathForRecipeId(recipeId: string): string {
        const fileName = recipeId + '.of';
        const filePath = `${RNFS.DocumentDirectoryPath}/${recipeFolderName}/${fileName}`;
        console.warn(filePath);
        return filePath;
    }

    private deleteRecipeWithId = async (recipeId: string): Promise<boolean> => {
        const filePath = this.getFilepathForRecipeId(recipeId);
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return false;
        }

        try {
            await RNFS.unlink(filePath);
            return true;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
