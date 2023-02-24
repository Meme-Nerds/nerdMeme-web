import { FunctionComponent } from "react"
import { Button, Card, CardActions, CardContent } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { NumIndexed, ObjectOfElements } from '../types/types'


type Props = {
  tutorialStage: number,
  arrowDir: string,
  messageId: number,
  handleExitTutorial: () => void
}

const HelpCard:FunctionComponent<Props> = ({
  tutorialStage,
  arrowDir,
  messageId,
  handleExitTutorial
}) => {

  const messageOne = 
  <>
    <p className='whitespace-nowrap'>
    for a classic, original nerdMeme
    </p>              
    <p className='whitespace-nowrap'>
      hit the GET A MEME button below!
    </p>
  </>

  const messageTwo = 
    <p className="whitespace-nowrap">
      Great! Now return to the meme menu.
    </p>

  const messageThree =
  <>
    <p>
      Why not try a meme theme?
    </p>
    <p className="whitespace-nowrap">
      Select one then Get A Meme! 
    </p>
  </>
  const messageFour =
    <>
      <p className="whitespace-nowrap">
        Now click the Custom meme mode button.
      </p>
      <p className="">
        You'll get to choose your universes, but there's a familiar twist!
      </p>
    </>
  
  const messageFive =
    <p className="whitespace-nowrap">Select four universes!</p>

  const messageSix =
    <>
      <p >That's the end of the tour!</p>
      <p>(we think you can figure out CREATE mode for yourself)</p>
      <p className="whitespace-nowrap">If you love this meme, or any other,</p>
      <p>Just click the download button!</p>
    </>

  const messages: ObjectOfElements= {
    1: messageOne,
    2: messageTwo,
    3: messageThree,
    4: messageFour,
    5: messageFive,
    6: messageSix
  }

  const positions: NumIndexed = {
    1: 'left-20 -top-40',
    2: 'left-72 -top-20',
    3: 'left-44 top-20',
    4: 'left-60 -top-32',
    5: '-left-60 top-16',
    6: 'left-56 -top-56'
  }

  return (
    <div className="animate-fadeIn">
      <Card className={`
        ${positions[messageId]}
        absolute bg-slate-800
        `}
        sx={{
          border: 'solid #E76F51 1px',
          zIndex: 10
        }}
      >
        <CardContent>
          <span className='text-xl text-primary text-center'>
            { messages[tutorialStage] }
          </span>
        </CardContent>
        <CardActions>
          {tutorialStage === 5 &&
            <Button 
              variant='text'
              onClick={() => handleExitTutorial()}
              sx={{
                marginRight: 'auto'
              }}
            >
              exit tour
            </Button>
          }
          {arrowDir == 'down' &&
            <KeyboardArrowDownIcon
              className='animate-arrow_bounce' 
              color='warning'
              fontSize='large'
            />
          }
          {arrowDir == 'left' &&
            <KeyboardArrowLeftIcon
              className='animate-arrow_slide' 
              color='warning'
              fontSize='large'
            />
          }
          {arrowDir == 'right' &&
            <KeyboardArrowRightIcon
              className='animate-arrow_slide' 
              color='warning'
              fontSize='large'
              sx={{
                marginLeft: 'auto'
              }}
            />
          }
          {tutorialStage !== 5 &&
            <Button 
              variant='text'
              onClick={() => handleExitTutorial()}
              sx={{
                marginLeft: 'auto'
              }}
            >
              exit tour
            </Button>
          }
        </CardActions>
      </Card>
    </div>
  )
}

export default HelpCard
