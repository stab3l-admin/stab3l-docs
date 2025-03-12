import React from 'react';
import TokenomicsPlayground from '@/components/ui/tokenomics-playground';
import { DocsLayoutClient } from '@/components/docs-layout-client';

export default function TokenomicsPlaygroundPage() {
  return (
    <DocsLayoutClient docs={[]} categories={[]}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">STAB3L Tokenomics Playground</h1>
        <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
          Explore and simulate the STAB3L tokenomics under different scenarios and parameter sets. 
          Adjust variables, observe outcomes, and analyze sensitivities to understand the economic dynamics 
          of the STAB3L protocol.
        </p>
        <TokenomicsPlayground />
      </div>
    </DocsLayoutClient>
  );
} 