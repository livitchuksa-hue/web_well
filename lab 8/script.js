// ======================= ЗАДАЧА 1.1: counter(n) =======================
function counter(n, outputElement) {
    // Очищаем предыдущие интервалы, если есть
    if (window.counterInterval) {
        clearInterval(window.counterInterval);
    }
    
    if (typeof n !== 'number' || n < 0 || isNaN(n)) {
        if (outputElement) outputElement.innerHTML = '❌ Ошибка: n должно быть неотрицательным числом';
        return;
    }
    
    let current = n;
    if (outputElement) outputElement.innerHTML = `🚀 Запущен счётчик от ${n} до 0:<br>`;
    
    window.counterInterval = setInterval(() => {
        if (outputElement) {
            outputElement.innerHTML += `${current}<br>`;
            outputElement.scrollTop = outputElement.scrollHeight;
        }
        
        if (current === 0) {
            clearInterval(window.counterInterval);
            if (outputElement) {
                outputElement.innerHTML += `✅ Счётчик завершён (достигнут 0)<br>`;
            }
            window.counterInterval = null;
        }
        current--;
    }, 1000);
}

// ======================= ЗАДАЧА 1.2: createCounter(n) =======================
function createCounter(n, displayElement, statusSpanElement, statusTextSpan) {
    let currentValue = n;
    let intervalId = null;
    let initialN = n;
    
    const updateDisplay = () => {
        if (displayElement) {
            displayElement.innerHTML = `🎯 <strong>${currentValue}</strong>`;
        }
    };
    
    const updateStatus = (status) => {
        if (statusSpanElement) {
            statusSpanElement.textContent = status;
        }
        if (statusTextSpan) {
            statusTextSpan.textContent = status;
        }
    };
    
    const tick = () => {
        if (currentValue <= 0) {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            updateStatus('✅ Завершён (0)');
            updateDisplay();
            return;
        }
        updateDisplay();
        currentValue--;
    };
    
    const start = () => {
        if (intervalId) {
            updateStatus('⚠️ Счётчик уже запущен');
            return;
        }
        if (currentValue <= 0) {
            updateStatus('❌ Счётчик на нуле, используйте stop()');
            return;
        }
        
        intervalId = setInterval(() => {
            tick();
        }, 1000);
        updateStatus('▶️ Активен');
        updateDisplay();
    };
    
    const pause = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            updateStatus('⏸️ Приостановлен');
        } else {
            updateStatus('⚠️ Счётчик не запущен');
        }
    };
    
    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        currentValue = initialN;
        updateStatus('⏹️ Сброшен (stop)');
        updateDisplay();
    };
    
    return { start, pause, stop };
}

// ======================= ЗАДАЧА 2: delay(N) =======================
function delay(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

async function countWithDelay(start, outputElement) {
    let current = start;
    if (outputElement) {
        outputElement.innerHTML = `⏳ Начинаем отсчёт от ${start} до 0...<br>`;
    }
    
    while (current >= 0) {
        if (outputElement) {
            outputElement.innerHTML += `🔢 ${current}<br>`;
            outputElement.scrollTop = outputElement.scrollHeight;
        }
        
        if (current === 0) {
            if (outputElement) {
                outputElement.innerHTML += `✨ Финиш! Достигнут 0 ✨<br>`;
            }
            break;
        }
        
        await delay(1);
        current--;
    }
}

// ======================= ЗАДАЧА 2 (GitHub) =======================
async function getFirstRepoByUsername(username, outputElement) {
    if (!username || username.trim() === '') {
        if (outputElement) outputElement.innerHTML = '❌ Ошибка: имя пользователя не указано';
        throw new Error('Имя пользователя не указано');
    }
    
    if (outputElement) outputElement.innerHTML = `🔍 Ищем пользователя "${username}"...<br>`;
    
    try {
        const userUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
        const userResp = await fetch(userUrl);
        
        if (!userResp.ok) {
            if (userResp.status === 404) {
                if (outputElement) outputElement.innerHTML = `❌ Пользователь "${username}" не найден на GitHub`;
                throw new Error(`Пользователь "${username}" не найден`);
            }
            throw new Error(`Ошибка GitHub: ${userResp.status}`);
        }
        
        const userData = await userResp.json();
        if (outputElement) outputElement.innerHTML += `✅ Пользователь найден: ${userData.login}<br>`;
        if (outputElement) outputElement.innerHTML += `📁 Загружаем список репозиториев...<br>`;
        
        const reposUrl = userData.repos_url;
        const reposResp = await fetch(reposUrl);
        
        if (!reposResp.ok) {
            throw new Error(`Ошибка получения репозиториев: ${reposResp.status}`);
        }
        
        const repos = await reposResp.json();
        
        if (!Array.isArray(repos) || repos.length === 0) {
            if (outputElement) outputElement.innerHTML += `❌ У пользователя ${username} нет публичных репозиториев`;
            throw new Error(`Нет репозиториев`);
        }
        
        const firstRepoName = repos[0].name;
        
        if (outputElement) {
            outputElement.innerHTML += `🎉 <strong>Первый репозиторий:</strong> ${firstRepoName}<br>`;
            outputElement.innerHTML += `⭐ Звёзд: ${repos[0].stargazers_count || 0}<br>`;
            outputElement.innerHTML += `🔗 URL: ${repos[0].html_url || 'нет'}<br>`;
        }
        
        return firstRepoName;
        
    } catch (error) {
        if (outputElement && !outputElement.innerHTML.includes('❌')) {
            outputElement.innerHTML += `❌ Ошибка: ${error.message}`;
        }
        throw error;
    }
}

// ======================= ЗАДАЧА 3 =======================
class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

async function loadJson(url) {
    const response = await fetch(url);
    if (response.status === 200) {
        return await response.json();
    } else {
        throw new HttpError(response);
    }
}

async function getGithubUserAsyncAwait(outputElement) {
    if (outputElement) {
        outputElement.innerHTML = '👋 Начинаем поиск пользователя...<br>';
    }
    
    let attempt = 0;
    
    while (true) {
        attempt++;
        let name = prompt("Введите логин пользователя GitHub:", "octocat");
        
        if (name === null) {
            if (outputElement) outputElement.innerHTML += '❌ Поиск отменён пользователем<br>';
            return null;
        }
        
        name = name.trim();
        if (name === "") {
            if (outputElement) outputElement.innerHTML += '⚠️ Логин не может быть пустым. Попробуйте снова.<br>';
            continue;
        }
        
        if (outputElement) {
            outputElement.innerHTML += `🔍 Попытка ${attempt}: проверяем пользователя "${name}"...<br>`;
        }
        
        try {
            const user = await loadJson(`https://api.github.com/users/${name}`);
            
            if (outputElement) {
                outputElement.innerHTML += `✅ УСПЕХ! Пользователь найден!<br>`;
                outputElement.innerHTML += `📝 Полное имя: ${user.name || 'не указано'}<br>`;
                outputElement.innerHTML += `🐙 Логин: ${user.login}<br>`;
                outputElement.innerHTML += `👥 Подписчиков: ${user.followers || 0}<br>`;
                outputElement.innerHTML += `📁 Репозиториев: ${user.public_repos || 0}<br>`;
                outputElement.innerHTML += `🎉 Поиск завершён успешно!<br>`;
            }
            
            alert(`Полное имя: ${user.name || 'не указано'}`);
            return user;
            
        } catch (err) {
            if (err instanceof HttpError && err.response.status === 404) {
                if (outputElement) {
                    outputElement.innerHTML += `❌ Пользователь "${name}" не найден. Повторяем ввод...<br>`;
                }
                alert("Такого пользователя не существует, пожалуйста, повторите ввод.");
                continue;
            } else {
                if (outputElement) {
                    outputElement.innerHTML += `💥 Ошибка: ${err.message}<br>`;
                }
                throw err;
            }
        }
    }
}

// ======================= ИНИЦИАЛИЗАЦИЯ =======================
// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация...');
    
    // --- ЗАДАЧА 1.1 ---
    const runCounterBtn = document.getElementById('runCounterBtn');
    const counterNInput = document.getElementById('counterN');
    const output1Div = document.getElementById('counterTask1Output');
    
    if (runCounterBtn && output1Div) {
        runCounterBtn.addEventListener('click', () => {
            let n = parseInt(counterNInput.value, 10);
            if (isNaN(n)) n = 0;
            if (n < 0) n = 0;
            output1Div.innerHTML = '';
            counter(n, output1Div);
        });
    }
    
    // --- ЗАДАЧА 1.2 ---
    const createCounterBtn = document.getElementById('createCounterBtn');
    const startCtrl = document.getElementById('startCounterCtrl');
    const pauseCtrl = document.getElementById('pauseCounterCtrl');
    const stopCtrl = document.getElementById('stopCounterCtrl');
    const counterStartNInput = document.getElementById('counterStartN');
    const controlsDiv = document.getElementById('counterControls');
    const counterValueDisplay = document.getElementById('counterValueDisplay');
    const counterStatusSpan = document.getElementById('counterStatus');
    const counterStatusText = document.getElementById('counterStatusText');
    
    let activeCounterInstance = null;
    
    if (createCounterBtn && counterValueDisplay) {
        createCounterBtn.addEventListener('click', () => {
            let startVal = parseInt(counterStartNInput.value, 10);
            if (isNaN(startVal)) startVal = 0;
            if (startVal < 0) startVal = 0;
            
            if (activeCounterInstance) {
                activeCounterInstance.stop();
            }
            
            const newCounter = createCounter(startVal, counterValueDisplay, counterStatusSpan, counterStatusText);
            activeCounterInstance = newCounter;
            
            counterValueDisplay.innerHTML = `🎯 ${startVal}`;
            if (counterStatusSpan) counterStatusSpan.textContent = '✨ Создан';
            if (counterStatusText) counterStatusText.textContent = '✨ Создан (нажмите start)';
            if (controlsDiv) controlsDiv.style.display = 'flex';
        });
    }
    
    if (startCtrl) {
        startCtrl.addEventListener('click', () => {
            if (activeCounterInstance) {
                activeCounterInstance.start();
            } else {
                alert('Сначала создайте счётчик кнопкой "Создать счётчик"');
            }
        });
    }
    
    if (pauseCtrl) {
        pauseCtrl.addEventListener('click', () => {
            if (activeCounterInstance) {
                activeCounterInstance.pause();
            } else {
                alert('Нет активного счётчика');
            }
        });
    }
    
    if (stopCtrl) {
        stopCtrl.addEventListener('click', () => {
            if (activeCounterInstance) {
                activeCounterInstance.stop();
                const startN = parseInt(counterStartNInput.value, 10);
                if (!isNaN(startN) && counterValueDisplay) {
                    counterValueDisplay.innerHTML = `🎯 ${startN}`;
                }
            } else {
                alert('Нет счётчика');
            }
        });
    }
    
    if (controlsDiv) controlsDiv.style.display = 'none';
    
    // --- ЗАДАЧА 2 (delay) ---
    const runDelayCounterBtn = document.getElementById('runDelayCounterBtn');
    const delayStartInput = document.getElementById('delayStartVal');
    const delayOutputDiv = document.getElementById('delayTaskOutput');
    
    if (runDelayCounterBtn && delayOutputDiv) {
        runDelayCounterBtn.addEventListener('click', async () => {
            let start = parseInt(delayStartInput.value, 10);
            if (isNaN(start)) start = 0;
            if (start < 0) start = 0;
            delayOutputDiv.innerHTML = '';
            await countWithDelay(start, delayOutputDiv);
        });
    }
    
    // --- ЗАДАЧА 2 (GitHub) ---
    const getFirstRepoBtn = document.getElementById('getFirstRepoBtn');
    const githubUsernameInput = document.getElementById('githubUsername');
    const githubOutputDiv = document.getElementById('githubTaskOutput');
    
    if (getFirstRepoBtn && githubOutputDiv) {
        getFirstRepoBtn.addEventListener('click', async () => {
            const username = githubUsernameInput.value.trim();
            githubOutputDiv.innerHTML = '';
            try {
                await getFirstRepoByUsername(username, githubOutputDiv);
            } catch (err) {
                console.error(err);
            }
        });
    }
    
    // --- ЗАДАЧА 3 ---
    const runGithubAsyncBtn = document.getElementById('runGithubUserAsyncBtn');
    const asyncOutputDiv = document.getElementById('asyncTaskOutput');
    
    if (runGithubAsyncBtn && asyncOutputDiv) {
        runGithubAsyncBtn.addEventListener('click', async () => {
            asyncOutputDiv.innerHTML = '';
            try {
                await getGithubUserAsyncAwait(asyncOutputDiv);
            } catch (err) {
                if (asyncOutputDiv) {
                    asyncOutputDiv.innerHTML += `💥 Критическая ошибка: ${err.message}<br>`;
                }
                console.error(err);
            }
        });
    }
    
    console.log('Инициализация завершена, все кнопки активны');
});