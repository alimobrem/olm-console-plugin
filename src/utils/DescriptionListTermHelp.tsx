/**
 * A description list term with a help popover.
 * Previously imported from @console/shared/src/components/description-list/DescriptionListTermHelp.
 */
import type { FC, ReactNode } from 'react';
import { DescriptionListTerm, Popover, Button } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

export const DescriptionListTermHelp: FC<{
  term: string;
  help?: ReactNode;
}> = ({ term, help }) => {
  return (
    <DescriptionListTerm>
      {term}
      {help && (
        <Popover bodyContent={help}>
          <Button
            variant="plain"
            aria-label={`Help for ${term}`}
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
