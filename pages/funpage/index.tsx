import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Radio from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
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
import { Card, CardActions, CardContent, FormControlLabel, FormLabel, IconButton, RadioGroup } from '@mui/material'
import HelpCard from '../../components/HelpCard'
import { ConstructionOutlined } from '@mui/icons-material'

type ObjectOfStrings = {
  [k: string]: string
}

type OptionsState = {
  [k: string]: JSX.Element[]
}

const blankMeme: Meme = {
  setting: '',
  image: '',
  quote: '',
  author: ''
}

const funpage = () => {
  const memeRef = useRef<HTMLDivElement | null>(null)
  const [meme, setMeme] = useState<Meme | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [memeMode, setMemeMode] = useState<string>('classic')
  const [memeTheme, setMemeTheme] = useState<string>('original')
  const [removeTempImage, setRemoveTempImage] = useState<boolean>(false)
  const [tutorialStage, setTutorialStage] = useState<number>(0)
  const [customMemeOrder, setCustomMemeOrder] = useState<Meme>(blankMeme)
  const [createMemeOrder, setCreateMemeOrder] = useState<Meme>(blankMeme)
  const [customOptions, setCustomOptions] = useState<OptionsState>({
    settingOptions: [],
    imageOptions:  [],
    quoteOptions: [],
    authorOptions: []
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

  const fontFamilies: ObjectOfStrings = {
    original: 'font-original',
    olde: 'font-olde',
    arcade: 'font-arcade',
    spacey: 'font-spacey',
    fancy: 'font-fancy'
  }

  const getOptions = (theseSettings: string): ReactJSXElement[] => {
    const inUseWorlds: string[] = Object.values(customMemeOrder)
    return Object.entries(worlds).filter(world => (
      !inUseWorlds.includes(world[1]) || world[1] === customMemeOrder[theseSettings as keyof Meme]
    )).map(option => (
      <MenuItem 
        value={option[1]} 
        key={option[0]}
        sx={{
          color: '#01A7C2'
        }}
      >
        {option[0].replaceAll('_', ' ')}
      </MenuItem>
    ))
  }

  const adjustForFont = (quote: string): string => {
    if(memeTheme === 'arcade') return quote.replaceAll(' ', '\u00A0 \u00A0')
    else return quote
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
    if(tutorialStage === 1) advanceTutorial(2)
    if(tutorialStage === 3) advanceTutorial(4)
    if(tutorialStage === 5) advanceTutorial(6)
    setLoading(true)
    let freshMeme = false; 
    if(memeMode !== 'create') {
      fetch(routes[memeMode])
        .then(newMeme => {
          if(newMeme) {
            return newMeme.json()
          }
        })
        .then(finalMeme => {
          const newStuff: string[] = Object.values(finalMeme)
          const oldStuff: string[] = meme ? Object.values(meme) : ['']
          const noRepeats: boolean = newStuff.every(val => !oldStuff.includes(val))
          if(meme && !noRepeats) {
            throw 'oops repeated meme element! Stand by for a fresh meme!'
          } else {
            setMeme({
              ...finalMeme,
              quote: adjustForFont(finalMeme.quote)
            })   
            freshMeme = true
          }
        })
        .finally(() => {
          if(freshMeme) {
            setTimeout(() => {
              setLoading(false)
            }, 3000)
          } else {
            handleGetMeme()
          }
        })
    } else {
      freshMeme = true
      setMeme(createMemeOrder)
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }

  const handleSetCustomMeme = (e: SelectChangeEvent): void => {
    const { name, value } = e.target
    const newCustomMeme: Meme = { ...customMemeOrder }
    newCustomMeme[name as keyof Meme] = value
    setCustomMemeOrder(newCustomMeme)
  }

  const handleClearMeme = (): void => {
    if(tutorialStage === 2) advanceTutorial(3)
    setMeme(null)
    setMemeTheme('original')
    setCreateMemeOrder(blankMeme)
    setCustomMemeOrder(blankMeme)
  }

  const HandleDownload = useCallback(() => {
    console.log('huh => ', tutorialStage)
    if(tutorialStage === 6) {() => advanceTutorial(0)}
    if(memeRef.current === null) {
      return
    }
    toPng(memeRef.current, { 
      cacheBust: true, 
      imagePlaceholder: createMemeOrder.image 
    })
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

  const handleCreateChange = (e: any) => {
    const { name, value } = e.target
      const newCreatedMeme: Meme = { ...createMemeOrder }
      newCreatedMeme[name as keyof Meme] = name === 'image'
        ? URL.createObjectURL(e.target.files[0])
        : value
      setCreateMemeOrder(newCreatedMeme)
  }

  const handleMemeType = (e: any): void => {
    setMemeMode(e.target.value)
    if(tutorialStage === 4) advanceTutorial(5)
    handleClearMeme()
    if(e.target.value === 'create') setRemoveTempImage(true)
    else setRemoveTempImage(false)
  }

  const handleMemeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMemeTheme(e.target.value)
  }

  const advanceTutorial = (num: number): void => {
    console.log('huh? => ', num)
    setTutorialStage(num)
  }

  const handleFinalAdvance = (): void => {
    if(tutorialStage === 6) advanceTutorial(0)
  }

  const handleExitTutorial = (): void => {
    console.log('hit that?')
    advanceTutorial(0)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-800 p-6">
      <h1 className={`${fontFamilies[memeTheme]} text-warning text-6xl mb-4 `}>nerdMeme</h1>
      <p className='text-primary'>
        first time here?
        <Tooltip 
          TransitionComponent={Zoom}
          title='nerMeme generates jumbled memes, created from popular cinematic universes. Want the tour? Click this help icon for tutorial'
        >
          <IconButton onClick={() => advanceTutorial(1)}>
            <HelpOutlineIcon 
              color="warning" 
              fontSize='medium'
              className='ml-1 mb-1'
            />
          </IconButton>
        </Tooltip>
      </p>
      <div className='text-primary text-xl mb-2'>Select your meme mode</div>
      <div className='relative flex flex-row'>
        {tutorialStage === 4 && !loading &&
          <HelpCard 
            tutorialStage={4}
            arrowDir='left'
            messageId={4}
            handleExitTutorial={() => handleExitTutorial}
          />
        }
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
      <div className='relative h-10 pt-4'>
        { meme && !loading &&
          <Button 
            variant='text' color='primary' 
            onClick={handleClearMeme}
          >
            {`Return to ${memeMode} meme-menu`}
          </Button>
        }
        { meme && tutorialStage === 2 && !loading &&
          <HelpCard 
            tutorialStage={2}
            arrowDir='down'
            messageId={2}
            handleExitTutorial={handleExitTutorial}
          />
        } 
      </div>
      <div className="px-0 relative overflow-hidden h-2/3 flex flex-row justify-center w-screen my-6 bg-primary ">
        { !meme && !loading && 
          <div className='mx-8 flex flex-col justify-center'>
            <div className='relative h-2/3 flex items-center'>
            {tutorialStage === 3 &&
              <HelpCard 
                tutorialStage={3}
                arrowDir='left'
                messageId={3}
                handleExitTutorial={handleExitTutorial}
              />
            }
            <FormControl>
              {/* <FormLabel color='primary'>Select a meme-theme</FormLabel> */}
              <p className='text-xl'>Select a meme-theme</p>
              <RadioGroup
                defaultValue="original"
                name='theme-selector'
                onChange={handleMemeTheme}
              >
                <FormControlLabel 
                  value='original'
                  className='my-2'
                  color='primary' 
                  label='original'
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: '#E76F51',
                        },
                      }} 
                    />
                  }
                />
                <FormControlLabel 
                  value='olde' 
                  className='my-2'
                  label='olde'
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#E76F51',
                        },
                      }}
                    />
                  }
                />
                <FormControlLabel 
                  value='arcade'
                  className='my-2' 
                  label='arcade'
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: '#E76F51',
                        },
                      }} 
                    />
                  }
                />
                <FormControlLabel 
                  value='spacey' 
                  className='my-2'
                  label='spacey'
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: '#E76F51',
                        },
                      }} 
                    />
                  }
                />
                <FormControlLabel 
                  value='fancy' 
                  className='my-2'
                  label='fancy'
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: '#E76F51',
                        },
                      }} 
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            </div>
          </div>
        }
        { memeMode === 'custom' && !meme && !loading &&
          <div className="relative mx-8 flex flex-col justify-center">
            { tutorialStage === 5 &&
              <HelpCard 
                tutorialStage={5}
                arrowDir='right'
                messageId={5}
                handleExitTutorial={handleExitTutorial}
              />
            } 
            <div className='text-xl'>Select a universe for each category!</div>
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
          <div className='mx-8 flex flex-col items-center justify-center'>
            <div className='my-4 min-w-[300px]'>
              <p className="text-xl">Add your own stuff!!!</p>
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
                color='info'
                component='label'
                fullWidth
                endIcon={!createMemeOrder.image
                  ? <FileUploadIcon fontSize="large" color="secondary" />
                  : <CheckCircleIcon fontSize="large" color="warning" />
                }
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
              memeTheme={memeTheme} 
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
            transition-all absolute translate-y-[-200vh] bg-secondary_alpha w-screen h-[200vh]
            ${animation}`
            } 
        ></div>
      </div>
      <div className='flex flex-row relative'>
        {tutorialStage === 1 &&
          <HelpCard 
            tutorialStage={1}
            arrowDir='down'
            messageId={1}
            handleExitTutorial={handleExitTutorial}
          />
        }
        {tutorialStage === 6 && !loading &&
          <HelpCard 
            tutorialStage={6}
            arrowDir='down'
            messageId={6}
            handleExitTutorial={handleExitTutorial}
          />
        } 
        <div className='m-3'>
          <Button
            onClick={handleGetMeme} 
            variant="outlined" 
            color='primary'
            size="large"
            endIcon={<EmojiEmotionsIcon color="warning" />}
          >
            get a meme!
          </Button>
        </div>
        <div className='m-3' onClick={handleFinalAdvance}>
          <Button 
            onClick={HandleDownload} 
            variant="outlined" 
            color='primary'
            size="large"
            endIcon={<DownloadIcon color="warning" />}
          >
            download
          </Button>
        </div>
      </div>
    </div>
  )
}

export default funpage
