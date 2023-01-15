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
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'

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
  const [memeMode, setMemeMode] = useState<string>('create')
  const [removeTempImage, setRemoveTempImage] = useState<boolean>(false)
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
  const [createMemeOrder, setCreateMemeOrder] = useState<Meme>({
    setting: '',
    image: '',
    quote: '',
    author: ''
  })

  const animation = loading ? 'animate-shutter' : ''
  const classicVariant = memeMode === 'classic' ? 'contained' : 'outlined'
  const customVariant = memeMode === 'custom' ? 'contained' : 'outlined'
  const createVariant = memeMode === 'create' ? 'contained' : 'outlined'

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

  const getOptions = (theseSettings: string): ReactJSXElement[] => {
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
    const optionToMemeComp: ObjectOfStrings = {
      settingOptions: 'setting',
      imageOptions: 'image',
      quoteOptions: 'quote',
      authorOptions: 'author'
    }
    Object.keys(customOptions).forEach(optionName => {
      newState[optionName] = getOptions(optionToMemeComp[optionName])
    })
    setCustomOptions(newState)
  }, [customMemeOrder])

  const handleGetMeme = (): void => {
    setLoading(true)
    if(memeMode !== 'create') {
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
    } else {
      setMeme(createMemeOrder)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  const handleSetCustomMeme = (e: SelectChangeEvent): void => {
    const { name, value } = e.target
    const newCustomMeme: Meme = { ...customMemeOrder }
    newCustomMeme[name as keyof Meme] = value
    setCustomMemeOrder(newCustomMeme)
  }

  const handleClearMeme = (): void => {
    setMeme(null)
  }

  const HandleDownload = useCallback(() => {
    if (memeRef.current === null) {
      return
    }
    if(memeMode === 'create') {
      setRemoveTempImage(true)
    }
    toPng(memeRef.current, { 
      cacheBust: true, 
      imagePlaceholder: createMemeOrder.image 
    })
      .then((dataUrl) => {
        console.log('data url => ', dataUrl)
        const link = document.createElement('a')
        link.download = 'nerdMeme.png'
        link.href = dataUrl
        link.click() 
        if(memeMode === 'create') {
          setRemoveTempImage(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [memeRef])

  const handleCreateChange = (e: any) => {
    const { name, value } = e.target
      const newCreatedMeme: Meme = { ...createMemeOrder }
      newCreatedMeme[name as keyof Meme] = name === 'image'
        ? URL.createObjectURL(e.target.files[0])
        : value
      setCreateMemeOrder(newCreatedMeme)
  }

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
        <div className='mx-3'>
          <Button
            onClick={handleMemeType}
            variant={createVariant}
            value='create'
            name='create'
            color='primary'
          >
            create
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
                <InputLabel color='secondary' id='settings_label' >Setting</InputLabel>
                <Select
                  labelId='settings_label'
                  id='settings_select'
                  label='Setting'
                  name='setting'
                  value={customMemeOrder.setting}
                  onChange={handleSetCustomMeme}
                  color='secondary'
                >
                  { customOptions.settingOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel color='secondary' id='images_label' >Image</InputLabel>
                <Select
                  labelId='images_label'
                  id='images_select'
                  label='Image'
                  name='image'
                  value={customMemeOrder.image}
                  onChange={handleSetCustomMeme}
                  color='secondary'
                >
                  { customOptions.imageOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel color='secondary' id='quotes_label' >Quote</InputLabel>
                <Select
                  labelId='quotes_label'
                  id='quotes_select'
                  label='Quote'
                  name='quote'
                  value={customMemeOrder.quote}
                  onChange={handleSetCustomMeme}
                  color='secondary'
                >
                  { customOptions.quoteOptions }
                </Select>
              </FormControl>
            </div>
            <div className='my-4 min-w-[150px]'>
              <FormControl fullWidth>
                <InputLabel color='secondary' id='authors_label' >Author</InputLabel>
                <Select
                  labelId='authors_label'
                  id='authors_select'
                  label='Author'
                  name='author'
                  value={customMemeOrder.author}
                  onChange={handleSetCustomMeme}
                  color='secondary'
                >
                  { customOptions.authorOptions }
                </Select>
              </FormControl>
            </div>
          </div>
        }
        { memeMode === 'create' && !meme && ! loading && 
          <div className='flex flex-col items-center justify-center'>
            <div className='my-4 min-w-[300px]'>
              <TextField 
                id="create_setting"
                name='setting'
                label='setting'
                variant='filled'
                value={createMemeOrder.setting}
                onChange={handleCreateChange}
                color='secondary'
                fullWidth
              />
            </div>
            <div className='my-4 min-w-[300px]'>
              <Button
                variant='contained'
                color='secondary'
                component='label'
                fullWidth
              >
                Upload Image
                <input
                  name='image'
                  type='file'
                  hidden
                  onChange={handleCreateChange}
                />
              </Button>
            </div>
            <div className='my-4 min-w-[300px]'>
              <TextField 
                id="create_quote"
                name='quote'
                label='quote'
                variant='filled'
                value={createMemeOrder.quote}
                onChange={handleCreateChange}
                color='secondary'
                fullWidth
              />
            </div> 
            <div className='my-4 min-w-[300px]'>
              <TextField 
                id="create_author"
                name='author'
                label='author'
                variant='filled'
                value={createMemeOrder.author}
                onChange={handleCreateChange}
                color='secondary'
                fullWidth
              />
            </div>  
          </div>
        }
        { meme && !loading &&
          <div ref={memeRef} className='animate-grow flex justify-center  max-h-contain max-w-fit border-2 border-primary'>
            <MemeDisplay 
              meme={meme} 
              removeImage={removeTempImage} 
              memeMode={memeMode}  
            />
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

export default funpage
