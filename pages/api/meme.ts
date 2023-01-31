import type { NextApiRequest, NextApiResponse } from 'next'

const getMeme = async(): Promise<JSON> => {
  const response = await fetch('https://nerdmeme-api.adaptable.app/api/v1/meme')
  return await response.json()
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getMeme()
  res.status(200).send(result) 
}
