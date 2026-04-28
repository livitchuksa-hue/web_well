// 1. Вернуть число в обратном порядке: 123 -> 321
const reverseNumber = (num) => {
    return parseInt(Math.abs(num).toString().split('').reverse().join('')) * Math.sign(num);
};

// 2. Вернуть число без повторяющихся цифр: 111333456 -> 13456
const removeDuplicates = (num) => {
    const digits = Math.abs(num).toString().split('');
    const uniqueDigits = [...new Set(digits)];
    return parseInt(uniqueDigits.join(''));
};

// 3. Посчитать, сколько раз цифра встречается в числе: (1355567, 5) -> 3
const countDigit = (num, digit) => {
    return Math.abs(num).toString().split('').filter(d => parseInt(d) === digit).length;
};

// 4. Самая длинная последовательность нулей/единиц в двоичной записи
const longestSequence = (num) => {
    const binary = Math.abs(num).toString(2);
    
    const longestZeros = Math.max(...binary.split('1').map(seq => seq.length));
    const longestOnes = Math.max(...binary.split('0').map(seq => seq.length));
    
    return {
        binary: binary,
        longestZeros: longestZeros,
        longestOnes: longestOnes,
        max: Math.max(longestZeros, longestOnes)
    };
};

// Примеры использования
console.log('=== Задача 1 ===');
console.log(reverseNumber(123)); // 321
console.log(removeDuplicates(111333456))
console.log(countDigit(1355567, 5)); // 3
console.log(longestSequence(15)); // 1111 -> { binary: '1111', longestZeros: 0, longestOnes: 4, max: 4 }
console.log(longestSequence(9)); // 1001 -> { binary: '1001', longestZeros: 2, longestOnes: 1, max: 2 }