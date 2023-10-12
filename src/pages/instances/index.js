import React from 'react';
import { ZestyAccountsHead } from 'components/globals/ZestyAccountsHead';

import dynamic from 'next/dynamic';

const InstanceContainer = dynamic(() =>
  import('components/accounts/instances/InstanceContainer'),
);

const InstancesDashboardV2 = dynamic(() =>
  import('components/accounts/instances/InstanceDashboardV2'),
);

export { default as getServerSideProps } from 'lib/accounts/protectedRouteGetServerSideProps';

export default function Instances() {
  return (
    <InstanceContainer isDashboard>
      <ZestyAccountsHead title={'Accounts: Instances'} />
      <InstancesDashboardV2 />
    </InstanceContainer>
  );
}
