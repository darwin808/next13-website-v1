import React from 'react';
import { useZestyStore } from 'store';
import { useRouter } from 'next/router';
import { isProd } from 'utils';
import dayjs from 'dayjs';

import dynamic from 'next/dynamic';

const InstanceContainer = dynamic(() =>
  import('components/accounts/instances/InstanceContainer'),
);
const Usage = dynamic(() => import('views/accounts').then((e) => e.Usage));

export { default as getServerSideProps } from 'lib/accounts/protectedRouteGetServerSideProps';

const dateEnd = dayjs().format('YYYY-MM-DD');
const dateStart = dayjs().startOf('month').format('YYYY-MM-DD');
export default function UsagePage() {
  const router = useRouter();
  const { ZestyAPI, setusage, usage } = useZestyStore((state) => state);
  const [loading, setloading] = React.useState(false);

  const { zuid } = router.query;

  const getUsage = async (zuid, dateStart, dateEnd) => {
    const res = await ZestyAPI.getUsage(zuid, dateStart, dateEnd, isProd);
    !res.error && setusage(res);
  };

  const usageProps = {
    zuid,
    usage,
    loading,
  };

  const getPageData = async () => {
    setloading(true);
    await Promise.all([getUsage(zuid, dateStart, dateEnd)]);
    setloading(false);
  };

  React.useEffect(() => {
    if (router.isReady) {
      Object.keys(usage)?.length === 0 && getPageData();
    }
  }, [router.isReady]);

  return (
    <InstanceContainer>
      <Usage {...usageProps} />
    </InstanceContainer>
  );
}
