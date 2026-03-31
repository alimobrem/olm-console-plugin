import type { FC } from 'react';
import { GridItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const ResourceRequirements: FC<ResourceRequirementsProps> = (props) => {
  const { t } = useTranslation();
  const { cpu, memory, storage, onChangeCPU, onChangeMemory, onChangeStorage, path = '' } = props;

  return (
    <>
      <GridItem span={4}>
        <label
          style={{ fontWeight: 300 }}
          className="pf-v6-u-text-color-subtle"
          htmlFor={`${path}.cpu`}
        >
          {t('console-shared~CPU cores')}
        </label>
        <span className="pf-v6-c-form-control">
          <input
            value={cpu}
            onChange={(e) => onChangeCPU(e.target.value)}
            id={`${path}.cpu`}
            name="cpu"
            type="text"
            placeholder="500m"
          />
        </span>
      </GridItem>
      <GridItem span={4}>
        <label
          style={{ fontWeight: 300 }}
          className="pf-v6-u-text-color-subtle"
          htmlFor={`${path}.memory`}
        >
          {t('console-shared~Memory')}
        </label>
        <span className="pf-v6-c-form-control">
          <input
            value={memory}
            onChange={(e) => onChangeMemory(e.target.value)}
            id={`${path}.memory`}
            name="memory"
            type="text"
            placeholder="50Mi"
          />
        </span>
      </GridItem>
      <GridItem span={4}>
        <label
          style={{ fontWeight: 300 }}
          className="pf-v6-u-text-color-subtle"
          htmlFor={`${path}.ephemeral-storage`}
        >
          {t('console-shared~Storage')}
        </label>
        <span className="pf-v6-c-form-control">
          <input
            value={storage}
            onChange={(e) => onChangeStorage(e.target.value)}
            id={`${path}.ephemeral-storage`}
            name="ephemeral-storage"
            type="text"
            placeholder="50Mi"
          />
        </span>
      </GridItem>
    </>
  );
};

export type ResourceRequirementsProps = {
  cpu: string;
  memory: string;
  storage: string;
  onChangeCPU: (value: string) => void;
  onChangeMemory: (value: string) => void;
  onChangeStorage: (value: string) => void;
  path?: string;
};

ResourceRequirements.displayName = 'ResourceRequirements';
