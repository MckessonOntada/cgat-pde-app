import DetailSegment from '@src/components/DetailSegment';
import ModuleHeader from '@src/components/module-header';
import { Heading } from '@mckesson/mcp-component-library';
import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';

function TrackingDetails() {
  const { t: translateFn } = useTranslate();
  return (
    <div>
      <div className="MCP-CardContainer">
        <ModuleHeader heading={<Heading as="h3">{translateFn('labels.trackingDetails')}</Heading>} />
        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2`}>
          <DetailSegment label={translateFn('labels.therapy')} noTooltip={true} value={'Value'} />
        </div>
      </div>
    </div>
  );
}

export default TrackingDetails;
