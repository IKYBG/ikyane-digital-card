import { getPublicQard } from '@/lib/qard/data';
import { createVCard } from '@/lib/qard/vcard';
export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = await getPublicQard(slug);
  if (!data) return new Response('Qard introuvable', { status: 404 });
  return new Response(createVCard(data.profile), {
    headers: {
      'content-type': 'text/vcard; charset=utf-8',
      'content-disposition': `attachment; filename="${slug}-qard-contact.vcf"`,
      'cache-control': 'no-store',
    },
  });
}
