import { Point } from "../../types/types";

function findAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  }
  
  const getMidPoint = (p1: Point, p2: Point): Point => {
    const midPointX = (p1.x + p2.x) / 2;
    const midPointY = (p1.y + p2.y) / 2;
    const midPoint = { x: midPointX, y: midPointY };
    return midPoint;
  };

  export { findAngle, getMidPoint };