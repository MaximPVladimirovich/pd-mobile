/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "UserAndMaybeDiscourse";
  id: string;
  discourse_payload: string | null;
}

export interface Register {
  register: Register_register;
}

export interface RegisterVariables {
  username: string;
  email: string;
  password: string;
  sso?: string | null;
  sig?: string | null;
}
