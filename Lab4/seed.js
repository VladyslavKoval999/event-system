import { connectDB } from './db.js';

const seedData = async () => {
    const db = await connectDB();
    const eventsCollection = db.collection("events");
    const participantsCollection = db.collection("participants");

    try {
        console.log("Очищення попередніх даних...");
        await eventsCollection.deleteMany({});
        await participantsCollection.deleteMany({});

        console.log("Заповнення бази даних подіями...");
        const eventsData = [
            { title: "Акварельний релакс", description: "Основи прозорості та робота з плямами.", date: "2026-02-15", organizer: "ArtStudio UA" },
            { title: "Олійний живопис: Пейзаж", description: "Пишемо класичний пейзаж за 3 години.", date: "2026-02-18", organizer: "Майстерня Світла" },
            { title: "Скетчинг маркерами", description: "Швидкі замальовки міської архітектури.", date: "2026-02-20", organizer: "Urban Sketchers" },
            { title: "Анатомія для художників", description: "Як малювати руки та обличчя правильно.", date: "2026-02-22", organizer: "Академія Мистецтв" },
            { title: "Акриловий абстракціонізм", description: "Вираження емоцій через колір.", date: "2026-02-25", organizer: "Modern Art Hub" },
            { title: "Ботанічна ілюстрація", description: "Детальне малювання квітів.", date: "2026-03-01", organizer: "Green Art" },
            { title: "Цифровий малюнок на iPad", description: "Основи Procreate.", date: "2026-03-05", organizer: "Digital School" },
            { title: "Пастельні мрії", description: "Ніжність та м'якість пастелей.", date: "2026-03-10", organizer: "ArtStudio UA" },
            { title: "Графіка: Вугілля", description: "Робота з контрастом та тінню.", date: "2026-03-12", organizer: "Класична школа" },
            { title: "Японський живопис Сумі-е", description: "Мистецтво малювання тушшю та водою.", date: "2026-03-15", organizer: "Східна Майстерня" }
        ];

        const eventsResult = await eventsCollection.insertMany(eventsData);
        console.log(`Додано ${eventsResult.insertedCount} подій.`);

        console.log("Створення індексів (Advanced вимога)...");
        await eventsCollection.createIndex({ date: 1 });
        await eventsCollection.createIndex({ title: 1 });
        await participantsCollection.createIndex({ event_id: 1 });

        console.log("Додавання тестових учасників...");
        const firstEventId = Object.values(eventsResult.insertedIds)[0];
        const secondEventId = Object.values(eventsResult.insertedIds)[1];
        
        await participantsCollection.insertMany([
            { event_id: firstEventId, fullName: "Іван Петренко", email: "ivan@example.com" },
            { event_id: firstEventId, fullName: "Олена Коваленко", email: "olena@example.com" },
            { event_id: secondEventId, fullName: "Андрій Мельник", email: "andriy@example.com" }
        ]);

        console.log("Базу успішно заповнено! Можна запускати сервер.");
        process.exit();
    } catch (error) {
        console.error("Помилка під час виконання seed-скрипта:", error);
        process.exit(1);
    }
};

seedData();