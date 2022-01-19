
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

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

  // the h3 will pay a role in searching for the task-name later by passing h3.task-name in to querySelector()
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // add button stuff within a task item
  var taskActionsEl = createTaskActions(taskIdCounter); //new, call to funcion (3), returned item is a compact item
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

// (3C)
var editTask = function(taskId) {
  //console.log("editing task #" + taskId);

  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // li 
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName; // the input box
  document.querySelector("select[name='task-type']").value = taskType; // the dropdown select

  document.querySelector("#save-task").textContent = "Save Task"; // change content from Add Task to Save Task
  
  // To include the task's id:
  // This will add the taskId to a data-task-id attribute on the form itself. 
  // It's a new attribute that users won't see but that we can use 
  // later on to save the correct task (trick)
  formEl.setAttribute("data-task-id", taskId); // form is the parent item

};

// (3B)
var deleteTask = function(taskId) {
  // There's no space between the .task-item and the [data-task-id] attribute, which
  // means that both properties must be on the same element li that help define element li
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove(); // remove is built-in function ?!
  //console.log(taskSelected);
};

// (3A)
var taskButtonHandler = function(event) {
  // get target element from event. 
  // event.target reports the element on which the event occurs, in this case, the click event.
  // console.log(event.target);
  var targetEl = event.target;
  
  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {  // matches() doesn't find and return an element. Instead, it returns true if the element would be returned
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  else if (targetEl.matches(".delete-btn")){  // matches() doesn't find and return an element. Instead, it returns true if the element would be returned
    //console.log("you clicked a delete button!");
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};


pageContentEl.addEventListener("click", taskButtonHandler);

formEl.addEventListener("submit", taskFormHandler);
