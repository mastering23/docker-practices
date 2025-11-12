
const API_URL = 'http://localhost:5000/api/tasks';

let tasks = [];

// Cargar tareas al inicio
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error cargando tareas:', error);
        alert('Error conectando con el servidor');
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Por favor escribe una tarea');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: taskText,
                completed: false
            })
        });
        
        const newTask = await response.json();
        tasks.push(newTask);
        input.value = '';
        renderTasks();
    } catch (error) {
        console.error('Error agregando tarea:', error);
        alert('Error agregando tarea');
    }
}

async function toggleTask(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });
        
        task.completed = !task.completed;
        renderTasks();
    } catch (error) {
        console.error('Error actualizando tarea:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        tasks = tasks.filter(t => t._id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error eliminando tarea:', error);
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask('${task._id}')">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">Eliminar</button>
        `;
        
        taskList.appendChild(li);
    });
    
    updateStats();
}

function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = 
        tasks.filter(t => t.completed).length;
}


document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


loadTasks();