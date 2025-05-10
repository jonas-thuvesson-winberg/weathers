export const windDirectionRotationStyle = (windDegree: number) => {
  const rotation = windDegree;
  return { transform: `rotate(${rotation}deg)` };
};
