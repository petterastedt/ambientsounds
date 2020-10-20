let isDisabled
let isMuted

//Run onLoad

(() => {
  const firstItem = cards.length - 1
  renderCards()
  setToolTip()
  changeVideo(firstItem)
  changeAudio(firstItem)
})()

// Render Cards

function renderCards () {
  const cardList = document.querySelector('.cards-list')

  cards.forEach((item, index) => {
    const sounds = item.sounds.map(item => `<li class="item-soundItem">${item.title}</li>`)

    const html = `
      <li class="cards-list-item ${index === cards.length - 1 ? 'active' : ''}" data-category="${item.title}">
        <div class="item-content boxPadding">
          <div class="item-content-top">
            <button class="item-content-buttonVolume" title="mute">
              <img src="./../assets/svg/volume.svg">
            </button>
            <button class="item-content-buttonNext" title="next sound">
              <img src="./../assets/svg/next.svg">
            </button>
            <h2 class="item-content-title">${item.title}</h2>
            <ul class="item-soundList">
              ${sounds.join(" ")}
            </ul>
          </div>
          <p class="item-content-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum aliquid similique sed iusto voluptatem nostrum nesciunt neque quis earum, incidunt expedita.</p>
        </div>
      </li>
    `
    cardList.insertAdjacentHTML('beforeend', html)
  })
}

function setToolTip () {
  const toolTipTop = document.querySelector('.cards-info-top')
  const toolTipBottom = document.querySelector('.cards-info-bottom')

  if (window.innerWidth >= 1024) {
    toolTipTop.textContent = 'Click the background to minimize the card!'
    toolTipBottom.textContent = 'Hit space to change the category'
  } else {
    toolTipTop.textContent = 'Tap the background to minimize the card!'
    toolTipBottom.textContent = 'Swipe to change the category'
  }
}

function changeBackground (pos) {
  const category = cardItems[pos].getAttribute('data-category')
  const body = document.querySelector('body')

  body.classList.remove(...body.classList)
  body.classList.add(`theme--${category}`)
}

function changeVideo (pos) {
  const overlay = document.querySelector('.overlay')
  const video = document.querySelector('#video')
  const videoSource = document.querySelector('video > source')

  video.defaultPlaybackRate = 0.75

  overlay.classList.add('overlay--fade')

  setTimeout(() => {
    let videoUrl

    if (window.innerWidth >= 1440) {
      videoUrl = `${cards[pos].video.slice(0,-4)}_1920.mp4`
    } else if (window.innerWidth > 1024) {
      videoUrl = `${cards[pos].video.slice(0,-4)}_720.mp4`
    } else {
      videoUrl = `${cards[pos].video.slice(0,-4)}_540.mp4`
      console.log(videoUrl)
    }

    video.pause()
    video.currentTime = 0
    videoSource.setAttribute('src', videoUrl)
    video.load()
    video.play()

    overlay.classList.remove('overlay--fade')
  }, 1200)
}

function changeAudio (pos, sound) {
  const audio = document.querySelector('#audio')
  const audioSource = document.querySelector('audio > source')
  let track

  if (sound) {
    track =  cards[pos].sounds[sound].url
  } else {
    track =  cards[pos].sounds[0].url
  }

  audio.pause()
  audio.currentTime = 0

  audioSource.setAttribute('src', track)
  audio.load()
  audio.play()

  if (isMuted) {
    audio.volume = 0
  } else {
    audio.volume = 1
  }
}

function changeCard () {
  isDisabled = true
  cardInfo.style.opacity = 0

  cardItems[position].classList.add('cards-list-item--rolledOut')
  cardItems[position].classList.remove('active')

  position--

  if (position === -1) {
    const cardList = document.querySelector('.cards-list')
    cardItems[0].classList.add('cards-list-item--rolledOut')
    cardList.style.opacity = 0

    setTimeout(() => {
      cardItems.forEach(item => {
        item.classList.remove('cards-list-item--rolledOut')
      })
    }, 1000)

    setTimeout(() => {
      cardList.style.opacity = 1
    }, 1000)

    position = cardItems.length - 1
  }

  cardItems[position].classList.add('active')

  if (cards[position].video) {
    changeVideo(position)
  }

  changeBackground(position)
  changeAudio(position)

  setTimeout(() => isDisabled = false, 1000)
}

// Event listeners

const cardItems = document.querySelectorAll('.cards-list-item')
const cardInfo = document.querySelector('.cards-info')
let position = cardItems.length - 1

document.addEventListener('swiped', (e) => {
  if (!isDisabled) {
    changeCard()
  }
})

document.body.onkeyup = (e) => {
  if (e.keyCode == 32 && !isDisabled) {
    changeCard()
  }
}

cardItems.forEach(item => {
  const overlay = document.querySelector('.overlay')
  const cardList = document.querySelector('.cards')
  const list = Array.from(item.children[0].children[0].children[3].children)
  const buttonVolume = item.children[0].children[0].children[0]
  const buttonVolumeAll = document.querySelectorAll('.item-content-buttonVolume')
  const buttonNext = item.children[0].children[0].children[1]
  let cardIndex = 0
  let minimized = false

  list.forEach((item, index) => {
    if (index === 0) {
      item.classList.add('item-soundItem--active')
    }
  })

  buttonNext.addEventListener('click', () => {
    list[cardIndex].classList.remove('item-soundItem--active')

    if (cardIndex === list.length - 1) {
      cardIndex = 0
    } else {
      cardIndex++
    }

    list[cardIndex].classList.add('item-soundItem--active')

    changeAudio(position, cardIndex)
  })

  buttonVolume.addEventListener('click', () => {
    if (audio.volume === 0 && !isDisabled) {
      audio.volume = 1
      isMuted = false

      buttonVolumeAll.forEach(button => {
        button.classList.remove('item-content-buttonVolume--isMuted')
      })

    } else if (audio.volume !== 0 && !isDisabled) {
      audio.volume = 0
      isMuted = true

      buttonVolumeAll.forEach(button => {
        button.classList.add('item-content-buttonVolume--isMuted')
      })
    }
  })

  overlay.addEventListener('click', () => {
    if (!minimized) {
      cardList.classList.remove('cards--isMinimized')
      minimized = true
    } else {
      cardList.classList.add('cards--isMinimized')
      minimized = false
    }
  })
})
