// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    verify: `${ROOTS.AUTH}/verify`,
    register: `${ROOTS.AUTH}/register`,
    newPassword: `${ROOTS.AUTH}/new-password`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    feedback: {
      root: `${ROOTS.DASHBOARD}/feedback`,
      list: `${ROOTS.DASHBOARD}/feedback/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/feedback/${id}`,
    },
    task:{
      root: `${ROOTS.DASHBOARD}/task`,
      list: `${ROOTS.DASHBOARD}/task/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/task/${id}`,
      new:{
        rfc: `${ROOTS.DASHBOARD}/task/rfc`,
        bugfix: `${ROOTS.DASHBOARD}/task/bugfix`,
      },
    },
  },
};
