
// --> Simulação login com dados de sessão ------------------------------------------------------------

// Selecionar os elementos
let loginForm = document.getElementById("login-form");
let username = document.getElementById("username");
let loginContainer = document.getElementById("login-container");
let appContainer = document.getElementById("app-container");
let loginMessage = document.getElementById("login-message");
let loginError = document.getElementById("login-error");
let logout = document.getElementById("logout");

// Função para mostrar a aplicação
function showApp() {

    let myUser = localStorage.getItem("user");

    if (myUser) {

        loginContainer.hidden = true;
        appContainer.hidden = false;

        loginMessage.innerText = "Olá, " + myUser + "!";

    } else {

        loginContainer.hidden = false;
        appContainer.hidden = true;

    }
}

// Fazer login
if (loginForm) {

    loginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        let myUser = username.value.trim();

        if (myUser === "") {

            loginError.innerText = "Introduza o seu nome.";
            return;

        }

        loginError.innerText = "";

        localStorage.setItem("user", myUser);

            console.log(localStorage.getItem("user"));

        this.reset();

        showApp();

    });
}

// Fazer logout
if (logout) {

    logout.addEventListener("click", function() {

        localStorage.removeItem("user");

        showApp();

    });
}

// Ao abrir a página, mostrar o login ou a aplicação
showApp();




//--> Modo noturno ----------------------------------------------------------------------------------

// Selecionar o botão do tema
let themeBtn = document.getElementById("theme-btn");

// Verificar o tema guardado
let savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    document.body.className = savedTheme;
}

// Mudar o texto do botão conforme o tema
function updateThemeText() {

    if (document.body.classList.contains("night")) {
        themeBtn.innerText = "☀️ Modo claro";
    } else {
        themeBtn.innerText = "🌙 Modo noturno";
    }

}

// Função para mudar o tema
function changeMode() {

    if (document.body.classList.contains("day")) {

        document.body.classList.remove("day");
        document.body.classList.add("night");

    } else {

        document.body.classList.remove("night");
        document.body.classList.add("day");

    }

    // Guardar o tema escolhido
    localStorage.setItem("theme", document.body.className);

    updateThemeText();

}

// Quando clicar no botão, mudar o tema
if (themeBtn) {
    themeBtn.addEventListener("click", changeMode);
    updateThemeText();
}


// --> Adicionar, concluir, editar e remover tarefas -------------------------------------------------

// Selecionar os elementos
const myForm = document.getElementById("task-form");
const myList = document.getElementById("task-list");
const taskMessage = document.getElementById("task-message");

// Lista das tarefas (guardada no localStorage)
let tasks = [];
let currentFilter = "all";

// Ler as tarefas guardadas
let savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

// Guardar as tarefas
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Mostrar uma mensagem de erro ou de sucesso
function showMessage(text, isSuccess) {

    taskMessage.innerText = text;

    if (isSuccess) {
        taskMessage.classList.add("success");
    } else {
        taskMessage.classList.remove("success");
    }

    setTimeout(function() {
        taskMessage.innerText = "";
    }, 2000);

}

// Ver se a tarefa deve aparecer com o filtro escolhido
function matchesFilter(task) {

    if (currentFilter == "active") {
        return !task.done;
    } else if (currentFilter == "completed") {
        return task.done;
    } else {
        return true;
    }

}

// Mostrar as tarefas na página
function renderTasks() {

    myList.innerText = "";

    tasks.forEach(function(task, index) {

        if (matchesFilter(task)) {

            let myLi = document.createElement("li");

            // Criar a caixa de seleção
            let myCheckbox = document.createElement("input");
            myCheckbox.type = "checkbox";
            myCheckbox.checked = task.done;

            // Criar o texto da tarefa
            let mySpan = document.createElement("span");
            mySpan.textContent = task.text;

            if (task.done) {
                mySpan.classList.add("done");
            }

            // Marcar tarefa como concluída
            myCheckbox.addEventListener("change", function() {

                tasks[index].done = this.checked;

                saveTasks();
                renderTasks();

            });

            // Criar botão editar
            let editBtn = document.createElement("button");
            editBtn.textContent = "Editar";

            editBtn.addEventListener("click", function() {

                let newTask = prompt("Introduza a nova tarefa:", task.text);

                if (newTask !== null && newTask.trim() !== "") {

                    tasks[index].text = newTask.trim();

                    saveTasks();
                    renderTasks();

                    showMessage("Tarefa editada!", true);

                }

            });

            // Criar botão eliminar
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";

            deleteBtn.addEventListener("click", function() {

                tasks = tasks.filter(function(t, i) {
                    return i !== index;
                });

                saveTasks();
                renderTasks();

                showMessage("Tarefa eliminada!", true);

            });

            // Adicionar elementos à tarefa
            myLi.appendChild(myCheckbox);
            myLi.appendChild(mySpan);
            myLi.appendChild(editBtn);
            myLi.appendChild(deleteBtn);

            myList.appendChild(myLi);

        }

    });

    console.log(tasks);

    updateCounts();

}

// Adicionar tarefas
if (myForm) {

    myForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const dataFromForm = new FormData(this);
        let text = dataFromForm.get("task").trim();

        if (text === "") {

            showMessage("Escreva uma tarefa.", false);
            return;

        }

        tasks.push({
            text: text,
            done: false
        });

        saveTasks();
        renderTasks();

        showMessage("Tarefa adicionada!", true);

        this.reset();

    });
}


// --> Contar tarefas ativas e concluídas -------------------------------------------------

// Selecionar os contadores
let activeCount = document.getElementById("active-count");
let completedCount = document.getElementById("completed-count");
let totalCount = document.getElementById("total-count");

// Função para atualizar os contadores
function updateCounts() {

    let active = 0;
    let completed = 0;

    tasks.forEach(function(task) {

        if (task.done) {

            completed++;

        } else {

            active++;

        }

    });

    activeCount.innerText = active;
    completedCount.innerText = completed;
    totalCount.innerText = tasks.length;

}


// --> Filtros de tarefas ------------------------------------------------------------------

// Selecionar os botões
let filterBtns = document.querySelectorAll(".filter-btn");

// Percorrer os botões
filterBtns.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = this.getAttribute("data-filter");

        console.log(currentFilter);


        // Destacar o filtro escolhido
        filterBtns.forEach(function(btn) {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        renderTasks();

    });

});

// Mostrar as tarefas guardadas ao abrir a página
renderTasks();


// --> Mostrar data e hora atual ---------------------------------------------------------------

// Selecionar os elementos
let currentDate = document.getElementById("current-date");
let currentTime = document.getElementById("current-time");

// Função para mostrar data e hora
function showDateTime() {

    let today = new Date();

    currentDate.innerText = "Data: " + today.toLocaleDateString("pt-PT");

    currentTime.innerText = "Hora: " + today.toLocaleTimeString("pt-PT");

}

// Executar a função
showDateTime();

// Atualizar a hora a cada segundo
setInterval(showDateTime, 1000);



// --> Hora e Temperatura pelo Mundo--------------------------------------------------------------
let timezone = document.getElementById("timezone");
let consultTime = document.getElementById("consult-time");
let timeResult = document.getElementById("time-result");

if (consultTime) {
    consultTime.addEventListener("click", function() {

        let city = timezone.value;

        if (city != "") {

            fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=pt&format=json")
                .then((response) => response.json())
                .then((data) => {

                    console.log(data);

                    if (data.results && data.results.length > 0) {

                        let latitude = data.results[0].latitude;
                        let longitude = data.results[0].longitude;
                        let cityTimezone = data.results[0].timezone;

                        fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m&timezone=" + cityTimezone)
                            .then((response) => response.json())
                            .then((weather) => {

                                console.log(weather); 

                                let temperature = weather.current.temperature_2m;

                                let cityTime = new Date().toLocaleTimeString("pt-PT", {
                                    timeZone: cityTimezone
                                });

                                timeResult.innerText = "Hora local: " + cityTime +
                                    " | Temperatura: " + temperature + " °C";

                            })
                            .catch((error) => {
                                console.log(error);
                                timeResult.innerText = "Não foi possível consultar o tempo.";
                            });

                    } else {
                        timeResult.innerText = "Cidade não encontrada. Tente novamente.";
                    }

                })
                .catch((error) => {
                    console.log(error);
                    timeResult.innerText = "Não foi possível encontrar a cidade.";
                });

        } else {
            timeResult.innerText = "Escreva o nome de uma cidade.";
        }

    });
}
