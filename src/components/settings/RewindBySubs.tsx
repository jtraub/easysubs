import { useStore } from 'effector-react'
import React, { useEffect } from 'react'
import { toggleRewindBySubsState } from '../../event'
import { rewindBySubsState } from '../../store'

function RewindBySubs() {
  const rewindBySubs = useStore(rewindBySubsState)
  addEnableClass(rewindBySubs)

  useEffect(() => {
    addEnableClass(rewindBySubs)
  })

  function changeShowState(showed: boolean) {
    toggleRewindBySubsState(showed)
    addEnableClass(showed)
  }

  function addEnableClass(showed: boolean) {
    document.documentElement.classList.toggle('rewind-by-subs-enable', showed)
  }

  return (
    <label className="easysubs-label easysubs-settings__item">
      <div className="easysubs-settings__item__left-side">
        <div className="easysubs-label-text">{chrome.i18n.getMessage('rewindBySubs')}</div>
      </div>
      <div className="easysubs-settings__item__right-side">
        <div className="toggle">
          <input
            className="toggle-state setting-toggle"
            type="checkbox"
            name="check"
            value="check"
            defaultChecked={rewindBySubs}
            // tslint:disable-next-line: jsx-no-lambda
            onChange={() => changeShowState(!rewindBySubs)}
          />
          <div className="toggle-inner">
            <div className="indicator" />
          </div>
          <div className="active-bg" />
        </div>
      </div>
    </label>
  )
}
rewindBySubsState.on(toggleRewindBySubsState, (state: any, showed: boolean) => showed)

export default RewindBySubs
