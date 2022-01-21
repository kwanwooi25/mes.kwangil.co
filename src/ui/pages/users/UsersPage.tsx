import EndOfListItem from 'ui/elements/EndOfListItem';
import ListEmpty from 'ui/elements/ListEmpty';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import { UserListItemHeight } from 'const';
import { UserDto } from 'features/auth/interface';
import { useScreenSize } from 'hooks/useScreenSize';
import Layout from 'ui/layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDigit } from 'utils/string';

import { List } from '@mui/material';

import { useInfiniteUsers } from 'features/users/useUsers';
import UserListItem from './UserListItem';

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
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 49px)' }} disablePadding>
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
