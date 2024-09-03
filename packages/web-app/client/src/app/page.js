'use client'

import { useState, useEffect } from 'react';

export default function Home() {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/schemas')
      .then(res => res.json())
      .then(schemas => {
        setSchemas(schemas);
        console.log('Available schemas:', schemas);
      })
      .catch(error => console.error('Error fetching schemas:', error));
  }, []);

  const handleSchemaSelect = async (schemaName) => {
    const res = await fetch(`http://localhost:3001/schema/${schemaName}`);
    const schema = await res.json();
    setSelectedSchema(schema);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/submit-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemaName: selectedSchema.$id, claimData: formData }),
    });
    const result = await res.json();
    setResult(result);
  };

  return (
    <div>
      <h1>TAIBOM Claim Submitter</h1>
      <select onChange={(e) => handleSchemaSelect(e.target.value)}>
        <option value="">Select a schema</option>
        {schemas.map(schema => (
          <option key={schema} value={schema}>{schema}</option>
        ))}
      </select>
      {selectedSchema && (
        <form onSubmit={handleSubmit}>
          {Object.entries(selectedSchema.properties).map(([field, prop]) => (
            <div key={field}>
              <label>{field}: </label>
              <input
                type="text"
                onChange={(e) => handleInputChange(field, e.target.value)}
                required={selectedSchema.required.includes(field)}
              />
            </div>
          ))}
          <button type="submit">Submit Claim</button>
        </form>
      )}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}