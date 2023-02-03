import { FunctionComponent, useEffect, useRef, useState } from "react"
import { Meme, StringIndexed, NumIndexed } from "../types/types"
import Canvas from './Canvas'

type Props = {
  meme: Meme,
  removeImage: boolean,
  memeTheme: string,
}

const MemeDisplay:FunctionComponent<Props> = ({ 
  meme, 
  removeImage,
  memeTheme
}) => {
  const { setting, image, quote, author } = meme
  const imageBoxRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imageBoxHeight, setImageBoxHeight] = useState<number>(0)
  const [imageBoxWidth, setImageBoxWidth] = useState<number>(0)
  const [quoteSize, setQuoteSize] = useState<string | null>(null)
  const [noImageYesCanvas, setNoImageYesCanvas] = useState<boolean>(false)

  const fontFamilies: StringIndexed = {
    original: 'font-original',
    olde: 'font-olde',
    arcade: 'font-arcade',
    spacey: 'font-spacey',
    fancy: 'font-fancy'
  }

  const textSizes: NumIndexed = {
    1: 'text-xl',
    2: 'text-2xl',
    3: 'text-3xl',
    4: 'text-4xl',
    5: 'text-5xl',
    6: 'text-6xl'
  }
  
  const textColors: StringIndexed = {
    original: 'text-original',
    olde: 'text-olde',
    arcade: 'text-arcade',
    spacey: 'text-spacey',
    fancy: 'text-fancy'
  }

  const secondaryTextColors: StringIndexed = {
    original: 'text-original',
    olde: 'text-primary',
    arcade: 'text-spacey',
    spacey: 'text-warning',
    fancy: 'text-primary'
  }

  const getQuoteSize = ():string => {
    let qSize: number = 0
    const qLength = quote.length
    const iWidth = imageBoxWidth
    if(qLength <= 20) qSize = 5
    else if(qLength <= 50) qSize = 4
    else if(qLength <= 75) qSize = 3
    else qSize = 2

    if(memeTheme === 'olde') qSize +=1
    
    if(iWidth >= 600 && qLength <= 60 && qSize < 4) qSize ++
    if(iWidth >= 500 && qLength <= 35 && qSize < 4) qSize ++
    if(iWidth < 350 && qSize > 1) qSize --
    if(iWidth > 700 && qLength <= 50 && qSize < 4) qSize ++
    if(iWidth < 700 && qLength > 125 && qSize > 1) qSize --

    console.log('length ', qLength)
    console.log('width ', iWidth)
    console.log('size ', qSize)
    return textSizes[qSize]
  }

  useEffect(() => {
    setTimeout(() => {
      if(imgRef.current) {
        setImageBoxHeight(imgRef.current.clientHeight)
        setImageBoxWidth(imgRef.current.clientWidth)
        if(removeImage) {
          setNoImageYesCanvas(true)
        }
      }
    }, 200)
  }, [])

  useEffect(() => {
    setQuoteSize(getQuoteSize())
  }, [imageBoxWidth])

  return (
    <div className="overflow-x-hidden relative max-h-contain min-h-fit max-w-fit bg-black text-white">
        <div className="h-full max-w-contain flex flex-col justify-evenly items-center">
          <div className="w-11/12 flex flex-col justify-center flex-initial h-14">
            <p className={`${secondaryTextColors[memeTheme]} px-4 text-xl`}>{ setting }</p>
          </div>
          {!noImageYesCanvas &&
            <div
              ref={imgRef}
              className={`
                flex max-h-[40vh] h-2/3 max-w-[800px] 
              `}
            >
              <img
                className="max-h-[100%] max-w-fill object-cover"
                src={image} 
              />
            </div>
          }
          {noImageYesCanvas &&
            <div 
              ref={imageBoxRef} 
              className={`
                flex justify-center h-3/4 w-full object-contain max-w-[800px]
              `}
            >
                <Canvas 
                  dataUrl={image} 
                  imageBoxHeight={imageBoxHeight} 
                  imageBoxWidth={imageBoxWidth} 
                />
            </div>
          }
          <div 
            className="flex flex-col justify-around space-y-2 items-center w-11/12"
          >
            <p 
              className={
                `${quoteSize} ${fontFamilies[memeTheme]} ${textColors[memeTheme]}
                max-w-[36rem] whitespace-normal text-center px-4`
              } 
            >
                "{ quote }"
            </p>
            <p className={`${secondaryTextColors[memeTheme]} text-xl px-6 w-11/12`}>~ { author }</p> 
          </div>
        </div>
        <div className="absolute top-0 translate-y-[-100%] border-2 border-secondary h-full w-full bg-secondary_alpha animate-quick_shutter"></div>
    </div>
  )
}

export default MemeDisplay
