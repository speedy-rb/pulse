import styles from "./Weekly.module.css";
import imgSrc1 from '../../assets/stories/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc2 from '../../assets/stories/511327035_18516178342065299_3976111128338068787_n.jpg'
import imgSrc3 from '../../assets/stories/514313135_18277222510285707_6512502184883222966_n.jpg'
import imgSrc4 from '../../assets/stories/515295740_18032639195678785_4193119965195457976_n.jpg'
import imgSrc5 from '../../assets/stories/515461670_18514839649065299_4590827714690636270_n.jpg'
import imgSrc6 from '../../assets/stories/515660226_18358021081154646_3267377219321656423_n.jpg'
import imgSrc7 from '../../assets/stories/515757486_18410511601105805_3395155817585086560_n.jpg'

function Weekly() {
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