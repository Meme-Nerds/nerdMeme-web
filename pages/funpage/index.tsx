import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import React, { 
  useState,
  useCallback,
  useRef,  
  useEffect
} from 'react'
import MemeDisplay from '../../components/MemeDisplay'
import { Meme } from '../../types/types'
import { toPng } from 'html-to-image'

type ObjectOfStrings = {
  [k: string]: string
}

type OptionsState = {
  [k: string]: JSX.Element[]
}

const funpage = () => {
  const [meme, setMeme] = useState<Meme | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const memeRef = useRef<HTMLDivElement | null>(null)
  const [memeMode, setMemeMode] = useState<string>('custom')
  const [customMemeOrder, setCustomMemeOrder] = useState<Meme>({
    setting: '',
    image: '',
    quote: '',
    author: ''
  })
  const [customOptions, setCustomOptions] = useState<OptionsState>({
    settingOptions: [],
    imageOptions:  [],
    quoteOptions: [],
    authorOptions: []
  })

  const animation = loading ? 'animate-shutter' : ''
  const classicVariant = memeMode === 'classic' ? 'contained' : 'outlined'
  const customVariant = memeMode === 'custom' ? 'contained' : 'outlined'

  const routes: ObjectOfStrings = {
    classic: '/api/meme',
    custom: `api/custom-meme/${customMemeOrder.setting}/${customMemeOrder.image}/${customMemeOrder.quote}/${customMemeOrder.author}`,
  }

  const worlds: ObjectOfStrings = {
    Star_Wars: 'star-wars', 
    Star_Trek: 'star-trek',
    Middle_Earth: 'lotr',
    Harry_Potter: 'harry-potter',
    Marvel: 'marvel',
    Battlestar_Galactica: 'battlestar-galactica',
    Xena_Warrior_Princess: 'xena'
  }

  const getOptions = (theseSettings: string) => {
    const inUseWorlds: string[] = Object.values(customMemeOrder)
    return Object.entries(worlds).filter(world => (
      !inUseWorlds.includes(world[1]) || world[1] === customMemeOrder[theseSettings as keyof Meme]
    )).map(option => (
      <MenuItem value={option[1]} key={option[0]}>{option[0].replaceAll('_', ' ')}</MenuItem>
    ))
  }

  useEffect(() => {
    const newState: OptionsState = {
      settingOptions: [],
      imageOptions:  [],
      quoteOptions: [],
      authorOptions: []
    }
    const optionToMemePart: ObjectOfStrings = {
      settingOptions: 'setting',
      imageOptions: 'image',
      quoteOptions: 'quote',
      authorOptions: 'author'
    }
    Object.keys(customOptions).forEach(optionName => {
      newState[optionName] = getOptions(optionToMemePart[optionName])
    })
    setCustomOptions(newState)
  }, [customMemeOrder])

  const handleGetMeme = () => {
    setLoading(true)
    fetch(routes[memeMode])
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

  const handleSetCustomMeme = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    const newCustomMeme: Meme = { ...customMemeOrder }
    newCustomMeme[name as keyof Meme] = value
    setCustomMemeOrder(newCustomMeme)
  }

  const handleClearMeme = () => {
    setMeme(null)
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
    if(meme) setMeme(null)
    setMemeMode(e.target.value)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-700 p-6">
      <div className='text-primary text-xl mb-2'>Select your meme mode</div>
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
      <div className='h-10 pt-4'>
        { meme &&
          <Button 
            variant='text' color='primary' 
            onClick={handleClearMeme}
          >
            {`Clear ${memeMode} meme`}
          </Button>
        }
      </div>
      <div className="relative overflow-y-hidden h-2/3 flex flex-row justify-center w-screen my-6 bg-primary">
        { memeMode === 'custom' && !meme && ! loading &&
          <div className="flex flex-col justify-center">
            <div className='text-xxl text-secondary'>Select a Universe for each category!</div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel id='settings_label' >Setting</InputLabel>
                <Select
                  labelId='settings_label'
                  id='settings_select'
                  label='choose a setting'
                  name='setting'
                  value={customMemeOrder.setting}
                  onChange={handleSetCustomMeme}
                >
                  { customOptions.settingOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel id='images_label' >Image</InputLabel>
                <Select
                  labelId='images_label'
                  id='images_select'
                  name='image'
                  value={customMemeOrder.image}
                  onChange={handleSetCustomMeme}
                >
                  { customOptions.imageOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel id='quotes_label' >Quote</InputLabel>
                <Select
                  labelId='quotes_label'
                  id='quotes_select'
                  name='quote'
                  value={customMemeOrder.quote}
                  onChange={handleSetCustomMeme}
                >
                  { customOptions.quoteOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel id='authors_label' >Quote</InputLabel>
                <Select
                  labelId='authors_label'
                  id='authors_select'
                  name='author'
                  value={customMemeOrder.author}
                  onChange={handleSetCustomMeme}
                >
                  { customOptions.authorOptions }
                </Select>
              </FormControl>
            </div>
          </div>
        }
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
