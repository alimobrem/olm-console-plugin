import type { FC, ReactNode } from 'react';

export const PaneBody: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="co-m-pane__body">{children}</div>
);

export default PaneBody;

export const PaneBodyGroup: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="co-m-pane__body-group">{children}</div>
);
