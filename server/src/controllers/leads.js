import { asyncHandler } from '../middleware/asyncHandler.js';
import { insertLead } from '../db/leads.js';

export const createLead = asyncHandler(async (req, res) => {
  const lead = req.validatedBody;

  // Honeypot. The field is hidden in the form markup, so a person never
  // fills it. When a bot does, the submission is dropped and answered with
  // the same success shape, so the bot learns nothing.
  if (lead.sito_web) {
    console.log('Lead dropped: honeypot field sito_web was filled');
    return res.status(201).json({ status: 'created' });
  }

  await insertLead(lead);
  return res.status(201).json({ status: 'created' });
});
