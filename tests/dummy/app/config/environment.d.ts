export default config;

/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'auto' | 'history' | 'hash' | 'none';
  rootURL: string;
  APP: Record<string, unknown>;
};
