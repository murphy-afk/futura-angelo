import { asyncHandler } from '../middleware/asyncHandler.js';
import { listOccasions } from '../db/occasions.js';

export const getOccasions = asyncHandler(async (req, res) => {
  const occasions = await listOccasions();
  res.json({ occasions });
});
