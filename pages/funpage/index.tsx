import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import React, { 
  useState,
  useCallback,
  useRef  
} from 'react'
import MemeDisplay from '../../components/MemeDisplay'
import { Meme } from '../../types/types'
import { toPng } from 'html-to-image'

const funpage = () => {
  const [meme, setMeme] = useState<Meme | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const memeRef = useRef<HTMLDivElement | null>(null)
  const [memeType, setMemeType]= useState<string>('classic')

  const animation = loading ? 'animate-shutter' : ''
  const classicVariant = memeType === 'classic' ? 'contained' : 'outlined'
  const customVariant = memeType === 'custom' ? 'contained' : 'outlined'

  type ObjectOfStrings = {
    [k: string]: string
  }
  
  const testMeme = {
    setting: 'star-trek',
    image: 'star-wars',
    quote: 'harry-potter',
    author: 'battlestar-galactica'
  }

  const routes: ObjectOfStrings = {
    classic: '/api/meme',
    custom: `api/custom-meme/${testMeme.setting}/${testMeme.image}/${testMeme.quote}/${testMeme.author}`
  }

  const handleGetMeme = () => {
    setLoading(true)
    fetch(routes[memeType])
      .then(newMeme => {
        if(newMeme) {
          return newMeme.json()
        }
      })
      .then(finalMeme => {
        setMeme(finalMeme)   
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 3000)
      })
  }

  const HandleDownload = useCallback(() => {
    if (memeRef.current === null) {
      return
    }

    toPng(memeRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'nerdMeme.png'
        link.href = dataUrl
        link.click() 
      })
      .catch(err => {
        console.log(err)
      })
  }, [memeRef])

  const handleMemeType = (e: any): void => {
    setMemeType(e.target.value)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-700 p-6">
      <div className='text-primary text-xl mb-2'>Select you meme mode</div>
      <div className='flex flex-row'>
        <div className='mx-3'> 
          <Button        
            onClick={handleMemeType}
            variant={classicVariant}
            value='classic'
            name='classic'
            color='primary'
          >
            classic
          </Button>
        </div>
        <div className='mx-3'>
          <Button
            onClick={handleMemeType}
            variant={customVariant}
            value='custom'
            name='custom'
            color='primary'
          >
            custom
          </Button>
        </div>
      </div>
      <div className="relative overflow-y-hidden h-2/3 flex flex-row justify-center w-screen my-6 bg-primary">
        { meme && !loading &&
          <div ref={memeRef} className='animate-grow flex justify-center  max-h-contain max-w-fit border-2 border-primary'>
            <MemeDisplay meme={meme} />
          </div>
        }
        { loading && 
          <div className='text-3xl flex flex-col items-center justify-center'>
            <p>Meme Generating!</p>
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          </div>
        }
        <div 
          className={
            `
            transition-all absolute translate-y-[-200vh] bg-secondary_alpha w-full h-[200vh]
            ${animation}`
            } 
        ></div>
      </div>
      <div className='flex flex-row'>
        <div className='m-3'>
          <Button
            onClick={handleGetMeme} 
            variant="contained" 
            color='primary'
            size="large"
            endIcon={<EmojiEmotionsIcon />}
          >
            get a meme!
          </Button>
        </div>
        <div className='m-3'>
          <Button 
            onClick={HandleDownload} 
            variant="contained" 
            color='error'
            size="large"
          >
            download
          </Button>
        </div>
      </div>
    </div>
  )
}

// export const getStaticProps = async () => {
//   return {
//     props: {}
//   }
// }

export default funpage
