/**
 * Utility for getting an image URL from a CSV icon descriptor.
 * Previously imported from @console/shared/src/utils/icon-utils.
 */
export const getImageForCSVIcon = (
  icon: { base64data?: string; mediatype?: string } | undefined,
): string => {
  if (!icon?.base64data || !icon?.mediatype) {
    return '';
  }
  return `data:${icon.mediatype};base64,${icon.base64data}`;
};
