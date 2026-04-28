function addTask() {
    const input = document.getElementById('todoInput');
    const list = document.getElementById('todoList');
    const text = input.value.trim();

    if (!text) return; 

    const date = new Date().toLocaleDateString();
    const li = document.createElement('li');
    
    li.innerHTML = `
        <div>
            <strong>${text}</strong>
            <span class="date">от ${date}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(event, this)">✕</button>
    `;

    li.onclick = function() {
        this.classList.toggle('completed');
    };
    
    list.appendChild(li);
    input.value = ''; 
    input.focus();   
}

function deleteTask(event, button) {
    event.stopPropagation();
    button.parentElement.remove();
}

function clearAll() {
    {
        document.getElementById('todoList').innerHTML = '';
    }
}

document.getElementById('todoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
