const DATE = "2024-08-28";
const ASSIGNED_INITIAL_VALUE = "Asignado 1";
const PRIORITY_INITIAL_VALUE = "Alta";
const STATE_INITIAL_VALUE = "Backlog";

let tasks = [
  {
    id: 1,
    title: "Tarea 1",
    description: "Prueba para tarea 1",
    assigned: ASSIGNED_INITIAL_VALUE,
    priority: PRIORITY_INITIAL_VALUE,
    state: STATE_INITIAL_VALUE,
    deadline: DATE,
  },
  {
    id: 2,
    title: "Tarea 2",
    description: "Prueba para tarea 2",
    assigned: ASSIGNED_INITIAL_VALUE,
    priority: PRIORITY_INITIAL_VALUE,
    state: STATE_INITIAL_VALUE,
    deadline: DATE,
  },
];

const statuses = new Map();
statuses.set("add-backlog", "Backlog");
statuses.set("add-to-do", "To Do");
statuses.set("add-in-progress", "In Progress");
statuses.set("add-blocked", "Blocked");
statuses.set("add-done", "Done");

let currentId = 3;
let currentStatus;
loadTasks();

const addTask = document.getElementById("add-new-task");
addTask.addEventListener("click", openModal);

const cancel = document.getElementById("cancel");
cancel.addEventListener("click", clearModal);

const accept = document.getElementById("accept");
accept.addEventListener("click", addTaskHandler);

// para que no se cierre el modal cuando se toque sobre él
const modals = [...document.getElementsByClassName("modal-content")];
modals.forEach((modal) =>
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  })
);

// esto es para la parte de los modales específicos.
const cancel2 = document.getElementById("cancel2");
cancel2.addEventListener("click", clearModal);

const accept2 = document.getElementById("accept2");
accept2.addEventListener("click", addSpecificTaskHandler); // event.target.id -> obtiene el id del elemento que realizo el evento

const addCards = [...document.getElementsByClassName("add-card")];
addCards.forEach((addCard) =>
  addCard.addEventListener("click", (event) => {
    currentStatus = event.target.id;
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

function addTaskHandler() {
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
    id: currentId,
    title: titulo,
    description: descripcion,
    assigned: asignado,
    priority: prioridad,
    state: estado,
    deadline: fecha,
  };

  currentId += 1;
  tasks.push(task);

  clearModal();
  loadTasks();
}

function addSpecificTaskHandler() {
  const titulo = document.getElementById("task-title2").value.trim();
  const descripcion = document.getElementById("task-description2").value.trim();
  const asignado = document.getElementById("task-assigned2").value;
  const prioridad = document.getElementById("task-priority2").value;
  console.log(status);
  const estado = statuses.get(currentStatus);
  const fecha = document.getElementById("deadline2").value;

  if (titulo == "" || descripcion == "" || fecha == "") {
    window.alert("Asegúrate de haber rellenado todos los campos.");
    return;
  }

  const task = {
    id: currentId,
    title: titulo,
    description: descripcion,
    assigned: asignado,
    priority: prioridad,
    state: estado,
    deadline: fecha,
  };

  currentId += 1;
  tasks.push(task);

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
  document.getElementById("task-priority"), (value = PRIORITY_INITIAL_VALUE);
  document.getElementById("task-state").value = STATE_INITIAL_VALUE;
  document.getElementById("deadline").value = "";
}

function loadTasks() {
  clearColumns();
  tasks.forEach((task) => createTaskCard(task));
}

function clearColumns() {
  document.getElementById("Backlog").innerHTML = "";
  document.getElementById("To Do").innerHTML = "";
  document.getElementById("In Progress").innerHTML = "";
  document.getElementById("Blocked").innerHTML = "";
  document.getElementById("Done").innerHTML = "";
}

function createTaskCard(task) {
  let tag = { Alta: "is-danger", Media: "is-warning", Baja: "is-success" };

  const template = `
    <div class="card" id="${task.id}">
        <span class="tag ${tag[task.priority]}"></span>
        <header class="card-header">
            <p class="card-header-title">${task.title}</p>
            <button class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </header>
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
    openTaskModal(event);
    showContent(task);
  });
}

function openTaskModal(event) {
  event.preventDefault();
  event.stopPropagation();

  const createModal = document.getElementById("create-modal");
  createModal.style.display = "none";

  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "flex";

  const statusModal = document.getElementById("status-modal");
  statusModal.style.display = "none";
}

function showContent(task) {
  document.getElementById("title-content").innerHTML = task.title;
  document.getElementById("description-content").innerHTML = task.description;
}
