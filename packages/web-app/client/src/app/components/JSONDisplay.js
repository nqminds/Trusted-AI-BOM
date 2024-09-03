import React from "react";
import { Paper, IconButton, Tooltip, useTheme } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const JSONDisplay = ({ data, handleOpenSnackbarWithMessageAndSeverity }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const formatJSON = (json) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      handleOpenSnackbarWithMessageAndSeverity(
        "Input could not be formatted",
        "error"
      );
      return "{}";
    }
  };

  const formattedJSON = formatJSON(data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJSON).then(() => {
      handleOpenSnackbarWithMessageAndSeverity(
        "JSON copied to clipboard",
        "success"
      );
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        m: 3,
      }}
    >
      <Tooltip title="Copy JSON">
        <IconButton
          onClick={copyToClipboard}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: isDarkMode ? "grey.300" : "grey.700",
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter
        language="json"
        style={isDarkMode ? oneDark : oneLight}
      >
        {formattedJSON}
      </SyntaxHighlighter>
    </Paper>
  );
};

export default JSONDisplay;
