import classNames from 'classnames';
import { UserDto } from 'features/auth/interface';
import React from 'react';
import { LoadingButton } from '@mui/lab';

export interface UserNameProps {
  className?: string;
  linkClassName?: string;
  user: UserDto;
}

function UserName({ user, className, linkClassName }: UserNameProps) {
  // const {refetch, isFetching} = useUser();

  const openUserDetailDialog = async () => {
    // TODO: show detail dialog
    // refetch().then((res) => openDialog(<UserDetailDialog account={res.data} onClose={closeDialog} />));
  };

  return (
    <LoadingButton
      className={classNames('!justify-start !min-w-0 max-w-max', className)}
      onClick={openUserDetailDialog}
      // disabled={isFetching}
      // loading={isFetching}
      loadingPosition="end"
      endIcon={<span />}
      color="inherit"
    >
      <p
        className={classNames('truncate text-lg', linkClassName)}
        dangerouslySetInnerHTML={{ __html: user.name }}
      />
    </LoadingButton>
  );
}

export default UserName;
