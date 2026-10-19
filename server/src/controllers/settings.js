import { getSettings } from '../db/settings.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getSettingsHandler = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  res.json({ settings });
});
