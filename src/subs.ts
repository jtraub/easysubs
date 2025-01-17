import { subTitleType } from 'subtitle'
import Video from './video'

class Subs {
  public static getCurrentSubsTexts(video: HTMLVideoElement, subs: subTitleType[]): string[] {
    const currentTime = Video.getCurrentTime(video)
    const currentSubs = this.getAllCurrentSub(subs, currentTime)
    return currentSubs.map((sub: subTitleType) => sub.text || '')
  }

  public static subTextToChildNodesArray(text: string): ChildNode[] {
    const tmpDiv = document.createElement('div') as HTMLDivElement
    tmpDiv.innerHTML = text.replace(/(<\d+:\d+:\d+.\d+>)?<[/]?[c].*?>/g, '').replace(/[\r\n]+/g, '\r\n ')
    return Array.from(tmpDiv.childNodes)
  }

  public static getCleanSubText(text: string): string {
    const tmpDiv = document.createElement('div') as HTMLDivElement
    tmpDiv.innerHTML = text
      .replace(/<\d+:\d+:\d+.\d+><c>/g, '')
      .replace(/<\/c>/g, '')
      .replace(/(\r\n|\n|\r)/gm, ' ')
    return tmpDiv.textContent || ''
  }

  public static getCurrentFirstSub(subs: subTitleType[], currentTime: number) {
    return Subs.getAllCurrentSub(subs, currentTime)[0]
  }

  public static getCurrentLastSub(subs: subTitleType[], currentTime: number) {
    return Subs.getAllCurrentSub(subs, currentTime).slice(-1)[0]
  }

  public static getAllCurrentSub(subs: subTitleType[], currentTime: number) {
    return subs.filter((sub: subTitleType) => sub.start <= currentTime && sub.end >= currentTime)
  }

  public static getPrevSub(subs: subTitleType[], currentTime: number): subTitleType | undefined {
    const currentSub = Subs.getCurrentLastSub(subs, currentTime)
    if (currentSub) {
      const indexCurrentSub = subs.findIndex((sub) => sub === currentSub)
      return subs[indexCurrentSub - 1]
    }

    return subs.find((sub, index) => {
      return sub.end <= currentTime && (!subs[index + 1] || subs[index + 1].start >= currentTime)
    })
  }

  public static getNextSub(subs: subTitleType[], currentTime: number): subTitleType | undefined {
    const currentSub = Subs.getCurrentFirstSub(subs, currentTime)
    if (currentSub) {
      const indexCurrentSub = subs.findIndex((sub) => sub === currentSub)
      return subs[indexCurrentSub + 1]
    }

    return subs.find((sub) => sub.start >= currentTime)
  }
}
export default Subs
