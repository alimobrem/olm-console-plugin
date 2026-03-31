import type { FC } from 'react';

const CreateYAML = () => null;

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
