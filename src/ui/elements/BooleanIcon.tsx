export interface BooleanIconProps {
  value: boolean;
}

function BooleanIcon({ value }: BooleanIconProps) {
  return <span>{value ? '✅' : '❌'}</span>;
}

export default BooleanIcon;
