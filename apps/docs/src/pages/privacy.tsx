import React from 'react';
import Layout from '@theme/Layout';
import PrivacyContent from '../../privacy.md';

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy" description="HUMΛN-Ø Privacy Policy">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <PrivacyContent />
          </div>
        </div>
      </div>
    </Layout>
  );
}
