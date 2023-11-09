import React from 'react'
import { L } from '../../i18next'
import './index.css'

interface ParagProps {
    textLength: number,
    text: string
}
const ParagWithSeeMore: React.FC<ParagProps> = ({ textLength, text }) => {
    const handleButtonClick = (event: any) => {
        const {currentTarget,parentElement,childNodes} = event
        if(currentTarget !==null && parentElement!== null && childNodes!==null){
        event.currentTarget.parentElement.childNodes[0].classList.toggle('expand')
        if (!event.currentTarget.parentElement.childNodes[0].classList.contains('expand')) {
            event.currentTarget.innerText = L('SeeMore')
        } else {
            event.currentTarget.innerText = L('SeeLess')
        }
        }

    }
    return (
      <div>
        <p className='message-parag'>
          {text && text}
        </p>
        {text && text.length > textLength && (
        <button
          type='button'
          className='more-btn'
          onClick={handleButtonClick}
        >
          {L('SeeMore')}
        </button>
            )}

      </div>
    )

}


export default ParagWithSeeMore