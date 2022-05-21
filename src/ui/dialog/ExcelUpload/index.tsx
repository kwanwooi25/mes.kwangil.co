import { ExcelVariant } from 'const';
import Dialog from 'features/dialog/Dialog';
import React, { ChangeEvent, createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from 'ui/elements/Loading';
import RoundedButton from 'ui/elements/RoundedButton';
import { getExcelFileReader } from 'utils/excel';

import { Close, Done, GetApp } from '@mui/icons-material';
import { IconButton, TextField, Tooltip } from '@mui/material';

const templates: { [key in ExcelVariant]?: string } = {
  [ExcelVariant.ACCOUNT]: `${import.meta.env.PUBLIC_URL}/업체대량등록.xlsx`,
  [ExcelVariant.PRODUCT]: `${import.meta.env.PUBLIC_URL}/제품대량등록.xlsx`,
  [ExcelVariant.WORK_ORDER]: `${import.meta.env.PUBLIC_URL}/작업지시대량등록.xlsx`,
};

export interface ExcelUploadDialogProps {
  variant: ExcelVariant;
  onSave: (dataToCreate: any[]) => void;
  onClose: () => void;
}

function ExcelUploadDialog({ variant, onSave, onClose = () => {} }: ExcelUploadDialogProps) {
  const { t } = useTranslation('common');

  const [fileName, setFileName] = useState<string>('');
  const [dataToCreate, setDataToCreate] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileUploadRef = createRef<HTMLInputElement>();

  const template = templates[variant] ?? '';

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      setFileName('');
      return;
    }
    const file = e.target.files[0];
    const reader = getExcelFileReader?.[variant]?.(setDataToCreate);
    reader.readAsArrayBuffer(file);
    setFileName(file.name);
  };

  const handleClickSelectFile = () => {
    fileUploadRef.current?.click();
  };

  const resetForm = () => {
    setFileName('');
    setDataToCreate([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    setIsUploading(true);
    onSave(dataToCreate);
  };

  return (
    <Dialog title={t('createBulk')} open onClose={handleClose}>
      {isUploading && <Loading />}
      <Dialog.Content dividers className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4">
        <div>
          <input
            ref={fileUploadRef}
            id="file-upload"
            style={{ display: 'none' }}
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleChangeFile}
          />
          <RoundedButton variant="outlined" color="primary" onClick={handleClickSelectFile}>
            {t('selectFile')}
          </RoundedButton>
        </div>
        <TextField disabled variant="standard" value={fileName} />
        <Tooltip title={t('downloadTemplate') as string}>
          <IconButton href={template} download>
            <GetApp />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('removeFile') as string}>
          <span>
            <IconButton onClick={resetForm} disabled={!fileName}>
              <Close />
            </IconButton>
          </span>
        </Tooltip>
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton onClick={handleClose} variant="outlined" startIcon={<Close />}>
          {t('cancel')}
        </RoundedButton>
        <RoundedButton
          onClick={handleSave}
          color="primary"
          startIcon={<Done />}
          disabled={!dataToCreate.length || isUploading}
        >
          {t('save')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default ExcelUploadDialog;
