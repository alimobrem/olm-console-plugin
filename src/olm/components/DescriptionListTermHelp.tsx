/**
 * A description list term with a help popover.
 * Previously imported from @console/shared/src/components/description-list/DescriptionListTermHelp.
 */
import type { FC, ReactNode } from 'react';
import { DescriptionListTerm, Popover, Button } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

export const DescriptionListTermHelp: FC<{
  term?: string;
  text?: string;
  help?: ReactNode;
  textHelp?: string;
  popoverProps?: Record<string, unknown>;
}> = ({ term, text, help, textHelp, popoverProps }) => {
  const label = term || text || '';
  const helpContent = help || textHelp;
  return (
    <DescriptionListTerm>
      {label}
      {helpContent && (
        <Popover bodyContent={helpContent} {...popoverProps}>
          <Button
            variant="plain"
            aria-label={`Help for ${label}`}
            className="pf-v6-u-p-0 pf-v6-u-ml-xs"
          >
            <OutlinedQuestionCircleIcon />
          </Button>
        </Popover>
      )}
    </DescriptionListTerm>
  );
};
DescriptionListTermHelp.displayName = 'DescriptionListTermHelp';
