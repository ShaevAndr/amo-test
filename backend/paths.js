const { register } = require('tsconfig-paths');

register({
  baseUrl: './dist',
  paths: {
    '@/*': ['./*']
  }
});