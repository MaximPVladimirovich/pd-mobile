/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Recipe
// ====================================================

export interface Recipe_recipeVersion_readings {
  __typename: "Reading";
  name: string;
  var: string;
  sliderMin: number | null;
  sliderMax: number | null;
  idealMin: number | null;
  idealMax: number | null;
  type: string;
  decimalPlaces: number | null;
  units: string | null;
  defaultValue: number;
}

export interface Recipe_recipeVersion_treatments {
  __typename: "Treatment";
  name: string;
  var: string;
  formula: string;
  type: string;
  concentration: number;
}

export interface Recipe_recipeVersion {
  __typename: "Recipe";
  id: string;
  author_id: string;
  author_username: string;
  name: string;
  description: string;
  ts: number;
  readings: Recipe_recipeVersion_readings[];
  treatments: Recipe_recipeVersion_treatments[];
}

export interface Recipe {
  recipeVersion: Recipe_recipeVersion;
}

export interface RecipeVariables {
  id: string;
  ts: number;
}
