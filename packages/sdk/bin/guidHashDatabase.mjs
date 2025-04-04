import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { dirname } from "path";

import os from "os";

const homeDir = os.homedir();
const dbPath = path.join(homeDir, ".taibom/guid_hash.db");

/**
 * Initialize the GUID-Hash table in SQLite.
 * @param {string} dbPath - Path to the SQLite database file.
 * @returns {Database} SQLite database instance.
 */
function initializeGuidHashDatabase() {
    // Ensure directory exists
    if (!existsSync(dirname(dbPath))) {
        mkdirSync(dirname(dbPath), { recursive: true });
    }

    const db = new Database(dbPath);

    // Create table with guid & vc_hash as composite primary keys
    db.exec(`
        CREATE TABLE IF NOT EXISTS guid_hash_table (
            taibom_guid TEXT NOT NULL,
            vc_hash TEXT NOT NULL,
            vc TEXT NOT NULL,
            vc_filepath TEXT NOT NULL,
            resolvable INTEGER NOT NULL, -- 1 (true), 0 (false)
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Unique timestamp for each event
            PRIMARY KEY (taibom_guid, vc_hash, created_at) -- Ensures each event is unique
        );
    `);

    return db;
}

/**
 * Insert or update a GUID-Hash entry.
 * @param {Database} db - SQLite database instance.
 * @param {Object} entry - Entry containing guid, vc_hash, and file path.
 */
function insertGuidHash(db, entry) {
    try {
        const stmt = db.prepare(`
            INSERT INTO guid_hash_table (taibom_guid, vc_hash, vc, vc_filepath, resolvable, created_at)
            VALUES (@taibom_guid, @vc_hash, @vc, @vc_filepath, @resolvable, CURRENT_TIMESTAMP);
        `);
        stmt.run(entry);
    } catch (error) {
        console.error(`❌ Error inserting GUID-Hash entry: ${error.message}`);
    }
}


/**
 * Retrieve entry by GUID or Hash.
 * @param {Database} db - SQLite database instance.
 * @param {Object} query - Query object with guid or vc_hash.
 * @returns {Array} - Matching entries.
 */
function getGuidHash(db, query) {
    let stmt;
    if (query.guid) {
        stmt = db.prepare(`SELECT * FROM guid_hash_table WHERE taibom_guid = ? ORDER BY vc_hash`);
        return stmt.all(query.guid);
    } else if (query.vc_hash) {
        stmt = db.prepare(`SELECT * FROM guid_hash_table WHERE vc_hash = ? ORDER BY taibom_guid`);
        return stmt.all(query.vc_hash);
    }
    return [];
}

export { initializeGuidHashDatabase, insertGuidHash, getGuidHash };
