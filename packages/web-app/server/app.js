import express from 'express';
import cors from 'cors';
import { fetchSchema, processClaimData } from './claimProcessor.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemasDirectory = path.resolve(__dirname, "../../schemas/src");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;


app.get('/schemas', async (req, res) => {
  try {
    const files = await fs.readdir(schemasDirectory);
    console.log(files);
    const schemaFiles = files.filter(file => file.endsWith('.schema.yaml'));
    const schemas = schemaFiles.map(file => path.parse(path.parse(file).name).name);
    res.json(schemas);
  } catch (error) {
    console.error('Error reading schemas directory:', error);
    res.status(500).json({ error: 'Unable to fetch schemas' });
  }
});

app.get('/schema/:schemaName', async (req, res) => {
  try {
    const schemaPath = path.join(schemasDirectory, `${req.params.schemaName}.schema.yaml`);
    const schema = await fetchSchema(schemaPath);
    res.json(schema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/submit-claim', async (req, res) => {
  try {
    const { schemaName, claimData } = req.body;
    const schema = await fetchSchema(`${schemasDirectory}/${schemaName}.schema.yaml`);
    const result = await processClaimData(schema, claimData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});