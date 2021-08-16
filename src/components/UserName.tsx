import classNames from 'classnames';
import { UserDto } from 'features/auth/interface';
import React from 'react';

import { createStyles, Link, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
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
  })
);

export interface UserNameProps {
  className?: string;
  linkClassName?: string;
  user: UserDto;
}

const UserName = ({ user, className, linkClassName }: UserNameProps) => {
  const classes = useStyles();

  // const {refetch, isFetching} = useUser();

  const openUserDetailDialog = async () => {
    // TODO: show detail dialog
    // refetch().then((res) => openDialog(<UserDetailDialog account={res.data} onClose={closeDialog} />));
  };

  return (
    <div className={className}>
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
};

export default UserName;
