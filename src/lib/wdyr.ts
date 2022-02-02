/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

if (import.meta.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    collapseGroups: true,
  });
}
