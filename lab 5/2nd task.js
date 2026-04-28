// 1. Найти самый первый неповторяющийся символ в строке
const firstUniqueChar = (str) => {
    const charCount = new Map();
    
    // Считаем количество каждого символа
    for (const char of str) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Ищем первый символ с количеством 1
    for (const char of str) {
        if (charCount.get(char) === 1) {
            return char;
        }
    }
    
    return null; // если нет уникальных символов
};

// 2. Сгенерировать строку заданной длины из случайных символов (англ буквы + цифры)
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    
    return result;
};

// 3. Вернуть только уникальные символы строки (сохраняя порядок первого вхождения)
const getUniqueChars = (str) => {
    const seen = new Set();
    let result = '';
    
    for (const char of str) {
        if (!seen.has(char)) {
            seen.add(char);
            result += char;
        }
    }
    
    return result;
};

// Примеры использования
console.log('\n=== Задача 2 ===');
console.log(firstUniqueChar('фывфавыапрс')); // 'п'
console.log(generateRandomString(5)); // например '2fvg6'
console.log(getUniqueChars('позволяеткопироватьтекстиз')); // 'позвляеткираьс'

// Дополнительные тесты
console.log('\n=== Дополнительные тесты ===');
console.log('Первый уникальный в "abacabad" ->', firstUniqueChar('abacabad')); // 'c'
console.log('Генерация 10 символов:', generateRandomString(10));
console.log('Уникальные символы "hello world" ->', getUniqueChars('hello world')); // 'helo wrd'