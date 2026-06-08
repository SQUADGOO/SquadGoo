import {useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {useQueryClient} from '@tanstack/react-query';
import {useTopupIntent, walletKeys} from '@/api/wallet/wallet.query';
import {showToast, toastTypes} from '@/utilities/toastConfig';

// Reusable wallet top-up via Stripe PaymentSheet. Any screen calls:
//   const {startTopup, isProcessing} = useWalletTopup();
// Returns {ok:true} on success, {ok:false, canceled?} on cancel, {ok:false, error} on failure.
export const useWalletTopup = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const intent = useTopupIntent();
  const qc = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const startTopup = async coins => {
    setIsProcessing(true);

    try {
      const r = await intent.mutateAsync({coins});
      const init = await initPaymentSheet({
        merchantDisplayName: 'SquadGo',
        customerId: r.customerId,
        customerEphemeralKeySecret: r.ephemeralKey,
        paymentIntentClientSecret: r.paymentIntentClientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (init.error) {
        throw init.error;
      }

      const {error} = await presentPaymentSheet();

      if (error) {
        if (error.code !== 'Canceled') {
          showToast(error.message, 'Payment failed', toastTypes.error);
        }

        return {ok: false, canceled: error.code === 'Canceled'};
      }

      // Success — the backend webhook credits the wallet. Refresh balance now, and again
      // shortly after to cover any webhook lag.
      qc.invalidateQueries({queryKey: walletKeys.all});
      setTimeout(() => qc.invalidateQueries({queryKey: walletKeys.all}), 2500);
      showToast('Top-up successful', 'Success', toastTypes.success);

      return {ok: true};
    } catch (e) {
      return {ok: false, error: e};
    } finally {
      setIsProcessing(false);
    }
  };

  return {startTopup, isProcessing};
};
