const config = {
    testEnvironment: 'jest-environment-jsdom',
     collectCoverageFrom: ['src/*.js'],
    transformIgnorePatterns: ['node_modules/(?!react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)'],
    "moduleNameMapper": {
        "\\.(css|less|scss)$": "identity-obj-proxy"
      }
  };
  module.exports = config