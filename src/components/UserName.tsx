import classNames from 'classnames';
import { UserDto } from 'features/auth/interface';
import React from 'react';

import { createStyles, Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    userNameLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    linkDisabled: {
      cursor: 'default',
      '&:hover': {
        textDecoration: 'none',
      },
    },
    userName: {},
  }),
);

export interface UserNameProps {
  className?: string;
  linkClassName?: string;
  user: UserDto;
}

function UserName({ user, className, linkClassName }: UserNameProps) {
  const classes = useStyles();

  // const {refetch, isFetching} = useUser();

  const openUserDetailDialog = async () => {
    // TODO: show detail dialog
    // refetch().then((res) => openDialog(<UserDetailDialog account={res.data} onClose={closeDialog} />));
  };

  return (
    <div className={className}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link
        className={classNames([classes.userNameLink, linkClassName])}
        component="button"
        variant="h6"
        color="initial"
        onClick={openUserDetailDialog}
        // disabled={isFetching}
      >
        {/* {isFetching && <Loading />} */}
        <span className={classes.userName} dangerouslySetInnerHTML={{ __html: user.name }} />
      </Link>
    </div>
  );
}

export default UserName;
