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
import { ConstructionOutlined } from '@mui/icons-material'

const funpage = () => {
  const [meme, setMeme] = useState<Meme | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const memeRef = useRef<HTMLDivElement | null>(null)

  const animation = loading ? 'animate-shutter' : ''

  const handleClick = () => {
    setLoading(true)
    fetch('/api/meme')
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

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-700 p-6">
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
            onClick={handleClick} 
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
