import { useCallback } from 'react';
import * as UIActions from '../../../utils/action-shims';
import type { DeprecatedOperatorWarning } from '../../types';
import { useConsoleDispatch } from '@openshift-console/dynamic-plugin-sdk';
import { useConsoleSelector } from '@openshift-console/dynamic-plugin-sdk';

export const useDeprecatedOperatorWarnings = () => {
  const dispatch = useConsoleDispatch();

  const deprecatedPackage = useConsoleSelector<DeprecatedOperatorWarning>((state) =>
    state.UI.getIn(['deprecatedOperator', 'package']),
  );
  const deprecatedChannel = useConsoleSelector<DeprecatedOperatorWarning>((state) =>
    state.UI.getIn(['deprecatedOperator', 'channel']),
  );
  const deprecatedVersion = useConsoleSelector<DeprecatedOperatorWarning>((state) =>
    state.UI.getIn(['deprecatedOperator', 'version']),
  );

  const setDeprecatedPackage = useCallback(
    (value: DeprecatedOperatorWarning) => dispatch(UIActions.setDeprecatedPackage(value)),
    [dispatch],
  );

  const setDeprecatedChannel = useCallback(
    (value: DeprecatedOperatorWarning) => dispatch(UIActions.setDeprecatedChannel(value)),
    [dispatch],
  );

  const setDeprecatedVersion = useCallback(
    (value: DeprecatedOperatorWarning) => dispatch(UIActions.setDeprecatedVersion(value)),
    [dispatch],
  );

  return {
    deprecatedPackage,
    setDeprecatedPackage,
    deprecatedChannel,
    setDeprecatedChannel,
    deprecatedVersion,
    setDeprecatedVersion,
  };
};
