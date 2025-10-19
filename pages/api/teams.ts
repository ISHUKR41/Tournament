import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../server/db';
import { teams } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const allTeams = await db.select().from(teams);
      res.status(200).json(allTeams);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}