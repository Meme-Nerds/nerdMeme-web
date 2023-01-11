import type { NextApiRequest, NextApiResponse } from 'next'
import { Meme } from '../../types/types'

type Data = {
  name: string
}

// const params = 

// const getMeme = async() => {
//   const response = await fetch('https://nerdmeme-api.adaptable.app/api/v1/meme/custom')
//   return await response.json()
// } 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params } = req.query
  console.log('uhhhhhh params? => ', params)
  // const result = await getMeme()
  // console.log('meme => ', result)
  // res.status(200).send(result) 
}
