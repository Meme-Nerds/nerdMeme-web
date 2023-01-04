import { FunctionComponent, useEffect, useState } from "react"
import { Meme } from "../types/types"

type Props = {
  meme: Meme
}

const MemeDisplay:FunctionComponent<Props> = ({ meme }) => {
  const { setting, image, quote, author } = meme
  const [quoteLength, setQuoteLength] = useState<1 | 2 | 3 | 4>(1)
  
  const quoteSizes = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl'
  }

  useEffect(() => {
    if(quote.length <= 25) {
      setQuoteLength(1)
    } else if(quote.length <= 50) {
      setQuoteLength(2)
    } else if(quote.length <= 100) {
      setQuoteLength(3)
    } else {
      setQuoteLength(4)
    }
  }, [quote])

  return (
    <div className="relative max-h-contain min-h-fit max-w-fit bg-black text-white">
        <div className="h-full max-w-contain flex flex-col justify-evenly items-center">
          <div className="w-11/12 flex flex-col justify-center flex-initial h-14">
            <p className="px-4 text-xl">{ setting }</p>
          </div>
          <img className='h-3/4 object-contain' src={ image } />
          <div className="flex flex-col justify-around flex-1 items-center w-11/12">
            <p 
              className={
                `${quoteSizes[quoteLength]}
                max-w-[36rem] whitespace-normal text-center px-4`
              } 
            >
                "{ quote }"
            </p>
            <p className="text-xl px-6 w-11/12">~ { author }</p> 
          </div>
        </div>
        <div className="absolute top-0 translate-y-[-100%] border-2 border-secondary h-full w-full bg-secondary_alpha animate-quick_shutter"></div>
    </div>
  )
}

// export const getStaticProps = async (context) => {
//   return {
//     props: {}
//   }
// }

export default MemeDisplay
