import * as poseDetection from "@tensorflow-models/pose-detection";
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
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Line,
  Arc,
} from "react-konva";
import useImage from "use-image";
import { Image as KonvaImageType } from "konva/lib/shapes/Image";
import { KonvaEventObject } from "konva/lib/Node";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";
import { Point, ReportData } from "../../types/types";
import { findAngle, getMidPoint } from "./utils";
import { ANGLES, BLACK_LIST, CONNECTIONS } from "./constants";
import { Stage as StageType } from "konva/lib/Stage";

const detectorConfig = {
  runtime: "mediapipe",
  modelType: "heavy",
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose/",
  enableSmoothing: false,
};

type ArcType = {
  angle: number;
  radius: number;
  x: number;
  y: number;
  clockWise: boolean;
  inference?: string;
};

function PostureVerify() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [keyPoints, setKeyPoints] = useState<poseDetection.Keypoint[]>([]);
  const [arcs, setArcs] = useState<ArcType[]>([]);
  const [isPostureVerified, setIsPostureVerified] = useState(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector>(null);

  const { clientWidth, clientHeight } = useContext(DimensionsContext);
  const { setProceedBtnFn } = useContext(ProceedButtonContext);
  const { setScreenshot } = useContext(ScreenshotContext);
  const { setReportData } = useContext(ReportDataContext);

  const konvaRef = useRef<KonvaImageType>(null);
  const stageRef = useRef<StageType>(null);

  useEffect(() => {
    setProceedBtnFn(() => verifyPosture);
  }, []);

  const drawArcs = (
    leftNumber: number,
    rightNumber: number,
    inference: string
  ): ArcType => {
    if (keyPoints.length <= 0) return;

    const right = keyPoints[rightNumber] as poseDetection.Keypoint;
    const left = keyPoints[leftNumber] as poseDetection.Keypoint;
    const p1: Point = { x: right.x, y: right.y };
    const p2: Point = { x: left.x, y: left.y };

    const midPoint = getMidPoint(p2, p1);
    const offSet = (midPoint.x - p2.x) / 2;
    const p3: Point = { x: midPoint.x + offSet, y: left.y };

    const angleInRadians = findAngle(p1, p2, p3);

    const angleInDegrees = angleInRadians * (180 / Math.PI);

    return drawArc(p1, p2, p3, angleInDegrees, inference);
  };

  const confirmPosture = () => {
    const drawnArcs: ArcType[] = ANGLES.map((a) =>
      drawArcs(a.left, a.right, a.inference)
    );
    setArcs(drawnArcs);
    const reportData: ReportData[] = drawnArcs.map((arc) => {
      return {
        inference: arc.inference,
        angle: arc.angle,
      };
    });
    setReportData(reportData);
  };

  function drawArc(
    p1: Point,
    p2: Point,
    p3: Point,
    angle: number,
    inference: string
  ): ArcType {
    const radius = p3.x - p2.x;
    const isCounterClockwise = p3.y > p1.y;
    const endAngle = p3.y > p1.y ? -angle : angle;

    const arc: ArcType = {
      radius,
      angle: endAngle,
      x: p2.x,
      y: p2.y,
      clockWise: isCounterClockwise,
      inference,
    };

    return arc;
  }

  // const createNewPostureImage = (): HTMLImageElement => {
  //   const image = new Image();
  //   image.src = canvas.toDataURL();
  //   image.width = canvas.width;
  //   image.height = canvas.height;
  //   return image;
  // };

  useEffect(() => {
    async function drawImageWithLandmarksOnCanvas(
      detector: poseDetection.PoseDetector
    ) {
      if (!konvaRef.current || !detector) return;
      const image = new Image();
      image.src = konvaRef.current.toDataURL();
      // image.width = window.innerWidth;
      // image.height = window.innerHeight;
      image.width = clientWidth;
      image.height = clientHeight;
      const poses = await detector.estimatePoses(image);
      setKeyPoints(poses[0].keypoints);
    }

    async function getDetector() {
      try {
        if (detector === null) {
          setLoading(true);
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            detectorConfig
          );
          setDetector(detector);
          setLoading(false);
          drawImageWithLandmarksOnCanvas(detector);
        }
        return;
      } catch (error) {
        console.error("Error has occured while initializing model");
        console.error(error);
        setError(error);
        setLoading(false);
      }
    }
    getDetector();
  }, []);

  if (error) {
    return <>Error: {error}</>;
  }

  const handleDragStart = (
    e: KonvaEventObject<DragEvent>,
    pointName: string
  ) => {
    console.log("Point index : ", pointName, " Points : ", e.target.x());
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, pointName: string) => {
    console.log("Point index : ", pointName, " Points : ", e.target.x());
    const updatedKeyPoints = keyPoints.map((point) => {
      if (point.name === pointName) {
        point.x = e.target.x();
        point.y = e.target.y();
      }
      return point;
    });
    setKeyPoints(updatedKeyPoints);
  };

  const verifyPosture = async () => {
    setIsPostureVerified(true);
  };

  useEffect(() => {
    if (!isPostureVerified) return;

    confirmPosture();
  }, [isPostureVerified]);

  useEffect(() => {
    if (arcs.length > 0) {
      setScreenshot(stageRef.current.toDataURL());
    }
  }, [arcs]);

  return (
    <div>
      {keyPoints && (
        <Stage width={clientWidth} height={clientHeight} ref={stageRef}>
          <Layer>
            <CustomImage ref={konvaRef} />
          </Layer>
          <Layer>
            {keyPoints
              .filter((keypoint) => !BLACK_LIST.includes(keypoint.name))
              .map((keyPoint) => {
                return (
                  <Circle
                    x={keyPoint.x}
                    y={keyPoint.y}
                    key={keyPoint.name}
                    radius={6}
                    fill="rgb(0, 216, 216)"
                    stroke="white"
                    strokeWidth={4}
                    onDragStart={(e) => handleDragStart(e, keyPoint.name)}
                    onDragEnd={(e) => handleDragEnd(e, keyPoint.name)}
                    draggable
                  ></Circle>
                );
              })}
          </Layer>
          {isPostureVerified && keyPoints.length > 0 && (
            <Layer>
              {CONNECTIONS.map((con, index) => {
                return (
                  <Line
                    key={index}
                    points={[
                      keyPoints[con[0]].x,
                      keyPoints[con[0]].y,
                      keyPoints[con[1]].x,
                      keyPoints[con[1]].y,
                    ]}
                    stroke="white"
                    strokeWidth={4}
                    perfectDrawEnabled
                  />
                );
              })}
            </Layer>
          )}
          {isPostureVerified && arcs.length > 0 && (
            <Layer>
              {arcs.map((angle, index) => {
                return (
                  <Arc
                    key={index}
                    angle={angle.angle}
                    x={angle.x}
                    y={angle.y}
                    stroke="red"
                    strokeWidth={3}
                    innerRadius={angle.radius}
                    outerRadius={0}
                    clockwise={angle.clockWise}
                  />
                );
              })}
            </Layer>
          )}
        </Stage>
      )}
    </div>
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

  return <KonvaImage ref={ref} image={image} />;
});

export default PostureVerify;
