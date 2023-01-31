import { NextApiRequest, NextApiResponse } from "next"


const getMeme = async(memeArr: any): Promise<JSON> => {
  const response = await fetch(`https://nerdmeme-api.adaptable.app/api/v1/meme/custom/${memeArr}`)
  return await response.json()
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params } = req.query
  getMeme(JSON.stringify(params))
    .then(meme => {
      res.send(meme)
    })
}
