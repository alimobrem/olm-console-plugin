/**
 * Pod-related utilities previously imported from @console/shared/src/utils/pod-utils.
 */

/**
 * Calculate the radius for a pod donut chart based on container width.
 */
export const calculateRadius = (
  size: number,
): { podStatusInnerRadius: number; podStatusOuterRadius: number; decoratorRadius: number } => {
  const podStatusOuterRadius = size / 2;
  const podStatusInnerRadius = podStatusOuterRadius * 0.72;
  const decoratorRadius = podStatusOuterRadius * 0.3;
  return { podStatusInnerRadius, podStatusOuterRadius, decoratorRadius };
};
