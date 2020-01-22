const { Path, Point, Color, Shape } = paper
const { Rectangle } = Path
const saveBtn = document.getElementById('saveBtn')
const refreshBtn = document.getElementById('refreshBtn')
const canvas = document.getElementById('pCanvas')
const canvasWidth = canvas.getBoundingClientRect().width
const canvasHeight = canvas.getBoundingClientRect().height

const createMultipleRandomPaths = ({ count, color, margin, width, polygonsAllowed, maxSegmentCount, smoothAllowed, maxWidth, minWidth, forceSmooth }) => {
  const paths = []
  for (let i = 0; i < count; i++) {
    let path = []

    if(polygonsAllowed) {
      path = createRandomPolygon({ color, margin, width, maxSegmentCount, smoothAllowed, maxWidth, minWidth, forceSmooth })
    } else {
      path = createRandomLine({ color, margin, width, maxWidth, minWidth })
    }
    paths.push(path)
  }
  return paths
}

const createPath = ({ x1, y1, x2, y2, color, width }) => {
  let path = new Path()
  let start = new Point(x1, y1)
  let end = new Point(x2, y2)

  path.strokeColor = color || '#FFF'
  path.strokeWidth = width || 1
  path.moveTo(start)
  path.lineTo(end)

  return path
}

const generateRandomBoolean = () => {
  return Math.random() >= 0.5
}

const generateRandomPoint = (margin) => (
  new Point(
    generateRandomX(margin || 0),
    generateRandomY(margin || 0)
  )
)

const createRandomLine = ({ color, margin, width, maxWidth, minWidth }) => {
  const x1 = generateRandomX(margin || 0)
  const x2 = generateRandomX(margin || 0)
  const y1 = generateRandomY(margin || 0)
  const y2 = generateRandomY(margin || 0)
  const c = color || generateRandomColor()
  const w = width || generateRandomValue(maxWidth || 10, minWidth || 1)
  return createPath({
    x1,
    x2,
    y1,
    y2,
    color: c,
    width: w,
  })
}

const createRandomCirle = ({ point, radius, color, maxRadius, minRadius }) => {
  const circle = new Shape.Circle(
    point || generateRandomPoint(),
    radius || generateRandomValue(maxRadius || 200, minRadius || 10)
  )
  circle.fillColor = color || generateRandomColor()
}

const createRandomPolygon = ({ color, margin, width, maxSegmentCount, smoothAllowed, maxWidth, minWidth, forceSmooth }) => {
  const path = createRandomLine({ color, margin, width, maxWidth, minWidth })
  const iterationCount = generateRandomValue(maxSegmentCount)
  if(iterationCount === 0) {
    return path
  } else {
    for(let i = 0; i < iterationCount; i++) {
      path.add(generateRandomPoint())
    }
    if(smoothAllowed) {
      if(forceSmooth || generateRandomBoolean()) {
        path.smooth()
      }
    }
    return path
  }
}

const createBorder = ({ borderWidth, borderColor }) => {
  const rect = new Rectangle(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth)
  rect.strokeWidth = borderWidth
  rect.strokeColor = borderColor
  rect.fillColor = 'transparent'
  console.log(rect)
  paper.view.draw()
  return rect
}

const generateRgbColor = (r, g, b) => {
  return new Color(
    r / 255,
    g / 255,
    b / 255
  )
}

const generateRandomColor = () => {
  return new Color(
    Math.random(),
    Math.random(),
    Math.random()
  )
}

const generateRandomValue = (max, min) => {
  if(!min && !max) {
    // default is between 1 and 10
    return Math.round( Math.max(Math.random() * 10 ), 1)
  } else if(max && !min) {
    return Math.round( Math.max(Math.random() * max), 1)
  }
    else {
    return Math.round(
      Math.min(
        Math.max(
          Math.random() * max
        , min)
      , max)
    )
  }
}

const generateRandomX = (margin) => {

  return Math.round( Math.random() * (canvasWidth + margin) ) - margin / 2
}

const generateRandomY = (margin) => {

  return Math.round( Math.random() * (canvasHeight + margin) ) - margin / 2
}

const setBackgroundColor = (color) => {
  const bg = new Rectangle(0, 0, canvasWidth, canvasHeight)
  bg.fillColor = color
} 

const init = () => {
  paper.setup('pCanvas')
  setBackgroundColor(generateRgbColor(0, 0, 0))
  
  const paths = createMultipleRandomPaths({
    count: generateRandomValue(150, 25),
    color: generateRgbColor(255, 255, 255),
    maxWidth: 8,
    minWidth: 4,
    margin: generateRandomValue(100, 0),
    polygonsAllowed: true,
    maxSegmentCount: generateRandomValue(5, 2),
    smoothAllowed: true,
    forceSmooth: false,
  })

  createRandomCirle({})

  createBorder({ borderWidth: 32, borderColor: generateRgbColor(0, 0, 0) })

  paper.view.draw()
}

const saveAsImage = (mimetype, filename) => {
  const img = canvas.toDataURL((mimetype || 'image/png') + ';base64' )
  let lnk = document.createElement('a'), e

  lnk.download = filename || 'image.png'
  lnk.href = img

  if (document.createEvent) {
    e = document.createEvent("MouseEvents")
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null)

    lnk.dispatchEvent(e)
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick")
  }
}

const clearCanvas = () => {
  paper.project.clear()
  paper.view.draw()
}

const refresh = () => {
  clearCanvas()
  init()
}

window.addEventListener('load', init, { passive: true })
saveBtn.addEventListener('click', saveAsImage)
refreshBtn.addEventListener('click', refresh)
document.addEventListener("keypress", e => {
  console.log(e)
  if (e.keyCode === 32) { //space bar
    refresh()
  } else if (e.keyCode === 13) { //enter
    saveAsImage()
  }
})