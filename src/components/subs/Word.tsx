import { useStore } from 'effector-react'
import React, { useState } from 'react'
import { showFullSubTranslatePopupStore } from '../../store'

import TranslateWordPopup from './TranslateWordPopup'

interface Props {
  tagName: string
  keyName: string
  word: string
  context: string
}

function Word(props: Props) {
  const showFullSubTranslatePopup = useStore(showFullSubTranslatePopupStore)
  const [showTranslation, toggleShowTranslation] = useState(false)
  const wordNode: any = React.useRef(null)

  function showTranslatePopup() {
    if (!showFullSubTranslatePopup) {
      wordNode.current.style.color = '#1296ba'
      toggleShowTranslation(true)
    }
  }

  function hideTranslatePopup() {
    wordNode.current.style.color = '#ffffff'
    toggleShowTranslation(false)
  }

  return React.createElement(
    props.tagName,
    {
      className: 'easysubs-word',
      onClick: hideTranslatePopup,
      onMouseEnter: showTranslatePopup,
      onMouseLeave: hideTranslatePopup,
      ref: wordNode,
    },
    props.word,
    // tslint:disable-next-line: jsx-self-close
    <span key={`space${props.keyName}`}> </span>,
    showTranslation ? <TranslateWordPopup word={props.word} context={props.context} /> : null,
  )
}

export default Word
