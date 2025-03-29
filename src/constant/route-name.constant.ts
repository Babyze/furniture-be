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
    GET: '',
    GET_DETAIL: '/:productId',
    GET_DETAIL_SPUS: '/:productId/spus',
    IMAGES: `/:productId/images`,
    UPDATE: '/:productId',
    DELETE_IMAGE: '/:productId/images',
  },
};
