import { Box } from "@mui/material";
import { DRAWER_WIDTH } from "@/constants";

export const Main = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 3, md: 4 },
        width: { xs: "100%", sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        mt: "64px", // height of AppBar
      }}
    >
      {children}
    </Box>
  );
};
