import styles from "./Weekly.module.css";
import imgSrc1 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc2 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc3 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc4 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc5 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc6 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc7 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'

function Weekly() {
    // const imgSrc = '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
    const images = [imgSrc1, imgSrc2, imgSrc3, imgSrc4, imgSrc5, imgSrc6, imgSrc7]
    return (
        <div>
            <div className={styles.header}>Header</div>
            <div className={styles.calendar}>
                <div className={styles.calendarColumn}>time slots</div>
                {images.map((src, i) => (
                    <div key={i} className={styles.calendarColumn}>
                        <img src={src}></img>
                    </div>
                ))}
            </div>
            <div className={styles.addEventBtn}>Add Event</div>
        </div>
    )
}

export default Weekly;