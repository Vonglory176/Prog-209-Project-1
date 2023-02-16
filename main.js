$(document).ready(function () {
    $('#addToDoButton').on('click', addTask)
    //$('#showMeAllToDosButton').on('click', viewMyTasks)
    // $('#viewHighPriorityOnlyButton').on('click', showHighPriorityTasks)
    //$('#prioritizeButton').on('click', prioritizeTasks())
    //$('#viewMyCompletedTasksButton').on('click', printCompletedTasks)
});

//DAY ARRAY & TO-DO LIST OBJECT CREATION
let dayArray = [] //subArrays created in calendar section
function task(task, category, priority) {
    this.task = task,
        this.category = category,
        this.priority = priority
    this.notes = ''
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
            radioID = radioCheck()

        let radio
        if (radioID === 'radioVeryHigh') radio = 1
        else if (radioID === 'radioHigh') radio = 2
        else if (radioID === 'radioMedium') radio = 3
        else    /*radioID === 'radioLow' */   radio = 4

        //Days[TasksForSpecifiedDay]
        dayArray[selectedDay].push(new task(toDo, category, radio))
        console.log(dayArray)

        //RADIO, CATEGORY DROP DOWN & TEXT BOX RESET
        $(`#${radioID}`).attr('checked', false)
        $('#category').val('default')
        $('#category').selectmenu('refresh')
        $("#toDoInput").val('')
        calenderResetSelection()

    } catch (error) { alert(error) }
}

//VALIDATION FUNCTIONS --------------------------------------------------------------
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
    throw new Error("Error: Please enter a valid task!")
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
    let toDoArray = dayArray[selectedDay]

    if (!toDoArray.length > 0) $("#toDoDisplay").append(`There are no tasks to display for day ${selectedDay + 1}`)
    else for (let i = 0; i < toDoArray.length; i++) { printTasks(toDoArray[i].task, i, toDoArray[i].priority) } //Text, Index, Priority
}


//VIEW ALL TASKS -- THIS WILL POPULATE THE DISPLAY WHEN USER NAVIGATES TO VIEW MY TODO
function viewAllTasks() {
    //let toDoArray = sortArray() //Sorting array from highest to low priority
    let entireToDoList = document.getElementById("toDoDisplay")
    entireToDoList.innerHTML = " "

    let allTasksArray = []

    for (let i = 0; i < dayArray.length; i++) {

        if (dayArray[i].length > 0) {
            allTasksArray = dayArray[i]
            allTasksArray.forEach(function (element) {
                var list = document.createElement('li');
                list.innerHTML = element.task;
            })
        }
    }
    console.log(toDoArray)
}



// if (!toDoArray.length > 0) $("#toDoDisplay").append(`There are no tasks to display `)
// else for (let i = 0; i < toDoArray.length; i++) { printTasks(toDoArray[i].task, i, //toDoArray[i].priority) } //Text, Index, Priority



//Task Printer
function printTasks(text, index, priority) {
    //Radio Button
    let elementRadio = $(`<input type='radio'>`)//Setting HTML
    $(elementRadio).attr('id', `taskRadio${index}`)//Setting ID

    $(elementRadio).on('click', function () {//Attaching Event Handler
        dayArray[selectedDay][index].priority = 5
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

//CALENDAR CODE
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
        dayArray.push(new Array)

        if (getDay(d) % 7 == 6) table += '</tr><tr>' // Sunday, last day of week - newline

        d.setDate(d.getDate() + 1);
    }
    console.log(dayArray)

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
let selectedDay
$('.calendar .calendarDays').click(function () {
    calenderResetSelection()

    selectedDay = parseInt(this.id) - 1
    $(this).css('background-color', 'aqua')

    try { viewMyTasksByDay() } catch { }
})

//Calender Reset
function calenderResetSelection() {
    $('.calendarDays').css('background-color', 'white') //Add event click for page change
    $("#toDoDisplay").html("")
}

