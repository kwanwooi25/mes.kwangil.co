import ConfirmDialog from 'components/dialog/Confirm';
import Loading from 'components/Loading';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Checkbox, createStyles, IconButton, ListItem, ListItemIcon, ListItemProps,
    ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Theme
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { QuoteDto } from './interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    quoteDetail: {
      // display: 'grid',
      // gridTemplateColumns: '3fr 2fr',
      // gridTemplateAreas: `
      //   "accountName accountName"
      //   "productName productName"
      //   "productSize stockBalance"
      // `,
      // alignItems: 'center',
      // gridColumnGap: theme.spacing(1),
    },
  })
);

export interface QuoteListItemProps extends ListItemProps {
  isSelectable?: boolean;
  quote: QuoteDto;
  itemHeight: number;
  isSelected: boolean;
  toggleSelection?: (quote: QuoteDto) => any;
}

const QuoteListItem = ({
  isSelectable = true,
  quote,
  itemHeight,
  isSelected,
  toggleSelection = (quote: QuoteDto) => {},
}: QuoteListItemProps) => {
  const { t } = useTranslation('quotes');
  const classes = useStyles();

  const { openDialog, closeDialog } = useDialog();
  const { canCreateQuotes, canUpdateQuotes, canDeleteQuotes } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelectionChange = () => toggleSelection(quote);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = async () => {}) =>
    () => {
      onClick().then(() => closeMenu());
    };

  const handleClickCopy = async () => {};
  // openDialog(<ProductDialog mode={ProductDialogMode.COPY} product={product} onClose={closeDialog} />);

  const handleClickEdit = async () => {};
  // openDialog(<ProductDialog mode={ProductDialogMode.EDIT} product={product} onClose={closeDialog} />);

  const handleClickDelete = async () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteQuote')}
        message={t('deleteQuoteConfirm')}
        onClose={(isConfirmed: boolean) => {
          // TODO: delete quote
          closeDialog();
        }}
      />
    );

  let actionButtons: { label: string; onClick: () => any; isLoading?: boolean }[] = [];

  if (canCreateQuotes) {
    actionButtons.push({ label: t('common:copy'), onClick: handleClickCopy });
  }

  if (canUpdateQuotes) {
    actionButtons = [...actionButtons, { label: t('common:edit'), onClick: handleClickEdit }];
  }

  if (canDeleteQuotes) {
    actionButtons.push({ label: t('common:delete'), onClick: handleClickDelete });
  }

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      {isSelectable && (
        <ListItemIcon>
          <Checkbox edge="start" color="primary" checked={isSelected} onChange={handleSelectionChange} />
        </ListItemIcon>
      )}
      <ListItemText>
        <div className={classes.quoteDetail}>{JSON.stringify(quote)}</div>
      </ListItemText>
      {!!actionButtons.length && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
            {actionButtons.map(({ label, onClick, isLoading }) => (
              <MenuItem key={label} onClick={handleClickMenuItem(onClick)} disabled={isLoading}>
                {isLoading && <Loading />}
                {label}
              </MenuItem>
            ))}
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default memo(QuoteListItem);
