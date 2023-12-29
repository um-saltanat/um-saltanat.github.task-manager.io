document.addEventListener('DOMContentLoaded', function () {
    const taskListContainer = document.getElementById('taskList');
    fetchTasks();
});

const apiUrl = 'https://658419224d1ee97c6bcef927.mockapi.io/api/v1/tasks';

function fetchTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            displayTasks(tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        
            const listItem = document.createElement('li');
            listItem.className = 'task';

            const taskTitle = document.createElement('span');
            taskTitle.textContent = task.title;

            const addButton = document.getElementById('add-btn');
            addButton.innerHTML = '&#x2b';

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'task-buttons';

            const updateButton = document.createElement('button');
            updateButton.className = 'update-btn';
            updateButton.innerHTML = '🖊';
            updateButton.addEventListener('click', () => updateTask(task.id, task.title));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '\u00d7';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            const completeButton = document.createElement('button');
            const img2 = document.createElement('img');
            img2.src = task.completed ? 'checked.png':'unchecked.png'; 
            img2.alt = task.completed ? 'completed' : 'unfinished';
            img2.width = 25;
            img2.height = 25; 

            completeButton.appendChild(img2);
            completeButton.addEventListener('click', () => toggleComplete(task.id, task.completed));    

            buttonsContainer.appendChild(updateButton);
            buttonsContainer.appendChild(deleteButton);
            buttonsContainer.appendChild(completeButton);

            listItem.appendChild(taskTitle);
            listItem.appendChild(buttonsContainer);

            taskList.appendChild(listItem);

    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const newTaskTitle = taskInput.value;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle, completed: false })
    })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}

function updateTask(taskId, currentTitle) {
    const newTitle = prompt('Update task:', currentTitle);

    if (newTitle !== null) {
        fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle })
        })
            .then(response => response.json())
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error editing task:', error);
            });
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    }
}

function toggleComplete(taskId, isCompleted) {
    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !isCompleted })
    })
        .then(response => response.json())
        .then(() => fetchTasks())
        .catch(error => {
            console.error('Error toggling task completion:', error);
        });
}


document.addEventListener('DOMContentLoaded', function () {
    const authSection = document.getElementById('authSection');
    const taskManagerSection = document.getElementById('taskManager');

    if (!isLoggedIn()) {
        authSection.style.display = 'block';
        taskManagerSection.style.display = 'none';
    }

    fetchTasks();
});

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const authApiUrl = 'https://658419224d1ee97c6bcef927.mockapi.io/api/v1/users'; 
    fetch(authApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(userData => {
            const foundUser = userData.find(user => user.username === username && user.password === password);
            if (foundUser) {
                document.getElementById('authSection').style.display = 'none';
                document.getElementById('taskManager').style.display = 'block';
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                fetchTasks();
            } else {
                alert('Invalid username or password');
                usernameInput.value = '';
                passwordInput.value = '';
            }
        })
        .catch(error => {
            loginError.textContent = error.message;
        });
}




function isLoggedIn() {
    const userData = localStorage.getItem('currentUser');
    return userData !== null;
}

function signup() {
    const signupUsernameInput = document.getElementById('signupUsername');
    const signupPasswordInput = document.getElementById('signupPassword');

    const signupUsername = signupUsernameInput.value;
    const signupPassword = signupPasswordInput.value;

    if (signupUsername.trim() === '' || signupPassword.trim() === '') {
        alert('You must fill in all the fields');
        return;
    }

    const signupApiUrl = 'https://658419224d1ee97c6bcef927.mockapi.io/api/v1/users'; 
    fetch(signupApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: signupUsername, password: signupPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error signing up');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        localStorage.setItem('currentUser', JSON.stringify({ username: signupUsername }));
        fetchTasks();
    })
    .catch(error => {
        alert(error.message);
    });
}

function signOut() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}