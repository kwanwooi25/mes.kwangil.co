import React, { ReactElement } from 'react';

import BooleanIcon from 'ui/elements/BooleanIcon';
import { isBoolean } from 'lodash';

export interface DetailFieldProps {
  label: string;
  value?: string | number | boolean | ReactElement;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <li className="grid grid-cols-[120px_1fr] gap-2 items-center py-1 px-3 w-full min-h-[52px]">
      <span className="text-sm">{label}</span>
      {isBoolean(value) ? (
        <BooleanIcon value={value} />
      ) : (
        <span className="whitespace-pre-wrap">{value}</span>
      )}
    </li>
  );
}

export default DetailField;
