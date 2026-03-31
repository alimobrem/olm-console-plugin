import { useCallback } from 'react';
import * as UIActions from '../../../lib/actions';
import { useConsoleDispatch } from '@openshift-console/dynamic-plugin-sdk';
import { useConsoleSelector } from '@openshift-console/dynamic-plugin-sdk';

type UseShowOperandsInAllNamespaces = () => [boolean, (value: boolean) => void];

// This hook can be used to consume and update the showOperandsInAllNamespaces redux state
export const useShowOperandsInAllNamespaces: UseShowOperandsInAllNamespaces = () => {
  const dispatch = useConsoleDispatch();
  const showOperandsInAllNamespaces = useConsoleSelector((state) =>
    state.UI.get('showOperandsInAllNamespaces'),
  );
  const setShowOperandsInAllNamespaces = useCallback(
    (value: boolean) => dispatch(UIActions.setShowOperandsInAllNamespaces(value)),
    [dispatch],
  );
  return [showOperandsInAllNamespaces, setShowOperandsInAllNamespaces];
};
