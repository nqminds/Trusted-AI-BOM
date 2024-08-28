#!/usr/bin/env node
'use strict'

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import inquirer from "inquirer";
import YAML from 'yaml';
import { VerifiableCredential, VerifiablePresentation, gen_keys } from 'vc_signing';
import { v4 as uuidv4 } from 'uuid';

async function fetchSchema(schemaPath) {
  try {
    if (schemaPath.startsWith('http')) {
      const response = await axios.get(schemaPath);
      return YAML.parse(response.data);
    } else {
      const absolutePath = path.resolve(schemaPath);
      const schemaContent = fs.readFileSync(absolutePath, 'utf8');
      return YAML.parse(schemaContent);
    }
  } catch (error) {
    console.error('Error fetching schema:', error.message);
    process.exit(1);
  }
}

function parseArguments() {
  return yargs(hideBin(process.argv))
    .option('interactive', {
      type: 'boolean',
      default: true,
      description: 'Enable interactive prompts for missing fields'
    })
    .option('schema', {
      type: 'string',
      description: 'URL or path to the schema file',
      demandOption: true
    })
    .help()
    .parse();
}

// Recursive function to handle nested fields
async function promptForMissingFields(schema, existingData, interactive, currentPath = '') {
  const result = { ...existingData };
  const requiredFields = schema.required || [];
  const allFields = Object.keys(schema.properties);

  for (const field of allFields) {
      const fieldPath = currentPath ? `${currentPath}.${field}` : field; // Include full path

      if (result[field] === undefined) {
          const isRequired = requiredFields.includes(field);
          const fieldSchema = schema.properties[field];

          if (fieldSchema.type === 'object') {
              // Handle nested objects
              result[field] = await promptForMissingFields(fieldSchema, result[field] || {}, interactive, fieldPath);
          } else if (fieldSchema.type === 'array' && fieldSchema.items && fieldSchema.items.type === 'object') {
              // Handle arrays of objects
              result[field] = result[field] || [];
              let addMore = true;
              let index = 0;

              while (addMore) {
                  const itemPath = `${fieldPath}[${index}]`;
                  const itemResult = await promptForMissingFields(fieldSchema.items, {}, interactive, itemPath);
                  result[field].push(itemResult);

                  addMore = await inquirer.prompt([{
                      type: 'confirm',
                      name: 'addMore',
                      message: `Add another item to ${fieldPath}?`,
                      default: false
                  }]).then(answers => answers.addMore);

                  index++;
              }
          } else {
              if (interactive || isRequired) {
                  const answer = await inquirer.prompt([{
                      type: 'input',
                      name: field,
                      message: `Enter value for ${fieldPath}${isRequired ? ' (required)' : ''}:`,
                      validate: (input) => {
                          if (isRequired && !input) return 'This field is required';
                          return true;
                      }
                  }]);
                  if (answer[field]) {
                      result[field] = answer[field];
                  }
              }
          }
      }
  }

  return result;
}

async function main() {
  const args = parseArguments();
  const schema = await fetchSchema(args.schema);

  console.log(`Using schema with $id: ${schema.$id}`);

  const existingData = { ...args };
  delete existingData._;
  delete existingData.$0;
  delete existingData.interactive;
  delete existingData.schema;

  const finalData = await promptForMissingFields(schema, existingData, args.interactive);

  const requiredFields = schema.required || [];
  const missingRequired = requiredFields.filter(field => !finalData[field]);

  if (missingRequired.length > 0) {
    console.error(`Error: Missing required fields: ${missingRequired.join(', ')}`);
    process.exit(1);
  }

  let keys = gen_keys();

  const vc = new VerifiableCredential({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    id: `urn:uuid:${uuidv4()}`,
    type: ["VerifiableCredential"],
    credentialSubject: finalData,
    "credentialSchema": {
      "id": schema.$id,
      "type": "JsonSchema"
    },
    "issuer": `urn:uuid:${uuidv4()}`
  }, "").sign(keys.private_key());

  const vp = new VerifiablePresentation({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    id: `urn:uuid:${uuidv4()}`,
    type: ["VerifiablePresentation", "UserCredential"],
    verifiableCredential: [vc.to_object()],
    holder: `urn:uuid:${uuidv4()}`
  }).sign(keys.private_key()).to_object();

  console.log(JSON.stringify(vp, null, 2));
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
