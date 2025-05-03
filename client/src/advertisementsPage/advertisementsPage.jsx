import styles from "./advertisementsPageStyles.module.css";
import axios from "axios";

function AdvPage() {

    return (
        <>  
            <h1 className={styles.h1}>Створення оголошення</h1>

            <form className={styles.form} onSubmit={ async (ev) => {
                    ev.preventDefault(); 
        
                    const formData = new FormData(ev.target);                
                        const data = {
                        name: await formData.get('title'),
                        description: await formData.get('description'),
                        
                    };
                    console.log('Submited!');
                    axios.post('http://localhost:4000/admin', data);
                }}>
                <div className={styles.field}>                    
                    <input name="title" placeholder="Заголовок" className={styles.title}/>
                </div>
                <div className={styles.field}>
                </div>
                <div className={styles.field}>
                    <textarea name="description" className={styles.textArea} placeholder="Опис"/>
                </div>
                    
                <button type="submit" className={styles.submitBtn}>Submit</button>
            </form>
        </>
    )
}
  
export default AdvPage;