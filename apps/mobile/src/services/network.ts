import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

/** true = online, false = offline, null = ainda verificando. */
export function useOnline(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    Network.getNetworkStateAsync()
      .then((s) => alive && setOnline(!!s.isConnected && s.isInternetReachable !== false))
      .catch(() => alive && setOnline(null));
    const sub = Network.addNetworkStateListener?.((s) =>
      setOnline(!!s.isConnected && s.isInternetReachable !== false),
    );
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);
  return online;
}

export async function isOnline(): Promise<boolean> {
  try {
    const s = await Network.getNetworkStateAsync();
    return !!s.isConnected && s.isInternetReachable !== false;
  } catch {
    return false;
  }
}
