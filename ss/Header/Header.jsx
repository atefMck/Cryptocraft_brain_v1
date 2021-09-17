import React from 'react';
import vid from '../../../assets/videos/intro.mp4'
import { StyleSheet, css } from 'aphrodite'
const Header = () =>{
    return(
    <div className={css(styles.Container)}>
      <div className={css(styles.divopacity)}></div>
      <video src={vid} autoPlay loop muted className={css(styles.vid)}></video>
      
      <h1>IT'S TIME TO MINE</h1>
      <p>what are you waiting for </p>
  </div>

    )
}
const styles = StyleSheet.create({

  
    Container: {
      height:'100vh',
      width:'100%',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      boxShadow:'inset 0 0 0 1000px rgba(0,0,0,0,2)',
      
      ':first-child':{
        color:'white',
        fontSize:'50px',
        margintop:'-100px',
        fontFamily:''
      },
      ':nth-child(2)':{
        
      }
    },
    vid:{
      
      objectFit:'cover',
      width:'100%',
      height:'100%',
      position:'fixed',
      zIndex:'-2'
    },
    divopacity:{
      backgroundColor:'black',
      position:'fixed',
      width:'100%',
      height:'100vh',
      opacity:'0.4',
      zIndex:'-1'
    }
  
  }) 
export default Header;