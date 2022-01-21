
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");

// the main tag: has 2 even listeners
var pageContentEl = document.querySelector("#page-content");
// the 1st unordered bullet list ul
var tasksToDoEl = document.querySelector("#tasks-to-do");
// the 2 unordered bullet lists ul's
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// Remember that tasksToDoEl, tasksInProgressEl, and tasksCompletedEl are 
// references to the <ul> elements

var tasks = [];

const STATUS_TODO = "to do";
const STATUS_INPROGRESS = "in progress";
const STATUS_COMPLETED = "completed";

// (1) function 1 - The form click event
var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  
  // formEl.reset();
  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // new
  var isEdit = formEl.hasAttribute("data-task-id");
  
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    //older
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput, 
      status: STATUS_TODO
    };
    createTaskEl(taskDataObj); // will only get called if isEdit is false
  }

};

// 1(A)
var completeEditTask = function(taskName, taskType, taskId) {
  // console.log(taskName, taskType, taskId);
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  completeEditTask

  // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";

  saveTasks();
};

// (2) function 2 -- create the horizonal ui item that gets add to the main page-content when "add task" button is clicked
// Will call function (3) 
var createTaskEl = function(taskDataObj) {
  // testing only
  console.log(taskDataObj);
  console.log(taskDataObj.status);

  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute ----------------------------------
  listItemEl.setAttribute("data-task-id", taskIdCounter);  // passed in global var value

  // //how to use data-* attributes:
  // <div class="pet" data-animal="puppy" data-voice="woof" data-task-id="12">Spot</div>
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

  // Take care of the status assignment of the task reflect in the task-action 3 dropdown selections
  switch (taskDataObj.status) {
    case STATUS_TODO:
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl); // add list item to list
      break;
    case STATUS_INPROGRESS:
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case STATUS_COMPLETED:
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  // Take care of the taskId of the task
  taskDataObj.id = taskIdCounter;

  // new - array push here - temp storage
  tasks.push(taskDataObj); //This method adds any content between the parentheses to the end of the specified array.

  // increase task counter for next unique id
  taskIdCounter++;

  saveTasks();

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
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  var statusChoices = ["To Do", "In Progress", "Completed"];
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

// (4A)
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

// (4B)
var deleteTask = function(taskId) {
  // There's no space between the .task-item and the [data-task-id] attribute, which
  // means that both properties must be on the same element li that help define element li
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove(); // remove is built-in function ?!
  //console.log(taskSelected);

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id does NOT match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr; //need to keep the tasks array variable up-to-date at all times
  saveTasks();

};

// (4) 
// Even Handler for Edit, Delect button 
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

// (5) 
// Event Handler for the Task Status Dropdown (To Do | In progress | Complete )
var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  // helps future-proof the app in case we ever changed how the status text is displayed
  var statusValue = event.target.value.toLowerCase(); // to do, in progress, completed

  // find the parent task item element based on the id - it's actually a li item within the ul
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  console.log(taskSelected);

  // do something about taskSelected ---------------------------------------------------
  // appendChild() didn't create a copy of the task. It actually moved 
  // the task item from its original location in the DOM into the other <ul>.
  if (statusValue === STATUS_TODO.toLocaleLowerCase()) {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === STATUS_INPROGRESS.toLocaleLowerCase()) {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === STATUS_COMPLETED.toLocaleLowerCase()) {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  saveTasks();
  

};

var saveTasks = function() {
  //localStorage.setItem() saves data to localStorage.
  localStorage.setItem("mytasks", JSON.stringify(tasks)); // converted the tasks array into a string
}

var loadTasks = function() {
  var savedTasks = localStorage.getItem("mytasks");
  if (!savedTasks) {
    return false;
  }

  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array of object
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
}

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler); // most complicated

formEl.addEventListener("submit", taskFormHandler);

loadTasks();