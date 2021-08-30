import CreationFab from 'components/CreationFab';
import ConfirmDialog from 'components/dialog/Confirm';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import SelectionPanel from 'components/SelectionPanel';
import SubToolbar from 'components/SubToolbar';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'layouts/Layout';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, Refresh } from '@material-ui/icons';

import { QuoteDto, QuoteFilter } from './interface';
import QuoteListItem from './QuoteListItem';
import { useInfiniteQuotes } from './useQuotes';

export interface QuotePageProps {}

const QuotePage = (props: QuotePageProps) => {
  const { t } = useTranslation('quotes');
  const [filter] = useState<QuoteFilter>({});

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();
  const { canCreateQuotes, canDeleteQuotes } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteQuotes(filter);
  const queryClient = useQueryClient();

  const quotes = data?.pages.reduce((quotes: QuoteDto[], { rows }) => [...quotes, ...rows], []) || [];
  const quoteIds = quotes.map(({ id }) => id);
  const {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  } = useSelection(quoteIds);

  const itemCount = quotes.length + 1;
  const itemHeight = isTabletLayout ? 180 : 180;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const handleClickRefresh = () => queryClient.invalidateQueries('quotes');

  const handleToggleSelection = (quote: QuoteDto) => toggleSelection(quote.id);

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteQuote')}
        message={t('deleteQuotesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          // TODO: delete quotes
          // isConfirmed && deleteQuotes(selectedIds as number[]);
          closeDialog();
        }}
      />
    );
  };

  const openQuoteDialog = () => {
    // TODO: open create quote dialog
    // openDialog(<QuoteDialog onClose={closeDialog} />);
  };

  let selectModeButtons: JSX.Element[] = [];
  if (canDeleteQuotes) {
    selectModeButtons.push(
      <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
        <IconButton
          onClick={handleClickDeleteAll}
          // disabled={isDeleting}
        >
          {/* {isDeleting && <Loading />} */}
          <DeleteOutline />
        </IconButton>
      </Tooltip>
    );
  }

  let toolBarButtons: JSX.Element[] = [
    <Tooltip key="refresh" title={t('common:refresh') as string} placement="top">
      <IconButton onClick={handleClickRefresh}>
        <Refresh />
      </IconButton>
    </Tooltip>,
  ];
  if (canCreateQuotes) {
    toolBarButtons = [
      ...toolBarButtons,
      <Tooltip key="add-quote" title={t('createQuote') as string} placement="top">
        <IconButton onClick={openQuoteDialog}>
          <Add />
        </IconButton>
      </Tooltip>,
    ];
  }

  const renderItem = (index: number) => {
    const quote = quotes[index];

    return quote ? (
      <QuoteListItem
        key={quote.id}
        quote={quote}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(quote.id)}
        toggleSelection={handleToggleSelection}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isFetching} message={searchResult} />
    );
  };

  return (
    <Layout pageTitle={t('pageTitle')}>
      {(isTabletLayout || isDesktopLayout) && (
        <SubToolbar
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={toggleSelectAll}
          onResetSelection={resetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}

      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 65px)' }} disablePadding>
        {!isFetching && !quotes.length ? (
          <ListEmpty />
        ) : (
          <VirtualInfiniteScroll
            itemCount={itemCount}
            itemHeight={itemHeight}
            renderItem={renderItem}
            onLoadMore={loadMore}
          />
        )}
      </List>

      {isMobileLayout && (
        <>
          {canDeleteQuotes && (
            <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={resetSelection}>
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutline />
              </IconButton>
            </SelectionPanel>
          )}
          {canCreateQuotes && <CreationFab show={!isSelectMode} onClick={openQuoteDialog} />}
        </>
      )}
    </Layout>
  );
};

export default QuotePage;
