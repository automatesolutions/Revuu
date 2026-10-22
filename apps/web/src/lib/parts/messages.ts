export const acceptedExtensions = [".csv", ".xlsx", ".xls"] as const;

export const wrongFileMessage =
  "Revuu reads a CSV or Excel parts list. Export it from Altium, KiCad, OrCAD, or your mechanical spreadsheet.";

export const importFailedTitle = "The parts list did not import.";
export const importFailedDescription =
  "Check that the first row contains the column names, then import it again.";

export const maxUploadBytes = 5 * 1024 * 1024;
export const tooLargeMessage =
  "Revuu reads parts lists up to 5 MB. Remove unused columns or split the file, then import it again.";

export function hasAcceptedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return acceptedExtensions.some((ext) => lower.endsWith(ext));
}
