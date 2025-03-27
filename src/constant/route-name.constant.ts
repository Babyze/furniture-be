const ROUTE_NAME = {
  CATEGORY_AREA: {
    ROOT: '/category-areas',
    GET: '',
  },
  CATEGORY: {
    ROOT: '/categories',
    GET: '',
  },
};

export const CUSTOMER_ROUTE_NAME = {
  ...ROUTE_NAME,
  AUTH: {
    ROOT: '/auth',
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    REFRESH_TOKEN: '/refresh-token',
  },
};

export const SELLER_ROUTE_NAME = {
  ...ROUTE_NAME,
  AUTH: {
    ROOT: '/auth',
    SIGN_IN: '/signin',
    REFRESH_TOKEN: '/refresh-token',
  },
};
