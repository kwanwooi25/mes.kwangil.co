import { useState } from 'react';

export const useSelection = (allIds: (number | string)[]) => {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  const isSelectMode = !!selectedIds.length;
  const isSelectedAll = allIds.every((id) => selectedIds.includes(id));
  const isIndeterminate = !isSelectedAll && allIds.some((id) => selectedIds.includes(id));

  const toggleSelection = (id: number | string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? allIds : []);
  };

  const resetSelection = () => setSelectedIds([]);

  return {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  };
};
