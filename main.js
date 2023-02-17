// DOM CONTENT LOADED CODE ---------------------------------------------------------------------
$(document).ready(function () {
    $('#addToDoButton').on('click', addTask)
    $('#showMeAllToDosButton').on('click', viewAllTasks)
    // $('markAsCompleteButton').on('click', )
    // $('editButton').on('click', )
    // $('deleteButton').on('click', )
    //$('#showMeAllToDosButton').on('click', viewAllTasks)


    //PAGE BEFORE SHOW CODE -----------------------------------------------
    //Not working at the moment yikes

    //VIEW MY TODOS
    // $("document").on("pagebeforeshow", "viewMyToDos", function (event) {
    //     //viewAllTasks()

    // })


   //VIEW DETAILS PAGE
//    $(document).on("pagebeforeshow", "#viewToDoDetails", function (event) {
//        let localParm = localStorage.getItem('parm');
//        let localID = GetArrayPointer(localParm);

//        allTasksArray = JSON.parse(localStorage.getItem('allTasksArray'));

//        document.getElementById("detailsName").innerHTML = "TO-DO Item: " + allTasksArray[localID].task;
//        document.getElementById("detailsCategory").innerHTML = "Category: " + allTasksArray[localID].categoryName;
//        document.getElementById("detailsPriority").innerHTML = "Priority Level: " + allTasksArray[localID].priorityName;
//        document.getElementById("detailsDescription").innerHTML = "Description: " + allTasksArray[localID].description;
//    })



    //END Of PAGE BEFORE SHOW CODE -----------------------------


});
//END Of DOM CONTENT LOADED CODE ---------------------------------------------------------------------



//CREATION OF TASK OBJECT AND ARRAYS -----------------------------------------------------------------------
//ALL TASK ARRAY, DAY ARRAY & TO-DO LIST OBJECT CREATION
let allTasksArray = [] //array that holds all tasks for printing entire task list without day and without having to navigate subArrays
let toDoArray = [] //subArrays created in calendar section
let selectedDay

function task(task, category, priority, day) {
    this.task = task
    this.category = category
    this.priority = priority
    this.day = day
    this.description = ''
    this.id = Math.random().toString(16).slice(5)
}

//Need day selection reset caller for toDo/addToDo page changes
//Convert Highest Priority and Completed Tasks code
//Convert Array Sorter code

//FUNCTION ADDING ITEMS TO TO-DO LIST
function addTask() {
    try {
        calendarCheck()
        let toDo = inputCheck(),
            category = categoryCheck(),
            radioID = radioCheck(),
            priority

        if (radioID === 'radioVeryHigh') priority = 1//, priorityName = 'Very High Priority'
        else if (radioID === 'radioHigh') priority = 2//, priorityName = 'High Priority'
        else if (radioID === 'radioMedium') priority = 3//, priorityName = 'Medium Priority'
        else    /*radioID === 'radioLow' */   priority = 4//, priorityName = 'Low Priority'

        //DAYS [TasksForSpecifiedDay]
        toDoArray.push(new task(toDo, category, priority, selectedDay))
        //All TASKS ARRAY 
        //allTasksArray.push(new task(toDo, category, categoryName, radio, priorityName))
        console.log(toDoArray)

        //RADIO, CATEGORY DROP DOWN & TEXT BOX RESET
        $(`#${radioID}`).attr('checked', false)
        $('#category').val('default')
        $('#category').selectmenu('refresh')
        $("#toDoInput").val('')
        calenderResetSelection()

    } catch (error) { alert(error) }
} //end function AddTask

//END OF CREATION OF TASK OBJECT AND ARRAYS -----------------------------------------------------------------------



//VALIDATION FUNCTIONS ----------------------------------------------------------------------


//RADIO BUTTON CHECK
function radioCheck() {
    radios = document.querySelectorAll('input[name="priorityRadio"]')
    for (let i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].id
    throw new Error("Please select an priority level!")
}

//TEXT INPUT CHECK
function inputCheck() {
    input = ($('#toDoInput').val()).trim() //Verifying input isn't just whitespace
    if (input) return input
    throw new Error("Please enter a valid task!")
}

//CATEGORY SELECTION CHECK
function categoryCheck() {
    if ($('#category').val() === "0") throw new Error("Please select a category!")
    return $('#category').val()
}

//CALENDAR SELECTION CHECK
function calendarCheck() {
    if (selectedDay) return
    throw new Error("Please select a date for your task!")
}


//VALIDATION FUNCTIONS END --------------------------------------------------------------


//CALENDAR DAY CLICKED , VIEW TASKS BY DAY
function viewMyTasksByDay() {
    //let toDoArray = sortArray() //Sorting array from highest to low priority
    let found = false

    for (let i=0; i<toDoArray.length;i++){
        if (selectedDay === i.day) {
            printTasks(toDoArray.task, i, toDoArray.priority)
            found = true
        }
    }
    if (!found) $("#toDoDisplay").append(`There are no tasks to display for day ${selectedDay}`)
}


//VIEW ALL TASKS --  POPULATE THE DISPLAY WHEN USER NAVIGATES TO VIEW MY TODO
//Can you please not re-vamp my function too much - otherwise I get lost in how all the JS is working and then cannot really do much
//Initially wrote this to use for pagebeforeshow when user clicks the view to do page it would populate all the tasks, couldn't figure that out so made it into a button for now
function viewAllTasks() {
    //clear the display
    let theList = document.getElementById("toDoDisplay");
    theList.innerHTML = " ";

    if (toDoArray.length === 0) $("#toDoDisplay").append(`There are no TO-DOs to display`)
    else {
        //toDoArray.forEach(function (i) 
        for (let i=0;i<toDoArray.length;i++){
            console.log(toDoArray[i].task)
            printTasks(toDoArray[i].task, i, toDoArray[i].priority)

            // let list = document.createElement('li');
            // list.setAttribute("data-parm", element.id);
            // list.innerHTML = element.task + " " + element.category + " " + element.priority;
            // $("#toDoDisplay").append(list);
            // console.log(element)
        }
    }
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

/*
//ITERATING THROUGH ARRAY TO FIND ARRRAY ELEMENT W MATCHING ID
function GetArrayPointer(localID) {
    for (let i = 0; i < allTasksArray.length; i++) {
        if (localId === allTasksArray[i].ID) {
            return i;
        }
    }
}*/

/*
//DELETE ITEM 
function Delete(itemToDelete) {
    let arrayPointer = GetArrayPointer(itemToDelete);
    allTasksArray.splice(arrayPointer, 1);
}*/

//Task Printer
function printTasks(text, index, priority) {
    //Radio Button
    let elementRadio = $(`<input type='radio'>`)//Setting HTML
    $(elementRadio).attr('id', `taskRadio${index}`)//Setting ID

    $(elementRadio).on('click', function () {//Attaching Event Handler
        toDoArray[index].priority = 5
        $(`#taskLabel${index}`).css('color', colorPicker(5))
    })

    //Affiliated Label
    let elementLabel = $(`<label>${text}</label>`)//Setting HTML & Text
    $(elementLabel).attr('for', `taskRadio${index}`)//Linking to Radio Button
    $(elementLabel).attr('id', `taskLabel${index}`)//Setting ID
    $(elementLabel).css('color', colorPicker(priority))//Setting Color

    $("#toDoDisplay").append("•&emsp;", $(elementLabel), $(elementRadio), " -- Task Completed? <br>")//Printing to Screen
}

//Array Sorter
//function sortArray(){return toDoArray.sort((p1, p2) => (p1.priority > p2.priority) ? 1 : (p1.priority < p2.priority) ? -1 : 0)}

//Color Code Based on Priority System
function colorPicker(priority) {
    if (priority === 1) return 'rgb(212, 2, 2)'
    else if (priority === 2) return 'rgb(255, 68, 0)'
    else if (priority === 3) return 'rgb(239, 168, 3)'
    else if (priority === 4) return 'green'
    else if (priority === 5) return 'darkgreen' //For Complete
}

function categoryPicker(category) {
    if (category === 1) return 'Work'
    else if (category === 2) return 'School'
    else if (category === 3) return 'Home'
    else if (category === 4) return 'None'
}


//CALENDAR CODE -----------------------------------------------------------
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
    console.log(toDoArray)

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

//Calender Select
$('.calendar .calendarDays').click(function () {
    calenderResetSelection()

    selectedDay = parseInt(this.id)
    $(this).css('background-color', 'aqua')
    console.log(selectedDay)

    try { viewMyTasksByDay() } catch { }
})

//Calender Reset
function calenderResetSelection() {
    selectedDay = 0
    $('.calendarDays').css('background-color', 'white') //Add event click for page change
    $("#toDoDisplay").html("")
}
//END OF CALENDAR CODE -------------------------------------------------------------------
