/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const normalize_object: (a: any) => [number, number, number];
export const normalize_and_stringify: (a: any) => [number, number, number, number];
export const sign: (a: any, b: number, c: number) => [number, number, number];
export const verify: (a: any, b: number, c: number) => [number, number, number];
export const verify_with_schema_check: (a: any, b: number, c: number, d: any) => [number, number, number];
export const __wbg_keypair_free: (a: number, b: number) => void;
export const keypair_new: (a: number, b: number, c: number, d: number) => number;
export const keypair_signing_key: (a: number) => [number, number];
export const keypair_verifying_key: (a: number) => [number, number];
export const generate_keypair: () => number;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_exn_store: (a: number) => void;
export const __externref_table_alloc: () => number;
export const __wbindgen_export_4: WebAssembly.Table;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_start: () => void;
