import { createContext, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { ReportData } from "../types/types";

export const ScreenshotContext = createContext<ScreenShotContextType>(null);

type ScreenShotContextType = {
  screenshot: string;
  setScreenshot: React.Dispatch<React.SetStateAction<string>>;
}

export const ScreenshotContextProvider = ({ children }) => {
  const [screenshot, setScreenshot] = useState<string>(null);

  return (
    <ScreenshotContext.Provider value={{ screenshot, setScreenshot }}>
      {children}
    </ScreenshotContext.Provider>
  );
};

export const KeyPointsContext = createContext(null);

export const KeyPointsContextProvider = ({ children }) => {
  const [globalKeyPoints, setGlobalKeyPoints] = useState<poseDetection.Keypoint[]>(null);

  return (
    <KeyPointsContext.Provider value={{ globalKeyPoints, setGlobalKeyPoints }}>
      {children}
    </KeyPointsContext.Provider>
  );
};


export const ProceedButtonContext = createContext<ProceedButtonContextType>(null);

export type ProceedButtonContextType = {
  proceedBtnFn: (...args: any[]) => {};
  setProceedBtnFn: React.Dispatch<React.SetStateAction<any>>;
};

export const ProceedButtonContextProvider = ({ children }) => {
  const [proceedBtnFn, setProceedBtnFn] = useState(null);

  return (
    <ProceedButtonContext.Provider value={{ proceedBtnFn, setProceedBtnFn }}>
      {children}
    </ProceedButtonContext.Provider>
  );
};


export const ReportDataContext = createContext<ReportDataContextType>(null);

export type ReportDataContextType = {
  reportData: ReportData[];
  setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>;
};

export const ReportDataContextProvider = ({ children }) => {
  const [reportData, setReportData] = useState<ReportData[]>(null);

  return (
    <ReportDataContext.Provider value={{ reportData, setReportData }}>
      {children}
    </ReportDataContext.Provider>
  );
};