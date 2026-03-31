/**
 * Local SchemaFieldHelp component.
 * Simplified version of @console/shared/src/components/utils/SchemaFieldHelp.
 * TODO: integrate with swagger definitions for full property description lookup.
 */
import type { FC } from 'react';
import { Button, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

const SCROLLABLE_POPOVER_BODY_STYLE = {
  maxHeight: '300px',
  overflowY: 'auto' as const,
};

export const SchemaFieldHelp: FC<SchemaFieldHelpProps> = ({
  headerContent,
  ariaLabel,
  fallbackDescription,
}) => {
  // TODO: look up property description from swagger definitions via model + propertyPath
  const description = fallbackDescription;

  if (!description) {
    return null;
  }

  return (
    <Popover
      headerContent={headerContent}
      bodyContent={<div style={SCROLLABLE_POPOVER_BODY_STYLE}>{description}</div>}
    >
      <Button variant="plain" aria-label={ariaLabel}>
        <HelpIcon />
      </Button>
    </Popover>
  );
};

type SchemaFieldHelpProps = {
  model: any;
  propertyPath: string | string[];
  headerContent: string;
  ariaLabel: string;
  fallbackDescription?: string;
};
