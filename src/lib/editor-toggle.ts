import * as React from 'react';

export enum EditorType {
  Form = 'form',
  YAML = 'yaml',
}

// Stub SyncedEditor component for compatibility
export const SyncedEditor: React.FC<{
  children?: React.ReactNode;
  FormEditor?: any;
  YAMLEditor?: any;
  initialData?: any;
  initialType?: EditorType;
  lastViewUserPreferenceKey?: string;
  context?: any;
  onChangeEditorType?: (type: EditorType) => void;
  prune?: (data: any) => any;
}> = ({ children }) => {
  return children as React.ReactElement;
};
