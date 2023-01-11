import { NextApiRequest, NextApiResponse } from "next"


const getMeme = async(memeArr: any) => {
  const response = await fetch(`http://localhost:7890/api/v1/meme/custom/${memeArr}`)
  return await response.json()
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params } = req.query
  getMeme(JSON.stringify(params))
    .then(meme => {
      console.log('fresh meme? => ', meme)
      res.send(meme)
    })
}
