import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

interface Meme {
  setting: string,
  image: string,
  quote: string,
  author: string
}

const getMeme = async() => {
  const response = await fetch('https://nerdmeme-api.adaptable.app/api/v1/meme')
  return await response.json()
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getMeme()
  console.log('meme => ', result)
  res.status(200).send(result) 
}