import {
  KeyPointsContextProvider,
  ProceedButtonContextProvider,
  ReportDataContextProvider,
  ScreenshotContextProvider,
} from "../contexts/ContextProvider";
import Grid from "@mui/material/Grid";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import { Outlet } from "react-router-dom";
import { DimensionsContextProvider } from "../contexts/DimensionsContextProvider";

function Home() {
  return (
    <>
      <DimensionsContextProvider>
        <ProceedButtonContextProvider>
          <KeyPointsContextProvider>
            <ScreenshotContextProvider>
              <ReportDataContextProvider>
                <Grid container>
                  <Grid xs={12} item>
                    <AppHeader />
                  </Grid>

                  <Grid xs={12} item>
                    <div
                      style={{
                        height: "100vh",
                        width: "100%",
                        overflow: "hidden",
                        backgroundColor: "#1212121c",
                      }}
                      id="parent"
                    >
                      <Outlet />
                    </div>
                  </Grid>

                  <Grid xs={12} item>
                    <AppFooter />
                  </Grid>
                </Grid>
              </ReportDataContextProvider>
            </ScreenshotContextProvider>
          </KeyPointsContextProvider>
        </ProceedButtonContextProvider>
      </DimensionsContextProvider>
    </>
  );
}

export default Home;
