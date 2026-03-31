import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CamelCaseWrap, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';

export enum ConditionTypes {
  ClusterServiceVersion = 'ClusterServiceVersion',
  K8sResource = 'K8sResource',
}

type K8sResourceCondition = {
  type: string;
  status: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
};

type ClusterServiceVersionCondition = {
  phase: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
};

export type ConditionsProps = {
  conditions: K8sResourceCondition[] | ClusterServiceVersionCondition[];
  title?: string;
  subTitle?: string;
  type?: keyof typeof ConditionTypes;
};

export const Conditions: FC<ConditionsProps> = ({
  conditions,
  type = ConditionTypes.K8sResource,
}) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'True':
        return t('plugin__olm-console-plugin~True');
      case 'False':
        return t('plugin__olm-console-plugin~False');
      default:
        return status;
    }
  };

  const rows = (conditions as Array<K8sResourceCondition & ClusterServiceVersionCondition>)?.map?.(
    (condition, i: number) => (
      <Tr
        data-test={type === ConditionTypes.ClusterServiceVersion ? condition.phase : condition.type}
        key={i}
      >
        {type === ConditionTypes.ClusterServiceVersion ? (
          <Td data-test={`condition[${i}].phase`}>
            <CamelCaseWrap value={condition.phase} />
          </Td>
        ) : (
          <>
            <Td data-test={`condition[${i}].type`}>
              <CamelCaseWrap value={condition.type} />
            </Td>
            <Td data-test={`condition[${i}].status`}>{getStatusLabel(condition.status)}</Td>
          </>
        )}
        <Td data-test={`condition[${i}].lastTransitionTime`} visibility={['hidden', 'visibleOnLg']}>
          <Timestamp timestamp={condition.lastTransitionTime} />
        </Td>
        <Td data-test={`condition[${i}].reason`}>
          <CamelCaseWrap value={condition.reason} />
        </Td>
        <Td
          className="co-break-word co-pre-line co-conditions__message"
          data-test={`condition[${i}].message`}
          visibility={['hidden', 'visibleOnSm']}
        >
          {condition.message?.trim() || '-'}
        </Td>
      </Tr>
    ),
  );

  return (
    <>
      {conditions?.length ? (
        <Table gridBreakPoint="">
          <Thead>
            <Tr>
              {type === ConditionTypes.ClusterServiceVersion ? (
                <Th>{t('plugin__olm-console-plugin~Phase')}</Th>
              ) : (
                <>
                  <Th>{t('plugin__olm-console-plugin~Type')}</Th>
                  <Th>{t('plugin__olm-console-plugin~Status')}</Th>
                </>
              )}
              <Th visibility={['hidden', 'visibleOnLg']}>
                {t('plugin__olm-console-plugin~Updated')}
              </Th>
              <Th>{t('plugin__olm-console-plugin~Reason')}</Th>
              <Th visibility={['hidden', 'visibleOnSm']}>
                {t('plugin__olm-console-plugin~Message')}
              </Th>
            </Tr>
          </Thead>
          <Tbody>{rows}</Tbody>
        </Table>
      ) : (
        <EmptyState>
          <EmptyStateBody>
            {t('plugin__olm-console-plugin~No conditions found')}
          </EmptyStateBody>
        </EmptyState>
      )}
    </>
  );
};

Conditions.displayName = 'Conditions';
