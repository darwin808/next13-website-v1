import React from 'react';
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

const ParsleyOverview = dynamic(() =>
  import('blocks/zesty/products/ParsleyOverview'),
);

const ZestyComponents = () => {
  return (
    <>
      Parsley What is is?
      <ParsleyOverview />
      <Container>Hello World</Container>
    </>
  );
};

export default ZestyComponents;
