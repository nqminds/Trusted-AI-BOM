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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_verifiablepresentation_free: (a: number, b: number) => void;
  readonly __wbg_verifiablecredential_free: (a: number, b: number) => void;
  readonly verifiablepresentation_new: (a: number, b: number) => void;
  readonly verifiablepresentation_sign: (a: number, b: number, c: number, d: number) => void;
  readonly verifiablepresentation_verify: (a: number, b: number, c: number, d: number) => void;
  readonly verifiablepresentation_to_object: (a: number, b: number) => void;
  readonly verifiablecredential_new: (a: number, b: number, c: number, d: number) => void;
  readonly verifiablecredential_sign: (a: number, b: number, c: number, d: number) => void;
  readonly verifiablecredential_verify: (a: number, b: number, c: number, d: number) => void;
  readonly verifiablecredential_to_object: (a: number, b: number) => void;
  readonly __wbg_keypairstruct_free: (a: number, b: number) => void;
  readonly keypairstruct_private_key: (a: number, b: number) => void;
  readonly keypairstruct_public_key: (a: number, b: number) => void;
  readonly gen_keys: (a: number) => void;
  readonly ring_core_0_17_8_bn_mul_mont: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
