import {
  LegacyRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ProceedButtonContext,
  ReportDataContext,
  ScreenshotContext,
} from "../../contexts/ContextProvider";
import {
  BlobProvider,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import PdfDocument from "../pdf-document/PdfDocument";
import { Layer, Stage, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";
import { Image as KonvaImageType } from "konva/lib/shapes/Image";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Box, Fab } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { CustomLoader } from "./CustomLoader";

// https://github.com/diegomura/react-pdf/issues/1113
// https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function PostureAnalysis() {
  const reportRef = useRef(null);
  const { clientHeight, clientWidth } = useContext(DimensionsContext);
  const { setScreenshot } = useContext(ScreenshotContext);
  const { setProceedBtnFn } = useContext(ProceedButtonContext);
  const { reportData } = useContext(ReportDataContext);

  const [isReportViewed, setIsReportViewed] = useState(false);
  const [mainImgSrc, setMainImgSrc] = useState<string>(null);

  useEffect(() => {
    setProceedBtnFn(() => previewReport);
  }, []);

  useEffect(() => {
    if (reportRef.current === null) {
      return;
    }
    setMainImgSrc(reportRef.current.toDataURL());
  }, [reportRef]);

  function previewReport() {
    setMainImgSrc(reportRef.current.toDataURL());
    setIsReportViewed(true);

    setScreenshot(null);
  }

  const downloadPdf = () => {};

  return (
    <>
      {isReportViewed ? (
        isReportViewed && (
          <>
            <Box sx={{ margin: 10 }}> </Box>
            <BlobProvider
              document={
                <PdfDocument mainImgSrc={mainImgSrc} data={reportData} />
              }
            >
              {({ blob, url, loading }) => {
                return loading ? (
                 <CustomLoader />
                ) : (
                  <Document
                    file={url}
                    onLoadSuccess={(pdf) => {}}
                    renderMode="canvas"
                  >
                    <Page
                      pageNumber={1}
                      width={clientWidth}
                      height={clientHeight}
                    />
                  </Document>
                );
              }}
            </BlobProvider>
            <PDFDownloadLink
              document={
                <PdfDocument mainImgSrc={mainImgSrc} data={reportData} />
              }
              fileName="PhysioTrack Anterior Posture Evaluation.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <CustomLoader />
                ) : (
                  <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: "absolute", bottom: 110, right: 16 }}
                    onClick={downloadPdf}
                  >
                    <DownloadIcon />
                  </Fab>
                )
              }
            </PDFDownloadLink>
          </>
        )
      ) : (
        <Stage width={clientWidth} height={clientHeight}>
          <Layer>
            <CustomImage ref={reportRef} />
          </Layer>
        </Stage>
      )}
    </>
  );
}

const CustomImage = forwardRef((props, ref: LegacyRef<KonvaImageType>) => {
  const { screenshot } = useContext(ScreenshotContext);
  const [image] = useImage(screenshot);
  const { clientWidth, clientHeight } = useContext(DimensionsContext);
  if (image) {
    image.height = clientHeight;
    image.width = clientWidth;
  }

  return <KonvaImage draggable ref={ref} image={image} />;
});

export default PostureAnalysis;
