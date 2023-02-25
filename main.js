// DOM CONTENT LOADED CODE START -----------------------------------------------------------------------
$(document).ready(function () {
    //AddToDos Page
    $('#addToDoButton').on('click', addTask)

    //ViewToDos Page
    $('#showMeAllToDosButton').on('click', viewAllTasks)
    $('#showMeHighPriorityOnlyButton').on('click', sortArray)
    $('#showMeCompletedToDosButton').on('click', viewCompletedTasks)

    //ViewToDoDetails Page
    $('#completeTaskButton').on('click', completeTask)
    $('#editTaskButton').on('click', editTask)
    $('#deleteTaskButton').on('click', deleteTask)

    //PAGE BEFORE SHOW CODE START ----------------------------------------------------------------------
    $("#viewMyToDosPage").on("pagebeforeshow", function () {
        //sortArray() -- FOR USE WITH DAY/HEADER SEPARATION
        viewAllTasks()
        console.log(toDoArray)
    })

    $("#viewToDoDetailsPage").on("pagebeforeshow", function () {
        $("#details").html('')
        let task = toDoArray[findIndex()]
        if (task) {
            // $("#details").append(`Task Name: ${task.task}                         <br>`)
            // $("#details").append(`Category:  ${categoryTranslator(task.category)} <br>`)
            // $("#details").append(`Priority:  ${priorityTranslator(task.priority)} <br>`)
            // $("#details").append(`Day:       ${task.day}                          <br>`)
            // $("#details").append(`Task Description: ${task.description}           <br>`)

            $("#detailsTaskName").val(task.task)
            //Add Category and Priority!!
            $("#detailsDescription").val(task.description)


        }
        //else $("#details").html("Error: No Task selected for viewing!") //Prevents error on refresh
    })
    //PAGE BEFORE SHOW CODE END ------------------------------------------------------------------------
});
//DOM CONTENT LOADED CODE END --------------------------------------------------------------------------

//VARIABLE LIBRARY
let toDoArray = []
let selectedDay
let selectedID
let selectedPrintDay

function task(day, task, category, priority) {
    this.day = day
    this.task = task
    this.category = category
    this.priority = priority
    this.description = ''
    this.complete = false
    this.id = Date.now()  //"Milliseconds elapsed since midnight, January 1, 1970"
}

//'#addAToDo' PAGE FUNCTIONS START ---------------------------------------------------------------------
//'#addToDoButton' Clicked
function addTask() {
    try {
        //TaskArray
        toDoArray.push(new task(calendarCheck(), inputCheck(), categoryCheck(), radioCheck()))
        console.log(toDoArray)

        //Input Resets
        $(`input[name="priorityRadio"]`).attr('checked', false)
        $('#category').val('default')
        $('#category').selectmenu('refresh')
        $("#toDoInput").val('')
        calenderResetSelection()

    } catch (error) { alert(error) }
}

//Validation Functions
function radioCheck() {
    //radios = document.querySelectorAll('input[name="priorityRadio"]')
    radios = $('input[name="priorityRadio"]')
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) { 
            if      (radios[i].id === 'radioVeryHigh') return 1
            else if (radios[i].id === 'radioHigh')     return 2
            else if (radios[i].id === 'radioMedium')   return 3
            else   /*radios[i].id === 'radioLow' */    return 4
        }
    }
    throw new Error("Please select an priority level!")
}

function inputCheck() {
    input = ($('#toDoInput').val()).trim() //Verifying input isn't just whitespace
    if (input) return input
    throw new Error("Please enter a valid task!")
}

function categoryCheck() {
    if (parseInt($('#category').val()) === 0) return 4 //"None"
    return parseInt($('#category').val())
}

function calendarCheck() {
    if (selectedDay) return selectedDay
    throw new Error("Please select a date for your task!")
}
//'#addAToDo' PAGE FUNCTIONS END -----------------------------------------------------------------------

//'#viewMyToDos' PAGE FUNCTIONS START ------------------------------------------------------------------
//'#showMeAllToDosButton' Clicked.. (Or '#viewMyToDos' Page Loaded)
function viewAllTasks() {
    //Display Reset
    $("#toDoDisplay").html('')
    calenderResetSelection()

    //Verifying that toDoArray contains a task and if so, sending each task to be printed
    if (toDoArray.length === 0) $("#toDoDisplay").append(`There are no tasks to display.`)
    else for (let i = 0; i < toDoArray.length; i++) printTasks(toDoArray[i].task, i, toDoArray[i].priority, toDoArray[i].complete)
}

/*
//VIEW HIGH PRIORITY TASKS ONLY
function showHighPriorityTasks() {
    let theList = document.getElementById("toDoDisplay");
    theList.innerHTML = " ";
    allTasksArray.forEach(function (element) {
        if (element.priority == 1 || 2) {
            var list = document.createElement('li');
            list.innerHTML = element.task
            theList.appendChild(list);
            $(elementLabel).css('color', `${colorPicker(priority)}`)//Setting Color

        }
    })
}*/

//'#showMeCompletedToDosButton' Clicked
function viewCompletedTasks () {
    $("#toDoDisplay").html('') //Display Reset
    
    let found = false
    for (let i=0;i<toDoArray.length;i++) {
        //If Calendar-Day selected, only print for selected day
        if (selectedDay === toDoArray[i].day && toDoArray[i].complete) {
            printTasks(toDoArray[i].task, i, toDoArray[i].priority, toDoArray[i].complete)
            found = true
        }

        //If Calendar-Day not selected, print for all days
        else if (!selectedDay && toDoArray[i].complete) {
            printTasks(toDoArray[i].task, i, toDoArray[i].priority, toDoArray[i].complete)
            found = true
        }
    }
    if (!found) $("#toDoDisplay").append("There are no completed tasks to display", selectedDay?` for day ${selectedDay}.`:'.')
}

//Calendar-Day Clicked
function viewMyTasksByDay() {
    let found = false
    for (let i = 0; i < toDoArray.length; i++) {
        if (selectedDay === toDoArray[i].day) {
            printTasks(toDoArray[i].task, i, toDoArray[i].priority, toDoArray[i].complete)
            found = true
        }
    }
    if (!found) $("#toDoDisplay").append(`There are no tasks to display for day ${selectedDay}.`)
}

//Task Printer
function printTasks(text, index, priority, complete) {
    if (selectedPrintDay !== toDoArray[index].day) {
        selectedPrintDay = toDoArray[index].day
        $("#toDoDisplay").append(`<h3> Tasks for Day ${selectedPrintDay} </h3>`)
    }

    if (index+1 === toDoArray.length) selectedPrintDay = 0

    //Checkbox Creation
    let elementCheckbox = $(`<input id='taskCheckbox${index}' type='checkbox'>`)//Setting HTML & ID
    if (complete) $(elementCheckbox).prop( "checked", true )//Checking Checkbox (If Applicable)

    //Label Creation
    let elementLabel = $(`<label id='taskLabel${index}'>${text}</label>`)//Setting HTML, Text & ID
    $(elementLabel).css('color', colorPicker(complete ? 'complete' : priority))//Setting Color

    //Printing to Screen
    $("#toDoDisplay").append("•&emsp;", $(elementLabel), $(elementCheckbox), " -- Task Completed? <br>")

    //Checkbox Click Event-Handler
    $(elementCheckbox).on('click', function () {

        if (toDoArray[index].complete === false) { //..Checking if initially false
            toDoArray[index].complete = true
            $(`#taskLabel${index}`).css('color', colorPicker('complete'))
        }

        else if (toDoArray[index].complete === true){ //..Unchecking if initially true
            toDoArray[index].complete = false
            $(`#taskLabel${index}`).css('color', colorPicker(toDoArray[index].priority))
        }     
    })

    //Label Click Event-Handler
    $(`#taskLabel${index}`).on("click", function () {
        selectedID = toDoArray[index].id
        window.location.href = "#viewToDoDetailsPage"
    })
}

//Array Sorter
function sortArray(){
    toDoArray = toDoArray.sort((p1, p2) => (p1.priority > p2.priority) ? 1 : (p1.priority < p2.priority) ? -1 : 0) //Sorting by Priority
    toDoArray = toDoArray.sort((p1, p2) => (p1.day > p2.day) ? 1 : (p1.day < p2.day) ? -1 : 0) //Sorting by Day
}
//'#viewMyToDos' PAGE FUNCTIONS END --------------------------------------------------------------------

//'#viewToDoDetails' PAGE FUNCTIONS START --------------------------------------------------------------
//'#editTaskButton' Clicked
function editTask () {}

//'#completeTaskButton' Clicked
function completeTask () {}

//'#deleteButton' Clicked
function deleteTask() { toDoArray.splice(findIndex(), 1) }
//'#viewToDoDetails' PAGE FUNCTIONS END ----------------------------------------------------------------

//GENERAL FUNCTIONS START ------------------------------------------------------------------------------
function colorPicker(priority) {
    if (priority === 1) return 'rgb(212, 2, 2)'
    else if (priority === 2) return 'rgb(255, 68, 0)'
    else if (priority === 3) return 'rgb(239, 168, 3)'
    else if (priority === 4) return 'green'
    else return 'darkgreen' //For Complete
}

function categoryTranslator(category) {
    if      (category === 1) return 'Work'
    else if (category === 2) return 'School'
    else if (category === 3) return 'Home'
    else if (category === 4) return 'None' //Make this default?
}

function priorityTranslator(priority) {
    if      (priority === 1) return 'Very High'
    else if (priority === 2) return 'High'
    else if (priority === 3) return 'Medium'
    else if (priority === 4) return 'Low'
}

function findIndex () { for (let i = 0;i<toDoArray.length;i++) if (toDoArray[i].id === selectedID) return i }
//GENERAL FUNCTIONS END --------------------------------------------------------------------------------

//CALENDAR CODE START ----------------------------------------------------------------------------------
//CALENDAR GENERATION START ----------------------------------------------------------------------------
let d = new Date();
function createCalendar(month) {

    //Table Header
    let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';
    d.setDate(1)

    // First row from Monday till the first day of the month // * * * 1  2  3  4
    for (let i = 0; i < getDay(d); i++) table += '<td></td>';

    // <td> with actual dates
    while (d.getMonth() == month) {
        let date = d.getDate()
        table += `<td class='calendarDays' id='${date}day'>` + date + '</td>'
        //toDoArray.push(new Array)

        if (getDay(d) % 7 == 6) table += '</tr><tr>' // Sunday, last day of week - newline

        d.setDate(d.getDate() + 1);
    }

    // Add spaces after last days of month for the last row // 29 30 31 * * * *
    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) table += '<td></td>'
    }

    // Close & Print the Table
    table += '</tr></table>'
    $('.calendar').append(table)
}

function getDay(date) { // Get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay()
    if (day == 0) day = 7 // Make Sunday (0) the last day
    return day - 1
}
createCalendar(d.getMonth())
//CALENDAR GENERATION END ------------------------------------------------------------------------------

//Calender Select
$('.calendar .calendarDays').click(function () {
    calenderResetSelection()

    selectedDay = parseInt(this.id)
    $(this).css('background-color', 'aqua')
    console.log(selectedDay)

    if (window.location.hash === '#viewMyToDos') viewMyTasksByDay() //Only calling if on '#viewMyToDos' page
    //try { viewMyTasksByDay() } catch { }
})

//Calender Reset
function calenderResetSelection() {
    selectedDay = 0
    $('.calendarDays').css('background-color', 'white')
    if (window.location.hash === '#viewMyToDos') $("#toDoDisplay").html("") //Only calling if on '#viewMyToDos' page
}
//CALENDAR CODE END ------------------------------------------------------------------------------------
