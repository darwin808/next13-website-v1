import React from 'react';
import dynamic from 'next/dynamic';

const NotFound = dynamic(() => import('views/NotFound'));

const NotFoundPage = () => {
  return <NotFound />;
};

export default NotFoundPage;
