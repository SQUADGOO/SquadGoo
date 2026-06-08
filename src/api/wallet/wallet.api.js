import {request} from '../apiClient';

// GET /wallet → { ok, wallet: { totalCoins, availableCoins, heldCoins, holds, transactions }, publishableKey }
export const getWallet = async () => {
  const res = await request('/wallet', {method: 'get'});

  return res?.wallet
    ? {...res.wallet, publishableKey: res.publishableKey}
    : res;
};

// POST /wallet/topup/intent → { paymentIntentClientSecret, ephemeralKey, customerId, coins, publishableKey }
export const createTopupIntent = async ({coins}) => {
  const res = await request('/wallet/topup/intent', {
    method: 'post',
    body: {coins},
  });

  return res;
};
