import React from 'react';
import { ComingSoon } from 'components/accounts';
import dynamic from 'next/dynamic';

const InstanceContainer = dynamic(() =>
  import('components/accounts/instances/InstanceContainer'),
);

export { default as getServerSideProps } from 'lib/accounts/protectedRouteGetServerSideProps';

export default function Support() {
  return (
    <InstanceContainer>
      <ComingSoon />
    </InstanceContainer>
  );
}
