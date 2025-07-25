import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log({query: req.body, reqMethod: req.method});

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secret = process.env.REVALIDATE_SECRET;

  console.log({query: req.body, secret});

  if (req.body.secret !== secret) {
    return res.status(401).json({ message: 'Invalid token' });
  }


  const { slug } = req.body;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Missing slug' });
  }

  try {
    // Path must match the one in getStaticPaths
    await res.revalidate(slug);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: 'Revalidation error', error: err });
  }
}