import axios from "axios";
import { useState } from "react";

function AdvPage() {
    // Стан для відстеження процесу відправки форми
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Обробник події відправки форми
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setIsSubmitting(true); // Встановлюємо стан "відправка"
        
        // Отримуємо дані з форми
        const formData = new FormData(ev.target);                
        const data = {
            name: await formData.get('title'),
            description: await formData.get('description'),
        };
        
        console.log('Початок відправки даних...');
        
        try {
            // Відправляємо дані на сервер
            await axios.post('http://localhost:4000/annoucementsAdding', data);
            console.log('Дані успішно відправлені!');
        } catch (error) {
            // Обробка помилок при відправці
            console.error('Помилка при відправці:', error);
        } finally {
            // Через 1 секунду скидаємо стан відправки
            setTimeout(() => {
                setIsSubmitting(false);               
            }, 1000);
        }
    };

    return (
        <>  
            {/* Головний заголовок сторінки */}
            <h1 className="text-center text-4xl my-10">Створення оголошення</h1>

            {/* Основна форма */}
            <form 
                className='text-2xl rounded-sm border border-neutral-300 bg-white p-10 shadow-2xl mx-auto max-w-4xl'
                onSubmit={handleSubmit}
            >
                {/* Поле для заголовка оголошення */}
                <div className="mb-8">                    
                    <input 
                        name="title" 
                        placeholder="Заголовок" 
                        className="w-full text-4xl p-2 focus:outline-none border-b border-gray-300"
                        required // Обов'язкове поле
                    />
                </div>
                
                {/* Поле для опису оголошення */}
                <div className="mb-8">
                    <textarea 
                        name="description" 
                        className="w-full text-2xl p-2 focus:outline-none border border-gray-300 rounded min-h-[200px]"
                        placeholder="Опис"
                        required // Обов'язкове поле
                    />
                </div>
                    
                {/* Кнопка відправки форми */}
                <button 
                    type="submit" 
                    className={`w-full p-3 rounded-xl text-white text-2xl transition-colors duration-300 ${
                        isSubmitting ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isSubmitting} // Блокуємо кнопку під час відправки
                >
                    {/* Змінюємо текст кнопки залежно від стану */}
                    {isSubmitting ? 'Відправляється...' : 'Опублікувати'}
                </button>
            </form>
        </>
    );
}
  
export default AdvPage;