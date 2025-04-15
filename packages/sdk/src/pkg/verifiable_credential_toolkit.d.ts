/* tslint:disable */
/* eslint-disable */
export function normalize_object(input: any): any;
export function normalize_and_stringify(input: any): string;
export function sign(unsigned_vc: any, private_key: Uint8Array): any;
export function verify(signed_vc: any, public_key: Uint8Array): boolean;
export function verify_with_schema_check(signed_vc: any, public_key: Uint8Array, schema: any): boolean;
/**
 * Generate a new keypair
 */
export function generate_keypair(): KeyPair;
export class KeyPair {
  private constructor();
  free(): void;
  static new(signing_key: Uint8Array, verifying_key: Uint8Array): KeyPair;
  signing_key(): Uint8Array;
  verifying_key(): Uint8Array;
}
