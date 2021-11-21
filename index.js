const youtubeEmbedUrl = 'https://www.youtube.com/embed'

const testUrl = 'https://www.youtube.com/watch?v=aHy-Y007JJ0'

const timeoutLoadVideo = 2

const splitInfo = (x, dateDefault) => {
  const strSplit    = x.split(' - ')
  const arrayMinSec = strSplit[0].split(':')
  const miliseconds = (arrayMinSec[0] / 60 + arrayMinSec[1]) * 1000
  return {
    date   : new Date(dateDefault.getTime() + miliseconds),
    url    : strSplit[1],
    idVideo: (new URL(testUrl)).searchParams.get('v'),
  }
}

const formatTimeUniqueSeconds = (date) => `${date.getHours()},${date.getMinutes()},${date.getSeconds()}`

const createElement = (type, parameters) => {
  const element = document.createElement(type)

  const parametersDefault = ['id', 'textContent']

  Object.keys(parameters).forEach((parameter) => {
    // eslint-disable-next-line no-param-reassign
    if (parametersDefault.includes(parameter)) element[parameter] = parameters[parameter]
    // eslint-disable-next-line no-param-reassign
    element.style[parameter] = parameters[parameter]
  })

  return element
}

const getCloseIframeVideo = () => {
  const closeDiv = createElement('div', {
    id             : 'closeCitedVideo',
    height         : '35px',
    width          : '35px',
    position       : 'absolute',
    bottom         : '0px',
    right          : '0px',
    zIndex         : '12',
    color          : 'red',
    transform      : 'rotate(45deg)',
    cursor         : 'pointer',
    transformOrigin: 'center',
    fontSize       : '50px',
    textAlign      : 'center',
    lineHeight     : '35px',
    textContent    : '+',
  })

  return closeDiv
}

const getIframeVideo = (src) => {
  const iframe = document.createElement('iframe')

  iframe.id     = 'iframeCitedVideo'
  iframe.height = '100%'
  iframe.width  = '100%'
  iframe.src    = src

  return iframe
}

const getContainerIframeVideo = (iframe, closeIframe) => {
  const containerIframe = createElement('div', {
    id          : 'containerIframeCitedVideo',
    height      : '80%',
    width       : '95%',
    position    : 'absolute',
    top         : '43%',
    left        : '50%',
    transform   : 'translate(-50%, -50%)',
    zIndex      : '11',
    display     : 'none',
    border      : '3px solid #ffffff82',
    borderRadius: '5px',
    overflow    : 'hidden',
  })

  containerIframe.appendChild(iframe)
  containerIframe.appendChild(closeIframe)

  return containerIframe
}

const closeIframeVideo     = getCloseIframeVideo()
const iframe               = getIframeVideo('')
const containerIframeVideo = getContainerIframeVideo(iframe, closeIframeVideo)

const changeUrlIframeVideo = (url) => {
  iframe.src = url
}

const isClosedContainerIframe = () => containerIframeVideo.style.display === 'none'

const closeContainerIframe = () => {
  containerIframeVideo.style.display = 'none'
  document.querySelector('#movie_player video').play()
}

const openContainerIframe = () => {
  containerIframeVideo.style.display = 'block'
}

setTimeout(() => {
  const containerPlayer = document.querySelector('#movie_player')
  const player          = containerPlayer.querySelector('video')
  const description     = document.querySelector('#content #description').textContent

  containerPlayer.appendChild(containerIframeVideo)

  const toggleDisplayContainerIframe = () => {
    if (isClosedContainerIframe()) {
      openContainerIframe()
    } else if (!player.paused) {
      closeContainerIframe()
    }
  }

  closeIframeVideo.addEventListener('click', () => {
    closeContainerIframe()
  })

  const dateStartVideo = new Date()
  const getPlayerDate  = () => new Date(dateStartVideo.getTime() + player.currentTime * 1000)

  const matchedCited = [...description.matchAll(/\d{1,2}:\d{1,2} [-,–] https:\/\/[\w,.,/]+/g)]
    .map((x) => splitInfo(x[0], dateStartVideo))

  let lastTimeMatched = dateStartVideo

  const addMatchCitedVideo = (url) => {
    changeUrlIframeVideo(url)
    setTimeout(() => {
      player.pause()
      toggleDisplayContainerIframe()
    }, timeoutLoadVideo * 1000)
  }

  ['onplay', 'onseeking'].forEach((x) => {
    player[x] = () => {
      if (!isClosedContainerIframe()) closeContainerIframe()
    }
  })

  player.ontimeupdate = () => {
    const playerDate = getPlayerDate()
    if (formatTimeUniqueSeconds(lastTimeMatched) !== formatTimeUniqueSeconds((playerDate))) {
      lastTimeMatched = playerDate

      const cited = matchedCited.find((x) => (
        x.date.getHours() === playerDate.getHours()
        && x.date.getSeconds() - timeoutLoadVideo === playerDate.getSeconds()
        && x.date.getMinutes() === playerDate.getMinutes()
      ))

      if (cited) {
        addMatchCitedVideo(`${youtubeEmbedUrl}/${cited.idVideo}`)
      }
    }
  }
}, 1500)
