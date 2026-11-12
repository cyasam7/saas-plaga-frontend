import { InternalAxiosRequestConfig } from 'axios';

/**
 * The type definition for a user object.
 */
export type User = {
  uid: string;
  role: string[] | string | null;
  data: {
    displayName: string;
    photoURL?: string;
    email?: string;
    tenant?: string;
    isTenantConfigured?: boolean;
  };
};

export interface AxiosConfigRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
