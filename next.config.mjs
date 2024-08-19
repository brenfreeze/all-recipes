/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "localhost"
      },
      {
        hostname: "picsum.photos"
      },
      {
        hostname: "placehold.co"
      }
    ]
  }
};

export default nextConfig;
