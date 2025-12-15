// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import baseConfig from '@peculiar/eslint-config-base';

export default tseslint.config([
  ...baseConfig,
]);
