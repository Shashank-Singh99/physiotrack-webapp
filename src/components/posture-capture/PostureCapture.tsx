import Webcam from "react-webcam";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import { Box } from "@mui/material";
import FloatingButton from "./FloatingButton";
import { CanvasRenderer } from "./CanvasRenderer";
import { ScreenshotContext } from "../../contexts/ContextProvider";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";

const detectorConfig = {
  runtime: "mediapipe",
  modelType: "full",
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose/",
  enableSmoothing: false,
};

const createDetector = async () => {
  return await poseDetection.createDetector(
    poseDetection.SupportedModels.BlazePose,
    detectorConfig
  );
};

let renderer, detector, camera, rafId;

async function renderResult() {
  if (camera.video.readyState < 2) {
    await new Promise((resolve) => {
      camera.video.onloadeddata = () => {
        resolve(camera.video);
      };
    });
  }

  let poses = null;

  if (detector != null) {
    try {
      poses = await detector.estimatePoses(camera.video, {
        maxPoses: 1,
        flipHorizontal: false,
      });
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }
  }
  const rendererParams = [camera.video, poses, false];
  renderer.draw(rendererParams);
}

export const PostureCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isTriggered, setIsTriggered] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState(new window.Image());
  const [konvaScale, setKonvaScale] = useState(null);

  const { clientWidth, clientHeight } = useContext(DimensionsContext);

  const { setScreenshot } = useContext(ScreenshotContext);

  async function setup() {
    if (!isTriggered) return;
    await tf.ready();
    detector = detector ?? (await createDetector());
    camera = webcamRef.current;
    const canvas = canvasRef.current;
    // canvas.width = camera.video.width;
    // canvas.height = camera.video.height;
    renderer = new CanvasRenderer(canvas);
    renderPrediction();
  }

  useEffect(() => {
    imgSrc ? window.cancelAnimationFrame(rafId) : setup();
  }, [imgSrc]);

  useEffect(() => {
    if (isTriggered) setup();
  }, [isTriggered]);

  async function renderPrediction() {
    if (camera.video == null || imgSrc) {
      return;
    }
    await renderResult();

    rafId = requestAnimationFrame(renderPrediction);
  }

  const triggerCamera = () => {
    setIsTriggered(true);
  };

  const retake = () => setImgSrc(null);

  const uploadFile = (e) => setImgSrc(URL.createObjectURL(e.target.files[0]));

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (!imgSrc) return;
    setScreenshot(imgSrc);
    // konva
    const img = new window.Image();
    img.src = imgSrc;
    img.width = clientWidth;
    img.height = clientHeight;
    setImage(img);
    const imageWidth = image.width || clientWidth;
    const imageHeight = image.height || clientHeight;

    const scaleX = clientWidth / imageWidth;
    const scaleY = clientHeight / imageHeight;
    setKonvaScale(Math.max(scaleX, scaleY));
  }, [imgSrc]);

  if (!isTriggered) {
    return (
      <div>
        <Box
          component="div"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(posture-capture/pose3.png)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <FloatingButton onClickHandle={triggerCamera} color="primary" />
        </Box>
      </div>
    );
  }

  if (imgSrc) {
    return (
      <>
      <div style={{ width: "100%", height: "100vh"}}>
        <img
          style={{objectFit: "contain", position:"absolute"}}
          src={imgSrc}
        ></img>
        <FloatingButton onClickHandle={retake} color="secondary" />
      </div>
      </>
    );
  }

  return (
    <>
      <Webcam
        ref={webcamRef}
        mirrored
        width={clientWidth}
        height={clientHeight}
        style={{
          position: "absolute",
        }}
        videoConstraints={{
          facingMode: "environment",
          width: clientWidth,
          height: clientHeight,
          frameRate: { ideal: 60 },
        }}
      />
      <canvas
        ref={canvasRef}
        width={clientWidth}
        height={clientHeight}
        style={{ position: "absolute" }}
      />
      <FloatingButton onClickHandle={capture} color="primary"/>
    </>
  );
};
