import { t } from "@/lib/i18n";

const GST_NUMBER_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const PAN_NUMBER_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const validateSettings = (
  gstNumber: string,
  panNumber: string
): string => {
  const gst = gstNumber.trim().toUpperCase();
  const pan = panNumber.trim().toUpperCase();

  if (!gst && !pan) {
    return t("settings.validation.atLeastOneField");
  }

  if (gst && !GST_NUMBER_REGEX.test(gst)) {
    return t("settings.validation.invalidGstNumber");
  }

  if (pan && !PAN_NUMBER_REGEX.test(pan)) {
    return t("settings.validation.invalidPanNumber");
  }

  return "";
};
