import fs from 'fs/promises';

const ALERTS_PATH = 'src/data/alerts.json';

async function readAlerts() {
  try {
    const data = await fs.readFile(ALERTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeAlerts(alerts) {
  await fs.writeFile(ALERTS_PATH, JSON.stringify(alerts, null, 2));
}

export async function getAlerts() {
  return readAlerts();
}

export async function enableAlert({ telegramId, campaignId, campaignName }) {
  const alerts = await readAlerts();

  const existingAlert = alerts.find(
    alert =>
      alert.telegramId === Number(telegramId) &&
      alert.campaignId === Number(campaignId)
  );

  if (existingAlert) {
    existingAlert.enabled = true;
    existingAlert.campaignName = campaignName;
    await writeAlerts(alerts);
    return existingAlert;
  }

  const newAlert = {
    telegramId: Number(telegramId),
    campaignId: Number(campaignId),
    campaignName,
    enabled: true,
    lastConversions: 0,
    createdAt: new Date().toISOString(),
  };

  alerts.push(newAlert);
  await writeAlerts(alerts);

  return newAlert;
}

export async function disableAlert({ telegramId, campaignId }) {
  const alerts = await readAlerts();

  const updatedAlerts = alerts.map(alert => {
    if (
      alert.telegramId === Number(telegramId) &&
      alert.campaignId === Number(campaignId)
    ) {
      return {
        ...alert,
        enabled: false,
      };
    }

    return alert;
  });

  await writeAlerts(updatedAlerts);

  return updatedAlerts;
}

export async function saveAlerts(alerts) {
  await writeAlerts(alerts);
}