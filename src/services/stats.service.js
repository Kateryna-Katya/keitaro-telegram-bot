import { keitaroClient } from '../keitaro/client.js';

function getRange(period) {
  const timezone = 'Europe/Kyiv';

  if (period === 'today') {
    return { interval: 'today', timezone };
  }

  if (period === 'yesterday') {
    return { interval: 'yesterday', timezone };
  }

  if (period === 'week') {
    return { interval: '7_days', timezone };
  }

  if (period === 'month') {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const from = new Date(year, month, 1, 0, 0, 0);
    const to = new Date(year, month + 1, 1, 0, 0, 0);

    return {
      from: from.toISOString().slice(0, 19).replace('T', ' '),
      to: to.toISOString().slice(0, 19).replace('T', ' '),
      timezone,
    };
  }

  return { interval: 'today', timezone };
}

export async function getCampaignStats(campaignId, period = 'today') {
  try {
   const payload = {
  range: getRange(period),

columns: [
  'campaign_id',
  'campaign',
  'sub_id_1',
  'sub_id_2',
],

  metrics: [
    'clicks',
    'conversions',
    'crs',
    'sale_revenue',
    'cost',
    'profit_confirmed',
    'roi_confirmed',
  ],

  filters: [
    {
      name: 'campaign_id',
      operator: 'EQUALS',
      expression: String(campaignId),
    },
  ],
};

    console.log('KEITARO PAYLOAD:', JSON.stringify(payload, null, 2));

    const { data } = await keitaroClient.post('/report/build', payload);

    console.log('KEITARO RESPONSE:', JSON.stringify(data, null, 2));

    return data.rows?.[0] || null;
  } catch (error) {
    console.error(
      'KEITARO STATS ERROR:',
      error.response?.data || error.message
    );

    return null;
  }
}