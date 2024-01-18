import { ReactElement } from 'react';

import { isBoolean } from 'lodash';
import BooleanIcon from 'ui/elements/BooleanIcon';

export interface DetailFieldProps {
  label: string;
  value?: string | number | boolean | ReactElement;
  labelWidth?: number;
}

function DetailField({ label, value, labelWidth = 120 }: DetailFieldProps) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-2 items-center py-1 px-3 w-full min-h-[52px]">
      <span className="text-sm whitespace-pre-wrap" style={{ width: `${labelWidth}px` }}>
        {label}
      </span>
      {isBoolean(value) ? (
        <BooleanIcon value={value} />
      ) : (
        <span className="whitespace-pre-wrap">{value}</span>
      )}
    </li>
  );
}

export default DetailField;
