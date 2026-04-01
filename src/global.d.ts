interface Window {
  SERVER_FLAGS?: {
    copiedCSVsDisabled?: boolean;
    documentationBaseURL?: string;
    nodeOperatingSystems?: string[];
    nodeArchitectures?: string[];
    GOOS?: string;
    GOARCH?: string;
    [key: string]: unknown;
  };
}

declare module '*.svg' {
  const content: string;
  export default content;
}
