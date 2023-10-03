import { useCallback } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import {
  gotoStep,
  nextStep,
  backStep,
  addToCart,
  resetCart,
  deleteCart,
  createBilling,
  applyDiscount,
  applyShipping,
  increaseQuantity,
  decreaseQuantity,
} from 'src/redux/slices/checkout';
// _mock
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// types
import { IAddressItem } from 'src/types/address';
import { ICheckoutCartItem } from 'src/types/product';

// ----------------------------------------------------------------------

export default function useCheckout() {
  const dispatch = useDispatch();

  const router = useRouter();

  const checkout = useSelector((state) => state.checkout);

  const completed = checkout.activeStep === PRODUCT_CHECKOUT_STEPS.length;

  const onNextStep = useCallback(() => {
    dispatch(nextStep());
  }, [dispatch]);

  const onBackStep = useCallback(() => {
    dispatch(backStep());
  }, [dispatch]);

  const onGotoStep = useCallback(
    (step: number) => {
      dispatch(gotoStep(step));
    },
    [dispatch]
  );

  const onDeleteCart = useCallback(
    (productId: string) => {
      dispatch(deleteCart(productId));
    },
    [dispatch]
  );

  const onIncreaseQuantity = useCallback(
    (productId: string) => {
      dispatch(increaseQuantity(productId));
    },
    [dispatch]
  );

  const onDecreaseQuantity = useCallback(
    (productId: string) => {
      dispatch(decreaseQuantity(productId));
    },
    [dispatch]
  );

  const onCreateBilling = useCallback(
    (address: IAddressItem) => {
      dispatch(createBilling(address));
      dispatch(nextStep());
    },
    [dispatch]
  );

  const onResetBilling = useCallback(() => {
    dispatch(createBilling(null));
  }, [dispatch]);

  const onAddCart = useCallback(
    (newProduct: ICheckoutCartItem) => {
      dispatch(addToCart(newProduct));
    },
    [dispatch]
  );

  const onApplyDiscount = useCallback(
    (value: number) => {
      if (checkout.cart.length) {
        dispatch(applyDiscount(value));
      }
    },
    [checkout.cart.length, dispatch]
  );

  const onApplyShipping = useCallback(
    (value: number) => {
      dispatch(applyShipping(value));
    },
    [dispatch]
  );

  const onResetAll = useCallback(() => {
    if (completed) {
      dispatch(resetCart());
      router.replace(paths.product.root);
    }
  }, [completed, dispatch, router]);

  return {
    checkout,
    completed,
    //
    onResetAll,
    onAddCart,
    onGotoStep,
    onNextStep,
    onBackStep,
    onDeleteCart,
    onResetBilling,
    onCreateBilling,
    onApplyDiscount,
    onApplyShipping,
    onIncreaseQuantity,
    onDecreaseQuantity,
  };
}
