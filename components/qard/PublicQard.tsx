import type { QardData } from '@/types/database';
import { PublicAnalytics } from './PublicAnalytics';
import { QardPreview } from './QardPreview';

export function PublicQard({ data }: { data: QardData }) {
  return (
    <div className="public-qard-shell">
      <QardPreview data={data} analyticsAttributes />
      <PublicAnalytics slug={data.profile.slug} />
    </div>
  );
}
