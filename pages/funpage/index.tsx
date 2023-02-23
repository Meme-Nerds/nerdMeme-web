import React, { 
  useState,
  useCallback,
  useRef,  
  useEffect
} from 'react'
import {
  TextField,
  Button,
  LinearProgress,
  Box,
  FormControl,
  InputLabel,
  Radio,
  Tooltip,
  Zoom,
  MenuItem,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Snackbar,
} from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MemeDisplay from '../../components/MemeDisplay'
import { 
  Meme, 
  StringIndexed, 
  OptionsState,
  AlertInfo,
  AlertType
} from '../../types/types'
import { toPng } from 'html-to-image'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import HelpCard from '../../components/HelpCard'

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
  const [expandDisplayPortal, setExpandDisplayPortal] = useState<boolean>(false)
  const [displayHeight, setDisplayHeight] = useState<string>('h-[60vh]')
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [customOptions, setCustomOptions] = useState<OptionsState>({
    settingOptions: [],
    imageOptions:  [],
    quoteOptions: [],
    authorOptions: []
  })
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    type: 'warning',
    message: '',
  })
  const animation = loading ? 'animate-shutter' : ''
  const classicVariant = memeMode === 'classic' ? 'contained' : 'outlined'
  const customVariant = memeMode === 'custom' ? 'contained' : 'outlined'
  const createVariant = memeMode === 'create' ? 'contained' : 'outlined'

  const routes: StringIndexed = {
    classic: '/api/meme',
    custom: `api/custom-meme/${customMemeOrder.setting}/${customMemeOrder.image}/${customMemeOrder.quote}/${customMemeOrder.author}`,
  }

  const worlds: StringIndexed = {
    Star_Wars: 'star-wars', 
    Star_Trek: 'star-trek',
    Middle_Earth: 'lotr',
    Harry_Potter: 'harry-potter',
    Marvel: 'marvel',
    Battlestar_Galactica: 'battlestar-galactica',
    Xena_Warrior_Princess: 'xena'
  }

  const fontFamilies: StringIndexed = {
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

  const notify =  (message: string, type: AlertType = 'warning') => {
    setAlertInfo({
      type,
      message
    })
    setShowNotification(true)
  }

  const handleHideNotification = (): void => {
    setShowNotification(false)
  }

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>((
    props,
    ref
  ) => {
    return <MuiAlert 
      elevation={6}
      ref={ref}
      variant='filled'
      {...props}
    />
  })

  useEffect(() => {
    const newState: OptionsState = {
      settingOptions: [],
      imageOptions:  [],
      quoteOptions: [],
      authorOptions: []
    }
    const optionToMemeComp: StringIndexed = {
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
    if(memeMode === 'custom' && Object.values(customMemeOrder).includes('')) {
      return notify('You must select a universe for each category!')
    }
    if(memeMode === 'create') {
      if(createMemeOrder.image === '' || createMemeOrder.quote === '') {
        return notify('You must at least upload an image and write in a quote to create a meme!')
      }
    }
    handleExpandDisplay()
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

  const handleExpandDisplay = () => {
    setExpandDisplayPortal(true)
    setTimeout(() => {
      setDisplayHeight('h-[80vh] max-h-fit')
    }, 2000)
  }

  const handleClearMeme = (): void => {
    if(tutorialStage === 2) advanceTutorial(3)
    setMeme(null)
    setMemeTheme('original')
    setCreateMemeOrder(blankMeme)
    setCustomMemeOrder(blankMeme)
    setExpandDisplayPortal(false)
  }

  const HandleDownload = useCallback(() => {
    
    if(tutorialStage === 6) {() => advanceTutorial(0)}
    if(memeRef.current === null) {
      return notify('Nothing to download yet. Get a meme first!')
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
    setMemeTheme('original')
    if(tutorialStage === 4) advanceTutorial(5)
    handleClearMeme()
    if(e.target.value === 'create') setRemoveTempImage(true)
    else setRemoveTempImage(false)
  }

  const handleMemeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMemeTheme(e.target.value)
  }

  const advanceTutorial = (num: number): void => {
    console.log('cur stage => ', tutorialStage)
    console.log('new-tut-stage => ', num)
    if(num === 1) {
      setMemeMode('classic')
    }
    setTutorialStage(num)
  }

  const handleFinalAdvance = (): void => {
    if(tutorialStage === 6) advanceTutorial(0)
  }

  const handleExitTutorial = (): void => {
    advanceTutorial(0)
  }

  const tutorialStageisTwoOrFour = tutorialStage === 2 || tutorialStage === 4

  return (
    <div className="
      relative h-screen bg-slate-800 p-6 w-screen 
      flex flex-col justify-center items-center
    ">

      <h1 className={`
        ${fontFamilies[memeTheme]} 
        text-warning text-6xl mb-3 
      `}
      >
        nerdMeme
      </h1>

      {!meme && !loading &&
        <div className={`
          flex flex-col items-center 
        `}>
          <p className=' text-primary underline'>
            first time here?
            <Tooltip 
              TransitionComponent={Zoom}
              title='nerdMeme generates jumbled memes, created from popular cinematic universes. Want the tour? Click help icon for a quick tutorial.'
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
          <div className='animate-fade_in relative flex flex-row'>
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
        </div>
      }
      <div className='relative h-10 py-2 mb-4'>
        { meme && !loading &&
          <Button 
            variant='text' 
            color='primary' 
            onClick={handleClearMeme}
          >
            {`Return to ${memeMode} meme-menu`}
          </Button>
        }
        {meme && tutorialStageisTwoOrFour && !loading &&
          <HelpCard 
            tutorialStage={2}
            arrowDir='left'
            messageId={2}
            handleExitTutorial={handleExitTutorial}
          />
        } 
      </div>
      <div className={`
        ${!expandDisplayPortal ? '' : 'animate-expand_display'}
        ${displayHeight}
        px-0 relative overflow-hidden flex flex-row justify-center 
        items-center w-screen my-4 bg-primary fixed bottom-[3vh]
      `}>
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
                      checked={memeTheme === 'original'}
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
                      checked={memeTheme === 'olde'}
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
                      checked={memeTheme === 'arcade'}
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
                      checked={memeTheme === 'spacey'}
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
                      checked={memeTheme === 'fancy'}
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
          <div className='h-full max-h-[600px] flex justify-center items-center'>
            <div ref={memeRef} className=' min-h-2/3 h-full  overflow-y-visible animate-grow flex justify-center max-h-contain max-w-fit border-2 border-primary'>
              <MemeDisplay 
                meme={meme} 
                removeImage={removeTempImage}
                memeTheme={memeTheme} 
                notify={notify}
              />
            </div>
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
          className={`
            transition-all absolute translate-y-[-200vh] 
            bg-secondary_alpha w-screen h-[200vh]
            ${animation}
            `} 
        ></div>
      </div>
      <div className='flex flex-row relative items-center'>
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
            get a meme
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
      <Snackbar 
        open={showNotification} 
        autoHideDuration={5000} 
        onClose={handleHideNotification}
      >
        <Alert severity={alertInfo.type} sx={{ width: '100%' }}> 
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default funpage
