import { Box, Container } from "@mui/material";

export const Main = ({ children }) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      mt: 8,
      backgroundColor: "background.default",
    }}
  >
    <Container maxWidth="xl"> {children}</Container>
  </Box>
);
