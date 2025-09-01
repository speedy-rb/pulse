import styles from "./Weekly.module.css";
import imgSrc1 from '../../assets/08312025/518235653_18511130893045941_5661599903389406608_n.jpg'
import imgSrc2 from '../../assets/08312025/516818439_18349122532084215_6804311255893000883_n.jpg'
import imgSrc3 from '../../assets/08312025/506348862_18071130554479484_4617004184185470533_n.jpg'
import imgSrc4 from '../../assets/08312025/photo_7.jpg'
import imgSrc5 from '../../assets/08312025/516344363_18168781681355582_802596286817281210_n.jpg'
import imgSrc6 from '../../assets/08312025/505495169_18121168714473166_8698424718009572581_n.jpg'
import imgSrc7 from '../../assets/08312025/517022446_18380085310123894_3739198221313845084_n.jpg'

function Weekly() {
    const images = [imgSrc1, imgSrc2, imgSrc3, imgSrc4, imgSrc5, imgSrc6, imgSrc7]
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
        <div>
            <div className={styles.header}>Header</div>
            <div className={styles.calendar}>
                <div className={styles.calendarTimeSlots}>time slots</div>
                {days.map((day, i) => (
                    <div key={i}
                        className={styles.calendarDayHeader}
                        style={{gridColumn: i+2}}
                    >
                        {day}
                    </div>
                ))}
                {images.map((src, i) => (
                    <div key={i}
                        className={styles.calendarColumn}
                        style={{gridColumn: i+2}}
                    >
                        <img src={src}></img>
                    </div>
                ))}
                {Array.from({length: 7}).map((_, i) => (
                    <div key={i}
                        style={{gridColumn: i+2}}
                    >content</div>
                ))}
            </div>
            <div className={styles.addEventBtn}>Add Event</div>
        </div>
    )
}

export default Weekly;