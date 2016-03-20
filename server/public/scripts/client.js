$(document).ready(function(){
    // on page load, set listeners and display tasks from DB
    setListeners()
    displayTasks()
});

function setListeners(){
    // prevent submit on submit click, set listeners for complete and delete buttons
    $('#frmTask').on('submit',function(event){
        event.preventDefault();
        saveTask();
    });
    $('.tasks-incomplete').on('click','.toggle-complete', toggleComplete);
    $('.tasks-incomplete').on('click','.delete-task', deleteTask);

    $('.tasks-complete').on('click','.toggle-complete', toggleComplete);
    $('.tasks-complete').on('click','.delete-task', deleteTask);

}
function toggleComplete(){
    // change complete to incomplete and vice versa on button click
    event.preventDefault();
        var taskID = $(this).data('taskid');
        var newStatus = $(this).data('newstatus');
        values = {'taskID': taskID, 'newStatus': newStatus};
        // do a put here
        $.ajax({
          type: 'PUT',
          url: '/tasks',
          data: values,
          success: function(response){
            console.log(response);
            displayTasks();
          }
        });
}

function deleteTask(){
    // pop up a confirmation box to verify delete. If confirmed, actually delete
    event.preventDefault();
    var taskID = $(this).data('taskid');
    var check_delete = confirm("You are about to delete this task. Are you sure?");
    if (check_delete == true) {
        nukeTask(taskID);
    } else {
        alert("Deletion Cancelled.");
    }
}
function nukeTask(taskID){
    // remove record from db with given ID
    var values = {'taskID': taskID};
    // do a delete here
    $.ajax({
      type: 'DELETE',
      url: '/tasks',
      data: values,
      success: function(response){
        displayTasks();
      }
    });
}
function displayTasks(){
    // get all tasks from database and put in array.
    // loop through array and display.
    $.ajax({
      type: 'GET',
      url: '/tasks',
      success: function(response){
        // append tasks to the dom
        appendTasks(response);
      }
    });
}
function myFormatDate(dateString){
    // get a given date string, if it's not empty, convert it to something sensible
    var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    if (dateString != null){
        var result;
        var myDate = new Date(dateString);
        result =  (myDate.getDate()+1) +  arrMonths[myDate.getMonth()] + myDate.getFullYear();
    } else {
        result = '';
    }
    return result;
}
function appendTasks(response){
    // empty task containers on dom. got through response and load into array
    // loop through array and append each to complete or incomplete containers
    $('.tasks-complete').empty();
    $('.tasks-incomplete').empty();
    var taskArray = [];
    var taskRow;
    var $el;
    var taskClass;
    var taskStatus;
    var taskDue;
    response.forEach(function(task){
        taskArray.push(task);
    });
    for (var i=0;i<taskArray.length;i++){
        taskRow = taskArray[i];
        taskDue = myFormatDate(taskRow.fld_task_due);

        if (taskRow.fld_task_status=='incomplete'){
            //append to incomplete
            $('.tasks-incomplete').append('<div class = "task-undone task-block"></div>');
            $el=$('.tasks-incomplete').children().last();
            $el.append('<p>Description:' + taskRow.fld_task_desc + '</p>');
            $el.append('<p>Due Date:' + taskDue + '</p>');
            $el.append('<p>Priority:' + taskRow.fld_priority_label + '</p>');
            $el.append('<p>Status:' + taskRow.fld_task_status + '</p>');
            $el.append('<button data-taskID = "' + taskRow.fld_task_id + '" data-newStatus ="complete" class="toggle-complete">Complete</button>');
        } else {
            //append to complete
            $('.tasks-complete').append('<div class = "task-done task-block"></div>');
            $el=$('.tasks-complete').children().last();
            $el.append('<p>Description:' + taskRow.fld_task_desc + '</p>');
            $el.append('<p>Due Date:' + taskDue + '</p>');
            $el.append('<p>Priority:' + taskRow.fld_priority_label + '</p>');
            $el.append('<p>Status:' + taskRow.fld_task_status + '</p>');
            $el.append('<button data-taskID = "' + taskRow.fld_task_id + '" data-newStatus ="incomplete" class="toggle-complete">Incomplete</button>');
        }
        $el.append('<button data-taskID = "' + taskRow.fld_task_id + '"  class="delete-task">Delete</button>');
    }
}
function saveTask(event){
    // object to hold form values
    var values = {};
    // grab all the form values
    $.each($('#frmTask').serializeArray(), function(i,field){
        values[field.name]=field.value;
        console.log(field.name, field.value);
    });
    // check if a descript was entered and save if yes
    if (values.fld_task_desc.length>0){
        //post call
        $.ajax({
          type: 'POST',
          url: '/tasks',
          data: values,
          success: function(response){
            displayTasks();
          }
        });
    } else{
        // console.log("I so did not save. now what?");
    }
    $('#frmTask').find('input[type=text]').val('');
    $('#frmTask').find('input[type=date]').val('');
    $("#fld_task_priority").val('0');
}
