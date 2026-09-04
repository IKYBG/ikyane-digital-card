import QRCode from 'qrcode';

const fallbackOrigin = 'https://ikyane-digital-card.brown-wand-1699.chatgpt.site';
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
const vercelOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;
const siteOrigin = (configuredOrigin || vercelOrigin || fallbackOrigin).replace(/\/$/, '');

await QRCode.toFile('public/ikyane-qr.png', `${siteOrigin}/q`, {
  width: 2048,
  margin: 4,
  errorCorrectionLevel: 'H',
  color: {
    dark: '#06152EFF',
    light: '#F7FAFFFF',
  },
});

console.log(`QR code généré pour ${siteOrigin}/q`);
