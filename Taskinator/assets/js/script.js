
var formEl = document.querySelector("#task-form");

// unorderred list obj waiting for listItemEl has a div child item call taskInfoEl
var tasksToDoEl = document.querySelector("#tasks-to-do"); 

// Dynamically get the value of the input 
// var taskNameInput = document.querySelector("input[name='task-name']").value;
//var taskNameInputVice = document.getElementById("input[name='tast-name']");
//console.log(taskNameInput);

var createTaskHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";

  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
  listItemEl.appendChild(taskInfoEl); // add div element to li element, div element is consider a child of li in this case

  //listItemEl.textContent = taskNameInput; //"This is a new task.";
  tasksToDoEl.appendChild(listItemEl); //ul adds li
};

formEl.addEventListener("submit", createTaskHandler);

//buttonEl.addEventListener("click", createTaskHandler);
