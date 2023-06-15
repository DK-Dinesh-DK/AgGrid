const config = {
  collectCoverageFrom: [
    "src/components/datagrid/**/**/*.js",
    "!**/node_modules/**",
    "!**/src/asset/**",
  ],

  coverageReporters: ["text", "cobertura", "html"],

  reporters: ["default", "jest-junit"],

  testResultsProcessor: "jest-sonar-reporter",

  restoreMocks: true,

  setupFiles: ["./config/setup.js"],

  setupFilesAfterEnv: ["@testing-library/jest-dom"],

  testEnvironment: "jsdom",

  testMatch: ["<rootDir>/src/__test__/*.test.js"],

  transformIgnorePatterns: [
    "node_modules/(?!react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)",
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.jsx?$": "babel-jest",

    "^.+\\.svg$": "jest-transformer-svg",
  },
};

module.exports = config;
