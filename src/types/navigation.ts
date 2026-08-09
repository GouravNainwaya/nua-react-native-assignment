export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: {
    productId: number;
  };
  Cart: undefined;
  ReturnPolicy: {
    url: string;
    title?: string;
  };
};
