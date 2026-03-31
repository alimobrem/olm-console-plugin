import { useEffect } from 'react';
import type { FC } from 'react';

export const DocumentTitle: FC<{ children: string }> = ({ children }) => {
  useEffect(() => {
    document.title = `${children} · OpenShift`;
    return () => {
      document.title = 'OpenShift';
    };
  }, [children]);
  return null;
};
