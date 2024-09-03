/* tslint:disable */
/* eslint-disable */
/**
* @returns {KeyPairStruct}
*/
export function gen_keys(): KeyPairStruct;
/**
*/
export class KeyPairStruct {
  free(): void;
/**
* @returns {Uint8Array}
*/
  private_key(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  public_key(): Uint8Array;
}
/**
*/
export class VerifiableCredential {
  free(): void;
/**
* @param {any} verifiable_credential
* @param {string} _schema
*/
  constructor(verifiable_credential: any, _schema: string);
/**
* @param {Uint8Array} private_key
* @returns {VerifiableCredential}
*/
  sign(private_key: Uint8Array): VerifiableCredential;
/**
* @param {Uint8Array} public_key
*/
  verify(public_key: Uint8Array): void;
/**
* @returns {any}
*/
  to_object(): any;
}
/**
*/
export class VerifiablePresentation {
  free(): void;
/**
* @param {any} verifiable_presentation
*/
  constructor(verifiable_presentation: any);
/**
* @param {Uint8Array} private_key
* @returns {VerifiablePresentation}
*/
  sign(private_key: Uint8Array): VerifiablePresentation;
/**
* @param {Uint8Array} public_key
*/
  verify(public_key: Uint8Array): void;
/**
* @returns {any}
*/
  to_object(): any;
}
