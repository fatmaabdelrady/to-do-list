let taskId = 1;
const max_id = 5;
let todos = [];


document.getElementById('taskForm').addEventListener('submit', addTodo);


function addTodo(e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');

    if (taskInput.value.trim() === '') {
        showAlert('Please enter a task.', 'error');
    } else if (taskId > maxId) {
        showAlert('You have reached the maximum number of tasks. Please complete or remove a task before adding a new one.', 'warning');
    } else {
        const toDoObject = createToDoObject(taskInput.value);
        todos.push(toDoObject);
        saveTodos();
        renderTodo(toDoObject);
        taskInput.value = '';
        showAlert('Task added successfully. ID: '+ toDoObject.id, 'success');
        taskId++;
    }
}

function showAlert(message, classname) {
    const messageContainer = document.getElementById('messageContainer');
    const div = document.createElement('div');
    div.className = "message " + classname;
    div.textContent = message;
    messageContainer.appendChild(div);

    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 500);
    }, 5000);
}

function createToDoObject(content) {
    return {
        id: taskId,
        content: content,
        completed: taskId < max_id ? false : true
    };
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


function renderTodo(todo) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.setAttribute('data-id', todo.id);

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskText = document.createElement('span');
    taskText.textContent = todo.content;
    taskText.className = 'task-text';

    taskContent.appendChild(taskText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete';

    li.appendChild(taskContent);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}


document.addEventListener('DOMContentLoaded', renderTodos);

function renderTodos() {
    todos = getTodos();
    taskId = todos.length ? todos.length : 1;
    todos.forEach(todo => renderTodo(todo));
}


function getTodos() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}


document.getElementById('taskList').addEventListener('click', deleteTodo);


function deleteTodo(e) {
    if (e.target.classList.contains('delete')) {
        const li = e.target.parentElement;
        const id = parseInt(li.getAttribute('data-id'));
        todos = todos.filter(todo => todo.id !== id);
        reorganizeTaskIds();
        saveTodos();
        li.remove();
        showAlert('Task removed successfully.', 'success');
    }
}



function reorganizeTaskIds() {
    todos.forEach((todo, index) => {
        todo.id = index + 1;
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    todos.forEach(todo => renderTodo(todo));

    taskId = todos.length ? todos.length: 1;
}