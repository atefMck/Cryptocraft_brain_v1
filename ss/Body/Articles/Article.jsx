import React from 'react';
import {StyleSheet, css} from 'aphrodite';
import'./article.css';
import world from '../../../../assets/img/mcaxol.jpg';
import bar from '../../../../assets/img/title_bar.png';
const Article = (props) =>{
    const flexStyle = props.flexStyle
    const rev = flexStyle ? css(styles.article, styles.reversed) : css(styles.article)
    return(
        <div className={css(styles.articleContainer)}>
            <h1>New Today</h1>
            <div  className={rev}>
                <div className={css(styles.paragContainer)}>
                    <h6>About GTA WORLD</h6>
                    <h2>Made for players, by players</h2>
                    <img src={bar}></img>
                    <p>GTA World was created with the goal to provide a fun, realistic and dynamic roleplay experience.</p>
                    <p>Our development team is always looking to bring unique features to the server, and thanks to suggestions coming from players - we constantly add new exciting features to the server.</p>
                    <button className='button'>READ MORE</button>
                </div>
                <div className={css(styles.imgContainer)}>
                
                <div className={css(styles.imgimg)}>
                     <img src={world} className={css(styles.img)} ></img> 
                </div>
                </div>
            </div>
        </div>
    )
}
const styles =  StyleSheet.create({
    articleContainer:{
        
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgb(28, 157, 230, .7)',
        border: 'blue 1px solid',
        height: 'auto',
        width:'100%',
        marginTop:'1rem',
        paddingBottom:'20px'
        
    },
    article:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width:'80%',
        alignSelf: 'center',
        '@media (max-width:900px)':{
            flexDirection: 'column',
            justifyContent:'center',
            alignItems: 'center',
        }
    },
    paragContainer:{
        alignSelf: 'flex-start',
        width: '40%',
        '@media (max-width:900px)':{
            textAlign:'center',
            width:'100%'
        }
    },
    imgContainer:{
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
        '@media (max-width:900px)':{
            textAlign:'center',
            width:'100%'
        }
    },
    imgimg:{
        height: '400px',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent' ,
        boxShadow: '0 5px 12.09px 0.91px rgb(0 0 0 / 23%)',
    },
    img:{
        height: '98%',
        width: '98%',
    },
    reversed:{
        flexDirection:'row-reverse'
    },
    
})
export default Article;