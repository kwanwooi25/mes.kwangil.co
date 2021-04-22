import {
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Theme,
  Tooltip,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { ChangeEvent, createRef, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import { ExcelVariant, LoadingKeys } from 'const';
import GetAppIcon from '@material-ui/icons/GetApp';
import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { getExcelFileReader } from 'utils/excel';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'features/loading/loadingHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto auto',
      alignItems: 'center',
      gridGap: theme.spacing(2),
    },
    buttons: {
      padding: theme.spacing(2, 3),
    },
  })
);

const templates = {
  [ExcelVariant.ACCOUNT]: `${process.env.PUBLIC_URL}/업체대량등록.xlsx`,
};

export interface ExcelUploadDialogProps {
  variant: ExcelVariant;
  onSave: (dataToCreate: any[]) => void;
  onClose: () => void;
}

const ExcelUploadDialog = ({ variant, onSave, onClose }: ExcelUploadDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation('common');

  const [fileName, setFileName] = useState<string>('');
  const [dataToCreate, setDataToCreate] = useState<any[]>([]);

  const fileUploadRef = createRef<HTMLInputElement>();

  const { [LoadingKeys.UPLOADING]: isUploading } = useLoading();

  const template = templates[variant];

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return setFileName('');
    }
    const file = e.target.files[0];
    const reader = getExcelFileReader[variant](setDataToCreate);
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
    onClose && onClose();
  };

  const handleSave = () => onSave(dataToCreate);

  return (
    <Dialog title={t('createBulk')} open onClose={handleClose}>
      {isUploading && <Loading />}
      <DialogContent dividers className={classes.content}>
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
        <TextField disabled value={fileName} />
        <Tooltip title={t('downloadTemplate') as string}>
          <IconButton href={template} download>
            <GetAppIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('removeFile') as string}>
          <span>
            <IconButton onClick={resetForm} disabled={!fileName}>
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton onClick={handleClose} variant="outlined" startIcon={<CloseIcon />}>
          {t('cancel')}
        </RoundedButton>
        <RoundedButton onClick={handleSave} color="primary" startIcon={<DoneIcon />} disabled={!dataToCreate.length}>
          {t('save')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelUploadDialog;
