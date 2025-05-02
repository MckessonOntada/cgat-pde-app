import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';

const ProviderDetailsCard = ({ providerDetails }) => {
  const { name, address, deaNumber, npiNumber, phoneNumber } =
    providerDetails || {};
  const detailsArray = [name, address, deaNumber, npiNumber, phoneNumber];
  return (
    <div className="MCP-CardContainer">
      <Heading as="h3">{name}</Heading>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start">
        {detailsArray.map((detail) => {
          <p>{detail}</p>;
        })}
      </div>
    </div>
  );
};

export default ProviderDetailsCard;
