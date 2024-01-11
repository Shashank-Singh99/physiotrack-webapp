export const LM = {
  NOSE: 0,
  RIGHT_EAR: 7,
  LEFT_EAR: 8,
  RIGHT_SHOULDER: 11,
  LEFT_SHOULDER: 12,
  RIGHT_ELBOW: 13,
  LEFT_ELBOW: 14,
  RIGHT_WRIST: 15,
  LEFT_WRIST: 16,
  RIGHT_HIP: 23,
  LEFT_HIP: 24,
  RIGHT_KNEE: 25,
  LEFT_KNEE: 26,
  RIGHT_ANKLE: 27,
  LEFT_ANKLE: 28,
  RIGHT_HEEL: 29,
  LEFT_HEEL: 30,
  RIGHT_FOOT: 31,
  LEFT_FOOT: 32 
};

export const BLACK_LIST = [
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "mouth_left",
  "mouth_right",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "nose",
];

export const CONNECTIONS = [
  [LM.LEFT_EAR, LM.RIGHT_EAR],
  [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
  [LM.LEFT_EAR, LM.RIGHT_EAR],
  [LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  [LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],
  [LM.LEFT_ELBOW, LM.LEFT_WRIST],
  [LM.RIGHT_ELBOW, LM.RIGHT_WRIST],
  [LM.LEFT_SHOULDER, LM.LEFT_HIP],
  [LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.LEFT_KNEE],
  [LM.RIGHT_HIP, LM.RIGHT_KNEE],
  [LM.LEFT_KNEE, LM.LEFT_ANKLE],
  [LM.RIGHT_KNEE, LM.RIGHT_ANKLE],
  [LM.LEFT_KNEE, LM.RIGHT_KNEE],
  [LM.LEFT_ANKLE, LM.RIGHT_ANKLE],
  [LM.RIGHT_HIP, LM.RIGHT_KNEE],
  [LM.LEFT_ANKLE, LM.LEFT_FOOT],
  [LM.LEFT_ANKLE, LM.LEFT_HEEL],
  [LM.RIGHT_ANKLE, LM.RIGHT_FOOT],
  [LM.RIGHT_ANKLE, LM.RIGHT_HEEL],
  [LM.LEFT_FOOT, LM.RIGHT_FOOT],
];

const HEAD_TILT = "Head Tilt";
const SHOULDER_TILT = "Shoulder Tilt";
const PELVIC_TILT = "Pelvic Tilt";
const KNEE_TILT = "Knee Tilt";

export const ANGLES = [
  {
    left: LM.LEFT_EAR,
    right: LM.RIGHT_EAR,
    inference: HEAD_TILT,
  },
  {
    left: LM.LEFT_SHOULDER,
    right: LM.RIGHT_SHOULDER,
    inference: SHOULDER_TILT,
  },
  {
    left: LM.LEFT_HIP,
    right: LM.RIGHT_HIP,
    inference: PELVIC_TILT,
  },
  {
    left: LM.LEFT_KNEE,
    right: LM.RIGHT_KNEE,
    inference: KNEE_TILT,
  },
];
