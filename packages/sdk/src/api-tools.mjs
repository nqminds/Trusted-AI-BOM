import { CookieJar } from "tough-cookie";
import path from "path";
import os from "os";
import fs from "fs";

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