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
  const memeRef = useRef<HTMLDivElement | null>(null)
  const imageBoxRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imageBoxHeight, setImageBoxHeight] = useState<number>(0)
  const [imageBoxWidth, setImageBoxWidth] = useState<number>(0)
  const [sizeMeme, setSizeMeme] = useState<boolean>(false)
  const [quoteSize, setQuoteSize] = useState<string | null>(null)
  const [secondaryTextSize, setSecondaryTextSize] = useState<string | null>(null)
  const [quoteBoxWidth, setQuoteBoxWidth] = useState<string | null>(null)
  const [noImageYesCanvas, setNoImageYesCanvas] = useState<boolean>(false)

  const fontFamilies: StringIndexed = {
    original: 'font-original',
    olde: 'font-olde',
    arcade: 'font-arcade',
    spacey: 'font-spacey',
    fancy: 'font-fancy'
  }

  const textSizes: NumIndexed = {
    0: 'text-sm',
    1: 'text-base',
    2: 'text-xl',
    3: 'text-2xl',
    4: 'text-3xl',
    5: 'text-4xl',
    6: 'text-5xl',
    7: 'text-6xl'
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
    const mHeight = memeRef.current
      ? memeRef.current.clientHeight
      : null
    if(qLength <= 20) qSize = 6
    else if(qLength <= 50) qSize = 4
    else if(qLength <= 75) qSize = 3
    else if(qLength <= 100) qSize = 3
    else qSize = 2

    if(memeTheme === 'olde') qSize +=1
    
    if(iWidth >= 600 && qLength <= 60 && qSize < 4) qSize ++
    if(iWidth >= 500 && qLength <= 35 && qSize < 4) qSize ++
    if(iWidth < 350 && qSize > 1) qSize --
    if(iWidth < 500 && qLength >= 75) qSize --
    if(iWidth > 700 && qLength <= 50 && qSize < 4) qSize ++
    // if(iWidth < 700 && qLength > 125 && qSize > 1) qSize --
    

    if(mHeight && mHeight < 400 && qSize > 1) qSize -- 
    if(mHeight && mHeight < 400 && qSize > 2) qSize --
    if(mHeight && mHeight < 400 && qSize && qLength > 50) qSize --

    if(iWidth <= 300 && qLength > 100) qSize = 0

    console.log('image-height ', imageBoxHeight)
    console.log('meme-height ', mHeight)
    console.log('length ', qLength)
    console.log('width ', iWidth)
    console.log('size ', qSize)
    return textSizes[qSize]
  }

  const quoteBoxWidths: NumIndexed = {
    300: 'min-w-[200px] max-w-[300px]',
    400: 'min-w-[300px] max-w-[400px]',
    500: 'min-w-[400px] max-w-[500px]',
    600: 'min-w-[500px] max-w-[600px]',
    700: 'min-w-[600px] max-w-[700px]',
    800: 'min-w-[700px] max-w-[800px]'
  }

  const getQuoteBoxWidth = (): string => {
    const maxWidth = Math.ceil(imageBoxWidth/100) * 100
    return quoteBoxWidths[maxWidth]
  }

  const getSecondaryTextSize = (qSize: string) => {
    // if(quoteSize) {
      if(qSize === 'text-base' && imageBoxWidth < 400) return 'text-sm'
      if(imageBoxWidth < 300) return 'text-sm'
      if(qSize === 'text-xl' || qSize === 'text-base') return 'text-base'
      else return 'text-xl'
  //   }
  }

  useEffect(() => {
    setTimeout(() => {
      if(imgRef.current?.clientWidth && imgRef.current.clientWidth > 0) {
        console.log('hit it number 1')
        setImageBoxHeight(imgRef.current.clientHeight)
        setImageBoxWidth(imgRef.current.clientWidth)
        if(removeImage) {
          setNoImageYesCanvas(true)
        }
        setSizeMeme(true)
      }
    }, 200)
  }, [meme])

  useEffect(() => {
    const qSize = getQuoteSize()
    const qBoxWidth = getQuoteBoxWidth()
    const secondarySize = getSecondaryTextSize(qSize)

    setQuoteSize(qSize)
    setQuoteBoxWidth(qBoxWidth)
    setSecondaryTextSize(secondarySize)
  }, [sizeMeme])

  return (
    <div ref={memeRef} className={`
      ${quoteBoxWidth}
      overflow-y-visible overflow-x-hidden relative max-h-contain min-h-fit 
      bg-black text-white w-fit px-0
      `}>
        <div className="
          overflow-y-visible h-full max-w-contain flex flex-col justify-around items-center
        ">
          <div className={`
            ${quoteBoxWidth}
            max-h-[50px] flex flex-col justify-center flex-initial h-[50px]
            `}>
            <p className={`
              ${secondaryTextColors[memeTheme]} 
              ${secondaryTextSize}
              ${quoteBoxWidth}
              px-4
            `}>
              { setting }
            </p>
          </div>
          {!noImageYesCanvas &&
            <div
              ref={imgRef}
              className={`
                flex max-h-[60vh] h-2/3 max-w-[800px] 
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
              className={`
                ${quoteSize} 
                ${quoteBoxWidth}
                ${fontFamilies[memeTheme]} 
                ${textColors[memeTheme] }
                whitespace-normal text-center px-4                
              `} 
            >
                "{ quote }"
            </p>
            <p className={`
              ${secondaryTextColors[memeTheme]} 
              ${secondaryTextSize}
              ${quoteBoxWidth}
              px-6
            `}>
              ~ { author }
            </p> 
          </div>
        </div>
        <div className="absolute top-0 translate-y-[-100%] border-2 border-secondary h-full w-full bg-secondary_alpha animate-quick_shutter"></div>
    </div>
  )
}

export default MemeDisplay
