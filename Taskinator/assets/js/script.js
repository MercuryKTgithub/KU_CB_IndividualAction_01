
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// (1) function 1
var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name'").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }
  
  formEl.reset();
  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  createTaskEl(taskDataObj); // action!
};

// (2) function 2
var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute ----------------------------------
  listItemEl.setAttribute("data-task-id", taskIdCounter); 

  // //how to use data-* attributes:
  // <div class="pet" data-animal="puppy" data-voic="woof">Spot</div>
  // //how to use data-* attributes: ------------------------------------

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // add button stuff within a task item
  var taskActionsEl = createTaskActions(taskIdCounter); //new, call to funcion (3)
  listItemEl.appendChild(taskActionsEl);
  console.log(taskActionsEl);     

  // add list item to list
  tasksToDoEl.appendChild(listItemEl);
  // increase task counter for next unique id
  taskIdCounter++;
};

// (3) function 3 :: returns the div object that contains all the action-buttons which are also get created in the function body
var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div"); //will act as a container for the other elements.
  actionContainerEl.className = "task-actions";

  // After these lines, create two new <button> elements and append them to the <div> by adding the following code:
  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  var statusChoices = ["To Do", "In Progress", "Completed"];
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  for (var i = 0; i < statusChoices.length; i++) {
    // create option li elements
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);
