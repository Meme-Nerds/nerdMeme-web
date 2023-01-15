import { FunctionComponent, useEffect, useRef } from "react"

type Props = {
  dataUrl: string,
  imageBoxHeight: number,
  imageBoxWidth: number
}

const Canvas: FunctionComponent<Props> = ({
  dataUrl,
  imageBoxHeight,
  imageBoxWidth
}) => {
  // const { dataUrl, imageBoxHeight, imageBoxWidth } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx: CanvasRenderingContext2D | null = canvas 
      ? canvas.getContext('2d')
      : null
    const image = new Image
    image.src = dataUrl
    image.onload = () => {
      // trying stuff
      if(canvas) {
        const hRatio = canvas.width / image.width
        const vRatio = canvas.height / image.height
        const ratio = Math.max(hRatio, vRatio)
        const centerShiftX = (canvas.width - image.width * ratio) / 2
        const centerShiftY = (canvas.height - image.height * ratio) / 2
        ctx?.clearRect(0, 0, canvas.width, imageBoxHeight)
        ctx?.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio)
        // ctx?.drawImage(image, 0, 0, image.width, image.height,
        //                 0, 0, canvas.width, canvas.height)
      }
      // end tring stuff



    }
  }, [])

  return <canvas ref={canvasRef} height={imageBoxHeight} width={imageBoxWidth} />
}

export default Canvas
