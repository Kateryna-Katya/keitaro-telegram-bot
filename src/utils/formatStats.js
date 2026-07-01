const PERIOD_LABELS = {
  today: 'Today',
  yesterday: 'Yesterday',
  week: 'Last 7 Days',
  month: 'Current Month',
};

export function formatCampaignStats({ campaignId, period, stats }) {
  const label = PERIOD_LABELS[period] || period;

  return `📊 <b>${stats.campaign || `Campaign #${campaignId}`} — ${label}</b>

👥 Clicks: ${stats.clicks ?? 0}
🎯 Conversions: ${stats.conversions ?? 0}
⚡ CR: ${stats.crs ?? 0}%
💵 Revenue: ${stats.sale_revenue ?? 0} $
💸 Cost: ${stats.cost ?? 0} $
🟢 Profit: ${stats.profit_confirmed ?? 0} $
📈 ROI: ${stats.roi_confirmed ?? 0}%`;
}