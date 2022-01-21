import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Paper, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface SelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  children: ReactElement | ReactElement[];
}

function SelectionPanel({ isOpen, onClose, selectedCount, children }: SelectionPanelProps) {
  const { t } = useTranslation('common');

  return (
    <Slide in={isOpen} direction="up">
      <Paper className="fixed inset-x-0 bottom-0 z-[1199] p-2 !rounded-t-lg" elevation={4}>
        <div className="flex justify-between w-full">
          <div>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <span
              dangerouslySetInnerHTML={{ __html: t('selectedCount', { count: selectedCount }) }}
            />
          </div>
          <div className="ml-auto">{children}</div>
        </div>
      </Paper>
    </Slide>
  );
}

export default SelectionPanel;
