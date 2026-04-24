/** @type {import('next').NextConfig} */
const nextConfig = {};
const withTM = require('next-transpile-modules')(['three']);

module.exports = withTM(nextConfig);

