import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import posthog from 'posthog-js';

interface RootState {
  users: {
    ownUserId: string | undefined;
  };
}

export function usePostHogIdentify() {
  const userId = useSelector((state: RootState) => state.users.ownUserId);

  useEffect(() => {
    if (userId) {
      posthog.identify(userId);
    }
  }, [userId]);
} 