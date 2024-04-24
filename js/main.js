// Находим елементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Создание локального хранилища
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

// Сделали рекафторинг кода,создали renderTask функцию,поместили в неё шаблон,и теперь можем вставлять эту функцию куда нам нужно,то-есть мы сократили количество кода
tasks.forEach(function (task) {
    renderTask(task);
})

checkEmptyList();


// Добавление задачи и функции
form.addEventListener('submit', addTask);
function addTask (event) {
    // Делаем чтобы бы при отправке изменения,сайт не обновлялся,а работал дальше
    event.preventDefault();
    console.log('sumbit');

    // Достаем текст из поля ввода
    const taskText = taskInput.value;

    // Описываем задачу в виде обьекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    // Сохраняем данные в localStorage
    saveToLocalStorage();
    
    // Сделали рекафторинг кода,создали renderTask функцию,поместили её в шаблон,и теперь можем вставлять эту функцию куда нам нужно,то-есть мы сократили количество кода
    renderTask(newTask);

    // Добавляем очистку инпута и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    /* // Блок "Список пуст" если в нём больше одного елемента,то мы его скрываем
    if(tasksList.children.length > 1) {
        emptyList.classList.add('none');
    } */
    checkEmptyList();
    
}

// Удаление задачи
tasksList.addEventListener('click', deleteTask)
function deleteTask (event) {
    // Проверяем что клик был по кнопке "удалить задачу"
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('.list-group-item')

        // Определяем ID задачи
        const id = Number(parentNode.id);
        console.log(id);

        // Находим индекс задачи в массиве
        const index = tasks.findIndex(function (task) {
            if (task.id === id) {
                return true;
            }
        })

        // Удаляем задачу из массива
        tasks.splice(index, 1);

        /* // Удаляем задачу через фильтрацию массива
        tasks = tasks.filter((task) => task.id !== id)
        console.log(tasks); */

        // Сохраняем данные в localStorage
        saveToLocalStorage();

        // Удаляем задачу из разметки
        parentNode.remove();
    }

    /* // Блок "Список пуст" если в нём больше одного елемента,то мы его скрываем
    if(tasksList.children.length === 1) {
        emptyList.classList.remove('none');
    } */
    checkEmptyList();
    /* Из-за клика на картинку создается еще один блок(решить проблему!) */
}

// Добавление выполнения задачи
tasksList.addEventListener('click', doneTask)
function doneTask(event) {
    // Проверяем что клик был по кнопке "Задача выполнена"
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item');

        // Определяем ID задачи
        const id = parentNode.id;
        console.log(id);

        const task = tasks.find(function (task) {
            if (task.id == id) {
                return true;
            }
        }) 

        task.done = !task.done;
        console.log(task);

        // Сохраняем данные в localStorage
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title')
        taskTitle.classList.toggle('task-title--done');
    }
}

// Блок "Список пуст"
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                            <div class="empty-list__title">Список дел пуст</div>
                            </li>`;
    tasksList.insertAdjacentHTML('beforebegin', emptyListHTML);
}

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

// Создали функцию которая принимает данные из переменной let tasks и парсит его в строку
function saveToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формируем css класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
            </li>`;
    console.log(taskHTML);

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

// Суть работы с данными,заключается в том,что мы создаем локальное хранилище данных,дальше описываем задачу в виде обьекта,для того чтобы на выходе получать эти данные(создали миллисекундное время,описали текст который выйдет из value нашего input,и описали к ним done,если он ровняется false,то изменений не будет,он будет равен тому-что есть,но если будет true,то применится класс который отметит как выполенную задачу,и так же создали константу и сделали из неё мини условие,что если done = false изменений не будет,если done = true,то будут)