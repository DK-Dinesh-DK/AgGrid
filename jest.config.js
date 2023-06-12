const config = {
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: ["src/*.js"],
  transformIgnorePatterns: [
    "node_modules/(?!react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)",
  ],
  testMatch: ["<rootDir>/src/__test__/*.test.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.svg$": "jest-transformer-svg",
  },
};

module.exports = config;
