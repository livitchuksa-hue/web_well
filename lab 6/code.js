
function parseArrayFromInput(str, allowStrings = true) {
    if (!str.trim()) return [];
    let arr;
    try {
        let trimmed = str.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            arr = JSON.parse(trimmed);
            if (Array.isArray(arr)) return arr;
        }
    } catch(e) { /* не JSON */ }
    
    let parts = str.split(',').map(s => s.trim()).filter(s => s !== '');
    arr = [];
    for (let part of parts) {
        if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
            arr.push(part.slice(1, -1));
        } 
        else if (!isNaN(part) && part !== '') {
            let num = Number(part);
            arr.push(num);
        } 
        else {
            if (allowStrings) arr.push(part);
            else arr.push(part);
        }
    }
    return arr;
}

function parseObjectsArray(str) {
    try {
        let cleaned = str.trim();
        let parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) return parsed;
        else throw new Error('Не массив');
    } catch(e) {
        try {
            let withQuotes = str.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
            let parsed = JSON.parse(withQuotes);
            if (Array.isArray(parsed)) return parsed;
        } catch(e2) {
            throw new Error('Некорректный JSON массива объектов. Используйте [{"id":1,"isDone":true}]');
        }
    }
}

function deepFlatten(arr) {
    let result = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            result.push(...deepFlatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

function maxDifference(arr) {
    if (!Array.isArray(arr) || arr.length < 2) return 0;
    let numbers = arr.filter(v => typeof v === 'number' && !isNaN(v));
    if (numbers.length < 2) return 0;
    let maxVal = Math.max(...numbers);
    let minVal = Math.min(...numbers);
    return maxVal - minVal;
}

function uniqueArray(arr) {
    let seen = new Set();
    let res = [];
    for (let item of arr) {
        if (!seen.has(item)) {
            seen.add(item);
            res.push(item);
        }
    }
    return res;
}

function filterDoneTrue(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => item !== null && typeof item === 'object' && item.isDone === true);
}

function greaterThan(arr, threshold) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(v => typeof v === 'number' && v > threshold);
}


function countZeroSumPairs(arr) {
    if (!Array.isArray(arr)) return 0;
    const nums = arr.filter(v => typeof v === 'number' && !isNaN(v));
    const n = nums.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] === 0) {
                count++;
            }
        }
    }
    return count;
}

function countZeroSumTriplets(arr) {
    if (!Array.isArray(arr)) return 0;
    const nums = arr.filter(v => typeof v === 'number' && !isNaN(v));
    const n = nums.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] === 0) {
                    count++;
                }
            }
        }
    }
    return count;
}

document.addEventListener('DOMContentLoaded', () => {
    const diffBtn = document.getElementById('calcDiffBtn');
    const diffInput = document.getElementById('diffArrayInput');
    const diffResultDiv = document.getElementById('diffResult');
    diffBtn.addEventListener('click', () => {
        let raw = diffInput.value;
        let arr = parseArrayFromInput(raw, false).filter(v => typeof v === 'number');
        let diff = maxDifference(arr);
        diffResultDiv.innerHTML = `📊 Максимальная разница: <strong>${diff}</strong><br>Исходный массив: [${arr.join(', ')}]`;
    });

    const uniqueBtn = document.getElementById('getUniqueBtn');
    const uniqueInput = document.getElementById('uniqueArrayInput');
    const uniqueResultDiv = document.getElementById('uniqueResult');
    uniqueBtn.addEventListener('click', () => {
        let raw = uniqueInput.value;
        let arr = parseArrayFromInput(raw, true);
        let uniqueArr = uniqueArray(arr);
        uniqueResultDiv.innerHTML = `✨ Массив без повторов: [${uniqueArr.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
    });

    const filterBtn = document.getElementById('filterDoneBtn');
    const objectsTextarea = document.getElementById('objectsInput');
    const doneResultDiv = document.getElementById('doneResult');
    filterBtn.addEventListener('click', () => {
        try {
            let objArray = parseObjectsArray(objectsTextarea.value);
            let filtered = filterDoneTrue(objArray);
            doneResultDiv.innerHTML = `🎀 Отфильтровано (isDone: true): <br> <strong>${JSON.stringify(filtered, null, 2)}</strong>`;
        } catch (err) {
            doneResultDiv.innerHTML = `❌ Ошибка: ${err.message}. Проверьте формат JSON массива объектов. Пример: [{"id":1,"isDone":true},{"id":2,"isDone":false}]`;
        }
    });

    const greaterBtn = document.getElementById('greaterThanBtn');
    const greaterArr = document.getElementById('greaterArrInput');
    const thresholdEl = document.getElementById('thresholdInput');
    const greaterResultDiv = document.getElementById('greaterResult');
    greaterBtn.addEventListener('click', () => {
        let arrRaw = greaterArr.value;
        let arr = parseArrayFromInput(arrRaw, false).filter(v => typeof v === 'number');
        let thresh = parseFloat(thresholdEl.value);
        if (isNaN(thresh)) thresh = 0;
        let result = greaterThan(arr, thresh);
        greaterResultDiv.innerHTML = `🔍 Числа больше ${thresh}: [${result.join(', ')}] (всего: ${result.length})`;
    });

    const flattenBtn = document.getElementById('flattenBtn');
    const nestedInput = document.getElementById('nestedArrayInput');
    const flattenResultDiv = document.getElementById('flattenResult');
    flattenBtn.addEventListener('click', () => {
        try {
            let nested = JSON.parse(nestedInput.value);
            if (!Array.isArray(nested)) throw new Error("Верхний уровень не массив");
            let flat = deepFlatten(nested);
            flattenResultDiv.innerHTML = `🌀 Плоский результат: <br>[${flat.join(', ')}] <br>  исходная вложенность: ${JSON.stringify(nested)}`;
        } catch (err) {
            flattenResultDiv.innerHTML = `❌ Ошибка парсинга JSON. Убедитесь в корректности массива. Пример: [1, [2, [3]]] . Ошибка: ${err.message}`;
        }
    });

    const pairTripleInput = document.getElementById('pairTripleInput');
    const countPairsBtn = document.getElementById('countPairsBtn');
    const countTriplesBtn = document.getElementById('countTriplesBtn');
    const pairTripleResultDiv = document.getElementById('pairTripleResult');
    
    function getNumbersArrayFromPairsInput() {
        let raw = pairTripleInput.value;
        let arr = parseArrayFromInput(raw, false).filter(v => typeof v === 'number' && !isNaN(v));
        return arr;
    }
    
    countPairsBtn.addEventListener('click', () => {
        let nums = getNumbersArrayFromPairsInput();
        let pairsCount = countZeroSumPairs(nums);
        pairTripleResultDiv.innerHTML = `💞 Количество пар (a+b=0): <strong>${pairsCount}</strong><br>Массив: [${nums.join(', ')}]`;
    });
    
    countTriplesBtn.addEventListener('click', () => {
        let nums = getNumbersArrayFromPairsInput();
        let tripleCount = countZeroSumTriplets(nums);
        pairTripleResultDiv.innerHTML = `💖 Количество троек (a+b+c=0): <strong>${tripleCount}</strong><br>Массив: [${nums.join(', ')}]`;
    });
    

    const demoArr = parseArrayFromInput(pairTripleInput.value, false);
    const demoPairs = countZeroSumPairs(demoArr);
    const demoTriples = countZeroSumTriplets(demoArr);
    pairTripleResultDiv.innerHTML = `Результат: пары: ${demoPairs} , тройки: ${demoTriples} (нажмите кнопку для пересчёта)`;
});