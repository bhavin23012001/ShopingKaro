module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js"], // only look inside tests folder
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text-summary"]
};
