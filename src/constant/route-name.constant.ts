export const CUSTOMER_ROUTE_NAME = {
  AUTH: {
    ROOT: '/auth',
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    REFRESH_TOKEN: '/refresh-token',
  },
};

export const SELLER_ROUTE_NAME = {
  AUTH: {
    ROOT: '/auth',
    SIGN_IN: '/signin',
    REFRESH_TOKEN: '/refresh-token',
  },
  CATEGORY_AREA: {
    ROOT: '/category-areas',
    GET: '',
  },
  CATEGORY: {
    ROOT: '/categories',
    GET: '',
  },
  PRODUCT: {
    ROOT: '/products',
    CREATE: '',
    IMAGES: `/:productId/images`,
  },
};
