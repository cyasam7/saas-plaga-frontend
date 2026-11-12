/**
 * Create aliases for the paths
 */
const aliases = (prefix = `src`) => ({
  '@lodash': `${prefix}/@lodash`,
  '@schema': `${prefix}/@schema`,
  'app/store': `${prefix}/app/store`,
  'app/shared/components': `${prefix}/app/shared/components`,
  'app/configs': `${prefix}/app/configs`,
  'app/core': `${prefix}/app/core`,
});

module.exports = aliases;
