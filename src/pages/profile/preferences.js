import React from 'react';
import { useZestyStore } from 'store';

import dynamic from 'next/dynamic';

const Preference = dynamic(() =>
  import('views/accounts/profile/Preference').then((e) => e.Preference),
);
const ProfileContainer = dynamic(() =>
  import('components/accounts').then((e) => e.ProfileContainer),
);

export { default as getServerSideProps } from 'lib/accounts/protectedRouteGetServerSideProps';

export default function PreferencePage() {
  const { setuserInfo } = useZestyStore((state) => state);
  const { ZestyAPI } = useZestyStore((state) => state);
  const [userZUID, setuserZUID] = React.useState('');

  const handleVerifySuccess = (res) => {
    setuserZUID(res.meta.userZuid);
  };

  const handleGetUserSuccess = (res) => {
    setuserInfo(res?.data);
  };

  const verify = async () => {
    const res = await ZestyAPI.verify();
    !res.error && handleVerifySuccess(res);
  };

  const getUser = async (userZUID) => {
    const res = await ZestyAPI.getUser(userZUID);
    !res.error && handleGetUserSuccess(res);
  };

  React.useEffect(() => {
    verify();
  }, []);

  React.useEffect(() => {
    userZUID && getUser(userZUID);
  }, [userZUID]);

  return (
    <ProfileContainer>
      <Preference />
    </ProfileContainer>
  );
}
