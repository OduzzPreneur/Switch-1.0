import React, { Suspense } from 'react';
import ComingSoon from '@/components/common/ComingSoon';

function ComingSoonContent({ searchParams }: { searchParams: { module?: string; title?: string } }) {
  const moduleName = searchParams?.module || 'Upcoming Module';
  const title = searchParams?.title || `${moduleName} Under Active Development`;

  return (
    <ComingSoon
      moduleName={moduleName}
      title={title}
      expectedDate="Cohort 1.0 Milestone 2"
      description={`The ${moduleName} feature is currently being finalized by the Switch 1.0 curriculum & platform team. Students will be notified immediately upon release.`}
      backLink="/dashboard"
      backText="Return to Student Portal"
    />
  );
}

export default function ComingSoonPage({
  searchParams,
}: {
  searchParams: { module?: string; title?: string };
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading module status...</div>}>
      <ComingSoonContent searchParams={searchParams} />
    </Suspense>
  );
}
