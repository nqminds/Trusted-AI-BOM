"use client";

import { useState, useEffect } from "react";
import {
  Select,
  Container,
  Box,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Alert,
  TextField,
  Stack,
  Snackbar,
  MenuItem,
  Card,
  CardHeader,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import JSONDisplay from "./components/JSONDisplay";

export default function Home() {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedSchemaData, setSelectedSchemaData] = useState({});
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [severitySnackbar, setSeveritySnackbar] = useState("success");

  useEffect(() => {
    fetch("http://localhost:3001/schemas")
      .then((res) => res.json())
      .then((schemas) => {
        setSchemas(schemas);
        console.log("Available schemas:", schemas);
      })
      .catch((error) => console.error("Error fetching schemas:", error));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDependencyChange = (type, index, field, value) => {
    setFormData((prev) => {
      const dependencies = { ...prev.dependencies };
      const items = [...(dependencies[type] || [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, dependencies: { ...dependencies, [type]: items } };
    });
  };

  const addDependencyField = (type) => {
    setFormData((prev) => {
      const dependencies = { ...prev.dependencies };
      const items = [...(dependencies[type] || []), { id: "", relation: "" }];
      return { ...prev, dependencies: { ...dependencies, [type]: items } };
    });
  };

  const removeDependencyField = (type, index) => {
    setFormData((prev) => {
      const dependencies = { ...prev.dependencies };
      const items = [...(dependencies[type] || [])];
      items.splice(index, 1);
      return { ...prev, dependencies: { ...dependencies, [type]: items } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Loop through the form data, if any empty array is found, remove it. This may need to be recursive as some fields may be nested.
    // Recursive function to clean the formData
    const cleanData = (data) => {
      if (Array.isArray(data)) {
        return data
          .map(cleanData) // Recursively clean each item in the array
          .filter((item) => item !== null && item !== undefined); // Remove empty items
      } else if (typeof data === "object" && data !== null) {
        const cleanedObject = Object.entries(data).reduce(
          (acc, [key, value]) => {
            const cleanedValue = cleanData(value); // Recursively clean the value
            if (
              cleanedValue !== null &&
              cleanedValue !== undefined &&
              // Remove empty objects and arrays
              (typeof cleanedValue !== "object" ||
                (Array.isArray(cleanedValue) && cleanedValue.length > 0) ||
                (typeof cleanedValue === "object" &&
                  Object.keys(cleanedValue).length > 0))
            ) {
              acc[key] = cleanedValue;
            }
            return acc;
          },
          {}
        );
        return Object.keys(cleanedObject).length > 0 ? cleanedObject : null; // Return null if the object is empty
      }
      return data; // Return the original data if it's not an array or object
    };

    const cleanedFormData = cleanData(formData);

    const res = await fetch("http://localhost:3001/submit-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schemaName: selectedSchemaData.$id,
        claimData: cleanedFormData,
      }),
    });
    const result = await res.json();
    if (res.status !== 200) {
      handleOpenSnackbarWithMessageAndSeverity(
        result.error || "Error submitting claim",
        "error"
      );
    } else {
      handleOpenSnackbarWithMessageAndSeverity(
        "Claim submitted successfully",
        "success"
      );
    }

    setResult(result);
  };

  const handleSchemaSelect = async (e) => {
    try {
      setSelectedSchema(e.target.value);
      setFormData({});
      setResult("");
      const res = await fetch(`http://localhost:3001/schema/${e.target.value}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const schema = await res.json();
      setSelectedSchemaData(schema);
      setFormData({});
    } catch (error) {
      console.error("Error fetching schema:", error);
      setSelectedSchemaData({});
      setFormData({});
    }
  };

  const handleOpenSnackbarWithMessageAndSeverity = (message, severity) => {
    setOpenSnackbar(true);
    setMessageSnackbar(message);
    setSeveritySnackbar(severity);
  };

  return (
    <Container>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          mt: 1,
        }}
      >
        TAIBOM Claim Submitter
      </Typography>
      {schemas.length !== 0 ? (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel>Select a Schema</InputLabel>
            <Select
              value={selectedSchema}
              label="Select a Schema"
              onChange={handleSchemaSelect}
            >
              {schemas.map((schema) => (
                <MenuItem key={schema} value={schema}>
                  {schema}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: "center",
          }}
        >
          Loading schemas...
        </Typography>
      )}

      {selectedSchemaData.$id && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 700, margin: "auto", mt: 4 }}
        >
          {Object.entries(selectedSchemaData.properties).map(
            ([field, prop], index) =>
              field === "dependencies" ? (
                <Box key={field} sx={{ mt: 2 }}>
                  <Typography variant="h5">Dependencies</Typography>
                  {Object.keys(prop.properties).map((type) => (
                    <Paper key={type} sx={{ p: 2, mt: 2 }} elevation={3}>
                      <Typography variant="h6">{type}</Typography>
                      {(formData.dependencies?.[type] || []).map((item, i) => (
                        <Box sx={{ mt: 1 }} key={i}>
                          <Stack spacing={2} direction={"row"}>
                            {Object.entries(
                              prop.properties[type].items.properties
                            ).map(([subField, subProp]) => (
                              <TextField
                                key={subField}
                                label={subField}
                                value={item[subField] || ""}
                                onChange={(e) =>
                                  handleDependencyChange(
                                    type,
                                    i,
                                    subField,
                                    e.target.value
                                  )
                                }
                                fullWidth
                                required={prop.properties[
                                  type
                                ].items.required?.includes(subField)}
                              />
                            ))}
                            <IconButton
                              color="primary"
                              onClick={() => removeDependencyField(type, i)}
                            >
                              <RemoveCircleIcon />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={() => addDependencyField(type)}
                        sx={{ mt: 2 }}
                      >
                        Add {type} Dependency
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <TextField
                  key={field}
                  sx={{ mb: 2 }}
                  type="text"
                  label={field}
                  fullWidth
                  value={formData[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required={selectedSchemaData.required.includes(field)}
                />
              )
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4, display: "block", mx: "auto" }}
          >
            Submit Claim
          </Button>
        </Box>
      )}

      {result && (
        <JSONDisplay
          data={result}
          handleOpenSnackbarWithMessageAndSeverity={
            handleOpenSnackbarWithMessageAndSeverity
          }
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severitySnackbar}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
}
