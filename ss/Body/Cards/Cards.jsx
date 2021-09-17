import React from 'react';
import CardItem from './Carditem';
import skin1 from '../../../../assets/img/skin1.png'
import skin2 from '../../../../assets/img/skin2.png'
import skin3 from '../../../../assets/img/skin3.png'
import skin4 from '../../../../assets/img/skin4.jpg'
import './cards.css'
const Cards = () =>{
    return(<div className='cards'>
    <h1>Check out these EPIC SKINS!</h1>
    <div className='cards__container'>
      <div className='cards__wrapper'>
        <ul className='cards__items'>
          <CardItem
            src={skin1}
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
            label='Luxury'
            path='/'
          />
          <CardItem
            src={skin2}
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
            label='Luxury'
            path='/marketplace'
          />
        </ul>
        <ul className='cards__items'>
          <CardItem
            src={skin3}
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
            label='Mystery'
            path='/'
          />
          <CardItem
            src={skin4}
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
            label='Mystery'
            path='/'
          />
          <CardItem
            src={skin1}
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
            label='Luxury'
            path='/'
          />
        </ul>
      </div>
    </div>
  </div>

    )
}
export default Cards