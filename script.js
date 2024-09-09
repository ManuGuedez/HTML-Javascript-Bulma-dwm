const DATE = "2024-08-28";
const ASSIGNED_INITIAL_VALUE = "Asignado 1";
const PRIORITY_INITIAL_VALUE = "Alta";
const STATE_INITIAL_VALUE = "Backlog";

const url = "http://localhost:3000/tasks";

async function fetchDataAW() {
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json(); // extract JSON from response
    return data;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

let tasks = [];
loadTasks();

const statuses = new Map();
statuses.set("add-backlog", "Backlog");
statuses.set("add-to-do", "To Do");
statuses.set("add-in-progress", "In Progress");
statuses.set("add-blocked", "Blocked");
statuses.set("add-done", "Done");

// let currentId = 3;
let currentStatus;
let currentTask = tasks[1];

// Seteo los listeners de los diferentes elementos del DOM
const addTask = document.getElementById("add-new-task");
addTask.addEventListener("click", openModal);

const cancel = document.getElementById("cancel");
cancel.addEventListener("click", clearModal);

const accept = document.getElementById("accept");
accept.addEventListener("click", addTaskHandler);

const editCancel = document.getElementById("edit-cancel");
editCancel.addEventListener("click", () => showContent(currentTask));

const editAccept = document.getElementById("edit-accept");
editAccept.addEventListener("click", () => editTask(currentTask));

// no quedó funcionando
const editDelete = document.getElementById("edit-delete");
editDelete.addEventListener("click", (event) => {
  event.preventDefault();
  deleteTaskAW()
});

// para que no se cierre el modal cuando se toque sobre él
const modals = [...document.getElementsByClassName("modal-content")];
modals.forEach((modal) =>
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  })
);

// esto es para la parte de los modales específicos.
const cancel2 = document.getElementById("cancel2");
cancel2.addEventListener("click", clearSpecificModal);

const accept2 = document.getElementById("accept2");
accept2.addEventListener("click", addSpecificTaskHandler);

const addCards = [...document.getElementsByClassName("add-card")];
addCards.forEach((addCard) =>
  addCard.addEventListener("click", (event) => {
    currentStatus = event.target.id; // event.target.id -> obtiene el id del elemento que realizo el evento

    openStatusModal(event);
  })
);

window.addEventListener("click", closeModals); // para que se cierre el modal cuando toco fuera de él

function openModal(event) {
  event.preventDefault();
  event.stopPropagation(); // para que se pueda cerrar el modal cuanto toco el boton

  const createModal = document.getElementById("create-modal");
  createModal.style.display = "flex";

  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "none";

  const statusModal = document.getElementById("status-modal");
  statusModal.style.display = "none";
}

function openStatusModal(event) {
  event.stopPropagation();

  const createModal = document.getElementById("create-modal");
  createModal.style.display = "none";

  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "none";

  const columnName = document.getElementById("column-name");
  columnName.innerHTML = "Estado: " + statuses.get(currentStatus);

  const statusModal = document.getElementById("status-modal");
  statusModal.style.display = "flex";
}

async function addTaskHandler(event) {
  event.preventDefault();
  console.log("entra al handler");
  const titulo = document.getElementById("task-title").value.trim();
  const descripcion = document.getElementById("task-description").value.trim();
  const asignado = document.getElementById("task-assigned").value;
  const prioridad = document.getElementById("task-priority").value;
  const estado = document.getElementById("task-state").value;
  const fecha = document.getElementById("deadline").value;

  if (titulo == "" || descripcion == "" || fecha == "") {
    window.alert("Asegúrate de haber rellenado todos los campos.");
    return;
  }

  const task = {
    // id: currentId,
    title: titulo,
    description: descripcion,
    assigned: asignado,
    priority: prioridad,
    state: estado,
    deadline: fecha,
  };

  // currentId += 1;

  // tasks.push(task); // esto tiene que ser un post
  // event.preventDefault();
  createTaskFetch(task);
  clearModal();
  loadTasks();
}

async function createTaskFetch(task) {
  console.log("taskA: pepe ");
  try {
    await fetch(url, {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

function addSpecificTaskHandler() {
  const titulo = document.getElementById("task-title2").value.trim();
  const descripcion = document.getElementById("task-description2").value.trim();
  const asignado = document.getElementById("task-assigned2").value;
  const prioridad = document.getElementById("task-priority2").value;
  const estado = statuses.get(currentStatus);
  const fecha = document.getElementById("deadline2").value;

  if (titulo == "" || descripcion == "" || fecha == "") {
    window.alert("Asegúrate de haber rellenado todos los campos.");
    return;
  }

  const task = {
    // id: currentId,
    title: titulo,
    description: descripcion,
    assigned: asignado,
    priority: prioridad,
    state: estado,
    deadline: fecha,
  };

  // currentId += 1;
  createTaskFetch(task);
  // tasks.push(task);

  clearSpecificModal();
  loadTasks();
}

function clearSpecificModal() {
  document.getElementById("task-title2").value = "";
  document.getElementById("task-description2").value = "";
  document.getElementById("task-assigned2").value = ASSIGNED_INITIAL_VALUE;
  document.getElementById("task-priority2"), (value = PRIORITY_INITIAL_VALUE);
  document.getElementById("deadline2").value = "";
}

function closeModals() {
  const createModal = document.getElementById("create-modal");
  createModal.style.display = "none";
  clearModal();

  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "none";

  const statusModal = document.getElementById("status-modal");
  statusModal.style.display = "none";
  clearSpecificModal();
}

function clearModal() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-assigned").value = ASSIGNED_INITIAL_VALUE;
  document.getElementById("task-priority").value = PRIORITY_INITIAL_VALUE;
  document.getElementById("task-state").value = STATE_INITIAL_VALUE;
  document.getElementById("deadline").value = "";
}

function clearEditModal() {
  document.getElementById("edit-title").value = currentTask.title;
  document.getElementById("edit-description").value = currentTask.description;
  document.getElementById("edit-assigned").value = ASSIGNED_INITIAL_VALUE;
  document.getElementById("edit-priority").value = PRIORITY_INITIAL_VALUE;
  document.getElementById("edit-state").value = STATE_INITIAL_VALUE;
  document.getElementById("edit-deadline").value = currentTask.date;
}

function loadTasks() {
  clearColumns();
  let tasksPromise = fetchDataAW();

  tasksPromise.then((data) => {
    tasks = [...data];
    console.log(tasks);
    tasks.forEach((task) => {
      createTaskCard(task);
    });
  });
}

function clearColumns() {
  document.getElementById("Backlog").innerHTML = "";
  document.getElementById("To Do").innerHTML = "";
  document.getElementById("In Progress").innerHTML = "";
  document.getElementById("Blocked").innerHTML = "";
  document.getElementById("Done").innerHTML = "";
}

async function createTaskCard(task) { 
  let tag = { Alta: "is-danger", Media: "is-warning", Baja: "is-success" };

  const template = `
    <div class="card " id="${task.id}">
        <span class="tag ${tag[task.priority]}"></span>
        <header class="card-header">
            <p class="card-header-title">${task.title}</p>
            <button class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </header>
        <p class="card-description">${task.description}</p>
    </div>
    `;

  let column;
  switch (task.state) {
    case "Backlog":
      column = document.getElementById("Backlog");
      break;
    case "To Do":
      column = document.getElementById("To Do");
      break;
    case "In Progress":
      column = document.getElementById("In Progress");
      break;
    case "Blocked":
      column = document.getElementById("Blocked");
      break;
    case "Done":
      column = document.getElementById("Done");
      break;
  }
  column.insertAdjacentHTML("beforeend", template);

  document.getElementById(task.id).addEventListener("click", (event) => {
    currentTask = task;
    openTaskModal(event);
    showContent(task);
  });
}

function openTaskModal(event) {
  // event.preventDefault();
  event.stopPropagation();

  const createModal = document.getElementById("create-modal");
  createModal.style.display = "none";

  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "flex";

  const statusModal = document.getElementById("status-modal");
  statusModal.style.display = "none";
}

function showContent(task) {
  document.getElementById("edit-title").setAttribute("placeholder", task.title);
  document
    .getElementById("edit-description")
    .setAttribute("placeholder", task.description);
  document.getElementById("edit-assigned").value = task.assigned;
  document.getElementById("edit-priority").value = task.priority;
  document.getElementById("edit-state").value = task.state;
  document.getElementById("edit-deadline").value = task.deadline;
}

async function editTask(task) {
  const titulo = document.getElementById("edit-title").value.trim();
  const descripcion = document.getElementById("edit-description").value.trim();
  const asignado = document.getElementById("edit-assigned").value;
  const prioridad = document.getElementById("edit-priority").value;
  const estado = document.getElementById("edit-state").value;
  const fecha = document.getElementById("edit-deadline").value;

  if (titulo != "") {
    task.title = titulo;
  }
  if (descripcion != "") {
    task.description = descripcion;
  }
  if (fecha != "") {
    task.date = fecha;
  }

  task.assigned = asignado;
  task.priority = prioridad;
  task.state = estado;
  console.log(url + `/${task.id}`);

  updateTask(task);
  loadTasks();
}

async function updateTask(task) {
  try {
    await fetch(url + `/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

document.getElementById("theme-switch").addEventListener("change", function () {
  const theme = this.checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
});

async function deleteTaskAW() {
  try {
    console.log("entra bien")
    let response = await fetch(url + `/${currentTask.id}`, {
      method: "DELETE"
    });
    if (response.ok) { 
      console.log('Tarea eliminada exitosamente');
      loadTasks(); // si se pudo eliminar se recargan
    } else {
      console.error('Error al eliminar la tarea:', response.statusText);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}