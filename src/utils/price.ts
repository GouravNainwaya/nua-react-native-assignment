export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number,
) => price - (price * discountPercentage) / 100;
