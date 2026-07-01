import { keitaroClient } from '../keitaro/client.js';

export async function getLatestCampaignConversions(campaignId) {
  const { data } = await keitaroClient.post('/report/build', {
    range: {
      interval: 'today',
      timezone: 'Europe/Paris',
    },
    columns: ['campaign_id', 'campaign', 'sub_id', 'country'],
    metrics: ['conversions', 'sale_revenue'],
    grouping: ['sub_id'],
    filters: [
      {
        name: 'campaign_id',
        operator: 'EQUALS',
        expression: Number(campaignId),
      },
    ],
    sort: [
      {
        name: 'conversions',
        order: 'desc',
      },
    ],
    limit: 10,
  });

  console.log('CONVERSIONS REPORT:', JSON.stringify(data, null, 2));

  return data.rows || [];
}