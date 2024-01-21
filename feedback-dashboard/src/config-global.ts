// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const LINEAR_API_TEST = process.env.NEXT_PUBLIC_LINEAR_API_TEST;
export const LINEAR_API_OPUS = process.env.NEXT_PUBLIC_LINEAR_API_OPUS;
export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
