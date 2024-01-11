import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useContext } from "react";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";

export const CustomLoader = () => {
    const { clientHeight } = useContext(DimensionsContext);
  return (
    <Stack alignItems="center" height={clientHeight}>
      <CircularProgress />
    </Stack>
  );
};
