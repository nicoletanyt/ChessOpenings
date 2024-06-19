import React from 'react'

export default function OpeningItem({opening}) {
    
    console.log(opening)

  return (
    <li className='opening-item'>
        {opening.opening.name}
        <p>
            {opening.white > opening.black ? "White has a higher chance of winning" : "Black has a higher chance of winning"}
        </p>
    </li>
  )
}
