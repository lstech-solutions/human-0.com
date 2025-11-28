'use strict';

// Basic Lambda handler placeholder. Replace logic with your server adapter or API handler.
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: 'Lambda is alive',
      requestId: context?.awsRequestId,
    }),
  };
};
