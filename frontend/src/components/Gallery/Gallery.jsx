import { useState } from "react";
import styles from './Gallery.module.css';

const imageModules = import.meta.glob(
    "/src/assets/stories/**/*.{png,jpg,jpeg}",
    { eager: true, import: "default" }
);

const images = Object.values(imageModules);

function Gallery() {
    const [sizePx, setSizePx] = useState(200); // default card min width
    images.map((img) => console.log(img));
    console.log(images.length);
    return (
        <div className={styles.topLevelContainer}>    
            <h1>Gallery</h1>
            <p>Card size: <strong>{sizePx}px</strong></p>
            <input
                id="cardSize"
                type="range"
                min="60"
                max="500"
                step="10"
                value={sizePx}
                onChange={(e) => setSizePx(Number(e.target.value))}
                style={{ display: "block", margin: "1rem 0" }}
            />
            <div
              className={styles.galleryGrid}
              style={{ '--card-min': `${sizePx}px` }}
            >
                {images.map((img, i) => (
                    <div key={i} className={styles.mediaCard}>
                        <img src={img} className={styles.media}/>
                    </div>
                ))} 
            </div>
        </div>
    )
}

export default Gallery