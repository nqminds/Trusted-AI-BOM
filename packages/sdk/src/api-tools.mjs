import { CookieJar } from "tough-cookie";
import path from "path";
import os from "os";
import fs from "fs";
import crypto from "crypto";
import { voltUtils } from '@tdxvolt/volt-client-web/js';

export const cookiePath = path.join(os.homedir(), ".taibom-cookies.json");
let jar;

try {
    const cookieData = fs.existsSync(cookiePath)
        ? JSON.parse(fs.readFileSync(cookiePath, "utf8"))
        : {};
    jar = CookieJar.fromJSON(cookieData);
} catch (error) {
    jar = new CookieJar();
}

export const cookieJar = jar;
export const URI = "http://localhost:3001";
export const BASE_PATH = "/api/auth";
export const ENDPOINTS = {
    CHALLENGE: "challenge",
    AUTHENTICATE: "authenticate",
    IDENTITY: "identity",
    GET_KEYS: "getKeys",
};

/**
 * Save cookies to disk if they have changed.
 */
export const saveCookies = () => {
    const newCookieString = JSON.stringify(cookieJar.toJSON());
    const currentCookieString = fs.existsSync(cookiePath)
        ? fs.readFileSync(cookiePath, "utf8")
        : "";

    if (newCookieString !== currentCookieString) {
        fs.writeFileSync(cookiePath, newCookieString, "utf8");
    }
};
/**
 * 
 * @param {*} idVC 
 * @param {*} priv 
 * @param {*} apiClient 
 * @param {*} email 
 * @returns 
 */
export async function verifyAndFetchIdentity(idVC, priv_pem, apiClient, email) {
    await verifyWithChallenge(idVC, priv_pem, apiClient) // gets the cookie
    const idVCresponse = await fetch(`${URI}${BASE_PATH}/${ENDPOINTS.IDENTITY}?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Parse the JSON response
    const idVCBody = await idVCresponse.json();
    console.log("ID VC response:", idVCBody);
    return idVCBody;
}

async function getChallenge(apiClient) {
    try {
        const response = await apiClient.get(ENDPOINTS.CHALLENGE, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.body; // Return just the parsed JSON body
    } catch (error) {
        console.error('Error getting challenge:', error.message);
        throw error;
    }
}


async function verifyWithChallenge(idVC, priv_pem, apiClient) {
    const nonce = getChallenge(apiClient);
    const hashedNonce = await hashNonce(nonce);
    const { signature, data } = await signNonce(hashedNonce, priv_pem);
    const response = await authenticate(signature, idVC, data, apiClient);

    return response;
}

/**
 * Converts a base64 ED25519 key directly to PEM format without using node-forge's ASN.1 encoder
 * @param {string} base64Key - The base64-encoded key
 * @param {string} keyType - The type of key ("PRIVATE KEY" or "PUBLIC KEY") 
 * @returns {string} - PEM formatted key
 */
export function getPemFromKey(base64Key, keyType = "PRIVATE KEY") {
    // Pre-encoded ASN.1 DER structures for ED25519 keys
    // These templates follow the RFC 8032 format

    // Templates contain placeholder for the actual key bytes
    const PRIV_KEY_PREFIX = Buffer.from([
        // SEQUENCE
        0x30, 0x2e,
        // INTEGER (version)
        0x02, 0x01, 0x00,
        // SEQUENCE (algorithm)
        0x30, 0x05,
        // OID (Ed25519)
        0x06, 0x03, 0x2B, 0x65, 0x70,
        // OCTET STRING (contains the key)
        0x04, 0x22,
        // OCTET STRING (key bytes)
        0x04, 0x20
    ]);

    const PUB_KEY_PREFIX = Buffer.from([
        // SEQUENCE
        0x30, 0x2a,
        // SEQUENCE (algorithm)
        0x30, 0x05,
        // OID (Ed25519)
        0x06, 0x03, 0x2B, 0x65, 0x70,
        // BIT STRING (contains the key)
        0x03, 0x21, 0x00
    ]);

    // Get the raw key bytes
    const keyBytes = Buffer.from(base64Key, 'base64');

    // Choose the correct prefix based on key type
    const prefix = keyType === "PRIVATE KEY" ? PRIV_KEY_PREFIX : PUB_KEY_PREFIX;

    // Combine prefix and key bytes
    const derBytes = Buffer.concat([prefix, keyBytes]);

    // Convert to base64
    const base64Der = derBytes.toString('base64');

    // Format as PEM
    return formatAsPem(base64Der, keyType);
}

/**
 * Format base64-encoded DER data as a PEM string
 */
function formatAsPem(base64Der, keyType) {
    const pemHeader = `-----BEGIN ${keyType}-----`;
    const pemFooter = `-----END ${keyType}-----`;

    // Split base64 into lines of 64 characters
    const formattedKey = base64Der.match(/.{1,64}/g).join('\n');

    return `${pemHeader}\n${formattedKey}\n${pemFooter}`;
}

async function signNonce(nonce, priv_pem) {
    // get the key from memory and convert it to a usable format
    // Convert nonce to ArrayBuffer for signing
    const encoder = new TextEncoder();
    const data = encoder.encode(nonce);
    const { signBase64, ed25519 } = voltUtils;
    const signature1 = signBase64(priv_pem, data, ed25519, "raw");
    const signatureArray = Buffer.from(signature1, 'base64');
    const sigArray2 = new Uint8Array(signatureArray);
    console.log("Signature:", signature1);
    console.log("Signature Array:", sigArray2);
    return { "signature": sigArray2, "data": data };
}

async function authenticate(signature, idVC, signedData, apiClient) {
    try {
        const response = await apiClient.post(ENDPOINTS.AUTHENTICATE, {
            json: { signature, idVC, signedData },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response; // got automatically parses JSON responses
    } catch (error) {
        console.error('Authentication error:', error.message);
        if (error.response) {
            // Handle response error (e.g., 401, 403)
            console.error('Status code:', error.response.statusCode);
            console.error('Response body:', error.response.body);
        }
        throw error;
    }
}

export async function hashNonce(nonce) {
    const encoder = new TextEncoder();
    const data = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hashBuffer);
}

