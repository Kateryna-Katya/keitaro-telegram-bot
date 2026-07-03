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

    const rows = data.rows || [];

    if (!rows.length) return null;

    const clicks = rows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
    const conversions = rows.reduce(
      (sum, row) => sum + Number(row.conversions || 0),
      0
    );
    const saleRevenue = rows.reduce(
      (sum, row) => sum + Number(row.sale_revenue || 0),
      0
    );
    const cost = rows.reduce((sum, row) => sum + Number(row.cost || 0), 0);
    const profit = rows.reduce(
      (sum, row) => sum + Number(row.profit_confirmed || 0),
      0
    );

    return {
      campaign_id: rows[0].campaign_id,
      campaign: rows[0].campaign,

      sub_id_1: rows[0].sub_id_1,
      sub_id_2: rows[0].sub_id_2,

      clicks,
      conversions,
      sale_revenue: saleRevenue,
      cost,
      profit_confirmed: profit,
      crs: clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0,
      roi_confirmed:
        cost > 0 ? Number(((profit / cost) * 100).toFixed(2)) : 0,
    };
  } catch (error) {
    console.error(
      'KEITARO STATS ERROR:',
      error.response?.data || error.message
    );

    return null;
  }
}