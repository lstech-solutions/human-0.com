import React from 'react';
import Layout from '@theme/Layout';
import TermsContent from '../../terms.md';

export default function TermsPage() {
  return (
    <Layout title="Terms of Service" description="HUMΛN-Ø Terms of Service">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <TermsContent />
          </div>
        </div>
      </div>
    </Layout>
  );
}
