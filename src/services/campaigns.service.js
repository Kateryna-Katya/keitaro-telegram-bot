import { keitaroClient } from '../keitaro/client.js';

export async function getCampaigns() {
  const { data } = await keitaroClient.get('/campaigns');
  return data;
}
export async function getCampaignById(campaignId) {
  const campaigns = await getCampaigns();

  return campaigns.find(
    campaign => Number(campaign.id) === Number(campaignId)
  );
}