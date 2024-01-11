import * as posedetection from "@tensorflow-models/pose-detection";

const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_THRESHOLD = 0.65;
const DEFAULT_RADIUS = 4;

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D;
  videoWidth: number;
  videoHeight: number;
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.videoWidth = canvas.width;
    this.videoHeight = canvas.height;
    this.flip(this.videoWidth);
  }

  flip(videoWidth) {
    // Because the image from camera is mirrored, need to flip horizontally.
    this.ctx.translate(videoWidth, 0);
    this.ctx.scale(-1, 1);
  }

  draw(rendererParams) {
    const [video, poses] = rendererParams;
    this.drawCtx(video);

    if (poses && poses.length > 0) {
      this.drawResults(poses);
    }
  }

  drawCtx(video) {
    this.ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
  }

  drawResults(poses) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  drawResult(pose) {
    if (pose.keypoints != null) {
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints, pose.id);
    }
  }

  drawKeypoints(keypoints) {
    const keypointInd = posedetection.util.getKeypointIndexBySide(
      posedetection.SupportedModels.BlazePose
    );
    this.ctx.fillStyle = "Red";
    this.ctx.strokeStyle = "White";
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
      this.drawKeypoint(keypoints[i]);
    }
  }

  drawKeypoint(keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = DEFAULT_THRESHOLD || 0;

    if (score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  drawSkeleton(keypoints, poseId) {
    // Each poseId is mapped to a color in the color palette.
    const color = "White";
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

    posedetection.util
      .getAdjacentPairs(posedetection.SupportedModels.BlazePose)
      .forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = DEFAULT_THRESHOLD || 0;

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
          this.ctx.beginPath();
          this.ctx.moveTo(kp1.x, kp1.y);
          this.ctx.lineTo(kp2.x, kp2.y);
          this.ctx.stroke();
        }
      });
  }
}
