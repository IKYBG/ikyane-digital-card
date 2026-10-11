import { createVCard } from '@/lib/qard/vcard';
import { demoQard } from '@/lib/qard/demo-data';
import { env } from '@/lib/env';
export function GET() {
  return new Response(
    createVCard(
      demoQard.profile,
      demoQard.links,
      `${env.appUrl.replace(/\/$/, '')}/demo`,
    ),
    {
      headers: {
        'content-type': 'text/vcard; charset=utf-8',
        'content-disposition': 'attachment; filename="exemple-qard.vcf"',
      },
    },
  );
}
