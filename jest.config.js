module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/methods/*.{js,jsx}",
    "src/components/*.{js,jsx,vue}",
    "src/components/**/*.{js,jsx,vue}",
  ],
};
