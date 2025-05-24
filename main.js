const tasks = JSON.parse(localStorage.getItem("task")) ?? [];

const taskList = document.getElementById('task-list');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('#todo-input');


// Local Storage
// JSON

function saveTask() {
    localStorage.setItem('task', JSON.stringify(tasks));
}

function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html;
    return div.innerHTML
}


function isDuplicateTask(newTitle,  excludeIndex = -1) {
    const isDuplicate = tasks.some((task,index) => excludeIndex !== index && task.title.toLowerCase() === newTitle.toLowerCase());
    return isDuplicate;
}

function handleTaskAction(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const taskIndex = +taskItem.dataset.index; // dataset
    console.log(taskIndex);
    
    const task = tasks[taskIndex];
    
    if(e.target.closest('.edit')){
        let newTitle = prompt('Enter new title: ', task.title);
        if(newTitle === null) return;

        newTitle = newTitle.trim();
        if(!newTitle){
            alert('Task title cannot be empty!!!');
            return;
        }
        
        if(isDuplicateTask(newTitle, taskIndex)){
            alert('Task title already exists!!!');
            return;
        }
        
        task.title = newTitle;
        renderTask();
        saveTask();
    } else if (e.target.closest('.done')){
        task.completed = !task.completed;
        renderTask();
        saveTask();
    } else if (e.target.closest('.delete')){
        if (confirm(`Are you sure you want to delete "${task.title}" ?`)){
            tasks.splice(taskIndex, 1);
            renderTask();
            saveTask();
        }
        
    }
    
}   

function addTask(e) {
    e.preventDefault();
    const value = todoInput.value.trim();

    if(!value) return alert('Please write something!!!');

    // const isDuplicate = tasks.some(task => task.title.toLowerCase() === value.toLowerCase());
    if(isDuplicateTask(value)){
        return alert('Task aready exists!!!');
    }


    
    tasks.push({
        title: value,
        completed: false
    });
    renderTask();
    saveTask()
    todoInput.value = '';
}


function renderTask() {
    if(!tasks.length){
        taskList.innerHTML = '<li class="emty-message">No tasks available</li>';
        return;
    }

    const html = tasks.map((task, index) => {
        return `<li class="task-item ${task.completed ? "completed" : ""}" data-index="${index} ">
            <span class="task-title">${escapeHTML(task.title)}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${task.completed ? 'Mark as done' : "Mark as undone"}</button>
                <button class="task-btn delete">Delete</button>
            </div>
        </li>`
    }).join('');
    
    taskList.innerHTML = html;
}

todoForm.addEventListener('submit', addTask)
taskList.addEventListener('click', handleTaskAction)
renderTask();