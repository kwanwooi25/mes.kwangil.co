import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { UserListItemHeight } from 'const';
import { UserDto } from 'features/auth/interface';
import { useScreenSize } from 'hooks/useScreenSize';
import Layout from 'layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDigit } from 'utils/string';

import { List } from '@material-ui/core';

import UserListItem from './UserListItem';
import { useInfiniteUsers } from './useUsers';

function UsersPage() {
  const { t } = useTranslation('users');
  const { isMobileLayout } = useScreenSize();

  const { isFetching, data, loadMore } = useInfiniteUsers();

  const users = data?.pages.reduce((u: UserDto[], { rows }) => [...u, ...rows], []) || [];
  const itemCount = users.length + 1;
  const itemHeight = isMobileLayout ? UserListItemHeight.MOBILE : UserListItemHeight.TABLET;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const renderItem = (index: number) => {
    const user = users[index];

    return user ? (
      <UserListItem key={user.id} user={user} itemHeight={itemHeight} />
    ) : (
      <EndOfListItem
        key="end-of-list"
        height={itemHeight}
        isLoading={isFetching}
        message={searchResult}
      />
    );
  };

  return (
    <Layout pageTitle={t('pageTitle')}>
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 65px)' }} disablePadding>
        {!isFetching && !users.length ? (
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
    </Layout>
  );
}

export default UsersPage;
