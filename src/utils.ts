import { learningServiceStore, subsStore, enableState } from './store'
import EnglishWithFun from './services/english-with-fun'
import KinoPub from './services/kinopub'
import Netflix from './services/netflix'
import YouTube from './services/youtube'
import Coursera from './services/coursera'
import Lingualeo from './learning-services/lingualeo'
import PuzzleEnglish from './learning-services/PuzzleEnglish'
import Video from './video'

const keyboardEvents = ['keyup', 'keydown', 'keypress']

class Utils {
  public static castSubTime(time: number | string) {
    return typeof time === 'number' ? time : parseInt(time, 10)
  }

  public static detectService(): YouTube | Netflix | KinoPub | EnglishWithFun | Coursera | undefined {
    const titleContent = document.querySelector('title')?.textContent
    if (titleContent?.includes('YouTube') || window.location.host === 'www.youtube.com') {
      document.querySelector('html')?.setAttribute('id', 'youtube')
      return new YouTube()
    }
    if (titleContent?.includes('Netflix') || window.location.host === 'www.netflix.com') {
      document.querySelector('html')?.setAttribute('id', 'netflix')
      return new Netflix()
    }
    if (titleContent?.includes('Кинопаб') || document.querySelector('meta[content="Кинопаб"]')) {
      document.querySelector('html')?.setAttribute('id', 'kinopub')
      return new KinoPub()
    }
    if (titleContent?.includes('English-With-Fun') || window.location.host === 'english-with-fun.com') {
      document.querySelector('html')?.setAttribute('id', 'english-with-fun')
      return new EnglishWithFun()
    }
    if (titleContent?.includes('Coursera') || window.location.host === 'www.coursera.org') {
      document.querySelector('html')?.setAttribute('id', 'coursera')
      return new Coursera()
    }

    return undefined
  }

  public static clearWord(word: string): string {
    return word.replace(/[~!@#№$%^&*()_|+\-=?;:",.<>{}[\]\\/]/gi, '')
  }
  public static clearWordContext(sub: string, word: string): string {
    const words = sub
      .replace(/[\r\n]+/g, ' ') // remove ne line
      .replace('  ', ' ') // Remove double spaces
      .replace(/(<([^>]+)>)/gi, '') // Remove tags
      .match(/([^ \r\n][^!?.\r\n]+[\w!?.]+)/g) || [''] // Split to sentences

    return words.find((element) => element.indexOf(word) >= 0) || ''
  }

  public static getVideoCurrentTime(video: HTMLVideoElement) {
    return Math.round(video.currentTime * 1000)
  }

  public static getCurrentLearningService() {
    const currentServiceName = learningServiceStore.getState()
    switch (currentServiceName) {
      case 'lingualeo':
        return new Lingualeo()
      case 'puzzle-english':
        return new PuzzleEnglish()
      default:
        return undefined
    }
  }

  public static isNetflix() {
    return ['www.netflix.com', 'netflix.com'].includes(window.location.host)
  }

  public static keyboardHandler(event: KeyboardEvent) {
    if (!enableState.getState()) return

    const videoElement = document.querySelector('video')
    if (!videoElement) {
      return
    }

    if (event.code === 'ArrowLeft') {
      event.stopPropagation()
      if (event.type === 'keydown') {
        Video.moveToPrevSub(videoElement, subsStore.getState(), event.altKey)
      }
    }
    if (event.code === 'ArrowRight') {
      event.stopPropagation()
      if (event.type === 'keydown') {
        Video.moveToNextSub(videoElement, subsStore.getState(), event.altKey)
      }
    }
  }

  public static addKeyboardEventsListeners() {
    keyboardEvents.forEach((eventType) => {
      document.addEventListener(eventType as any, Utils.keyboardHandler, true)
    })
  }

  public static removeKeyboardEventsListeners() {
    keyboardEvents.forEach((eventType) => {
      document.removeEventListener(eventType as any, Utils.keyboardHandler, true)
    })
  }

  public static arrayStringify(data: string[]): string {
    return data.map((item) => `q=${encodeURIComponent(item)}`).join('&')
  }
}

export default Utils
