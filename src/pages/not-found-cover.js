import React from 'react';
import dynamic from 'next/dynamic';

const NotFoundCover = dynamic(() => import('views/NotFoundCover'));

const NotFoundCoverPage = () => {
  return <NotFoundCover />;
};

export default NotFoundCoverPage;
