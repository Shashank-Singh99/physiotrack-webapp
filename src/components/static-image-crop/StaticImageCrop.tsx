import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ProceedButtonContext,
  ScreenshotContext,
} from "../../contexts/ContextProvider";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";
import Box from "@mui/material/Box";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";
import { Layer, Stage, Image as KonvaImage } from "react-konva";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function StaticImageCrop() {
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropComplete, setIsCropComplete] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>(null);
  const [image, setImage] = useState(new window.Image());

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { screenshot, setScreenshot } = useContext(ScreenshotContext);
  const { clientHeight, clientWidth } = useContext(DimensionsContext);
  const { setProceedBtnFn } = useContext(ProceedButtonContext);

  useEffect(() => {
    setProceedBtnFn(() => completeCrop);
  }, []);

  useEffect(() => {
    if (!isCropComplete) return;

    confirmCroppedImage();
  }, [isCropComplete]);

  const confirmCroppedImage = () => {
    if (!completedCrop) return;
    const canvas = document.createElement("canvas");
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      originalImage,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    const image = canvas.toDataURL();
    setScreenshot(image);
    setIsCropComplete(true);
    // Konva properties
    const img = new window.Image();
    img.src = image;
    img.width = completedCrop.width;
    img.height = completedCrop.height;
    setImage(img);
  };

  const completeCrop = () => {
    setOriginalImage(imgRef.current);
    setIsCropComplete(true);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  // useEffect(() => {
  //   console.log("Image ref : ", imgRef);
  // }, [completedCrop]);

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  if (!screenshot) {
    return (
      <>
        <Box>Error</Box>
      </>
    );
  }

  // Konva code
  const imageWidth = image.width || clientWidth;
  const imageHeight = image.height || clientHeight;

  const scaleX = clientWidth / imageWidth;
  const scaleY = clientHeight / imageHeight;
  const konvaScale = Math.max(scaleX, scaleY);

  return (
    <>
      {!!screenshot && !isCropComplete && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined} // Put aspect state variable here to see the effect of toggle aspect
          // minWidth={400}
          minHeight={100}
          // circularCrop
        >
          <img
            ref={imgRef}
            alt="Crop me"
            height={clientHeight}
            width={clientWidth}
            src={screenshot}
            style={{ transform: `scale(${scale})` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {isCropComplete && (
        <>
          <Stage width={clientWidth} height={clientHeight}>
            <Layer>
              <KonvaImage
                draggable
                image={image}
                height={clientHeight}
                width={clientWidth}
              />
            </Layer>
          </Stage>
        </>
      )}
    </>
  );
}

export default StaticImageCrop;
