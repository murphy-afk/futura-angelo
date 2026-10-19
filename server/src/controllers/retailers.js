import { asyncHandler } from '../middleware/asyncHandler.js';
import { listRetailers } from '../db/retailers.js';

export const getRetailers = asyncHandler(async (req, res) => {
  const retailers = await listRetailers();
  res.json({ retailers });
});
