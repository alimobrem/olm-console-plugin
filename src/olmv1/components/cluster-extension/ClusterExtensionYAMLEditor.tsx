import type { FC } from 'react';

const CreateYAML = (_props: { hideHeader?: boolean; onChange?: (yaml: string) => void; template?: string }) => null;

export const ClusterExtensionYAMLEditor: FC<ClusterExtensionYAMLEditorProps> = ({
  initialYAML = '',
  onChange,
}) => {
  return <CreateYAML hideHeader onChange={onChange} template={initialYAML} />;
};

export type ClusterExtensionYAMLEditorProps = {
  initialYAML?: string;
  onChange?: (yaml: string) => void;
};
