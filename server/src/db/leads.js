import { query } from './index.js';

// The only public write path on the site. The caller has already validated
// the payload and dropped honeypot submissions.

export async function insertLead(lead) {
  const result = await query(
    `INSERT INTO leads (type, name, email, phone, occasion, message, status)
     VALUES (?, ?, ?, ?, ?, ?, 'nuovo')`,
    [lead.type, lead.name, lead.email, lead.phone ?? null, lead.occasion ?? null, lead.message]
  );
  return result.insertId;
}
