$(document).ready(function () {
    $('#addToDoButton').on('click', addTask)
    //$('#showMeAllToDosButton').on('click', viewMyTasks)
    //$('#viewHighPriorityOnlyButton').on('click', showHighPriorityTasks)
    //$('#prioritizeButton').on('click', prioritizeTasks())
    //$('#viewMyCompletedTasksButton').on('click', printCompletedTasks)
});

//DAY ARRAY & TO-DO LIST OBJECT CREATION
let dayArray = [] //subArrays created in calendar section
function task(task, category, priority) {
    this.task = task,
        this.category = category,
        this.priority = priority
    //this.notes=''
}

//Need day selection reset caller for toDo/addToDo page changes
//Need day selection verification for addToDo
//Need category selection verification or default value of 'None' for addToDo 

//Convert Highest Priority and Completed Tasks code
//Convert Array Sorter code

//FUNCTION ADDING ITEMS TO TO-DO LIST
async function addTask() {
    try {

        //CHECKING TO MAKE SURE DATE IS SELECTED
        if (calendarCheck()) {
            //GRABBING INFO FROM URGENCY SELECTOR RADIO BUTTONS 
            let radioID = await radioCheck(), todo = await inputCheck() //Verifying Button-Press/Text-Input
            let categoryID = await categoryCheck()
            console.log(selectedDay)
            let category, priority

            //TO-DO LIST ITEM CREATION & ARRAY PUSH
            if (radioID === 'radioVeryHigh') priority = 1
            else if (radioID === 'radioHigh') priority = 2
            else if (radioID === 'radioMedium') priority = 3
            else    /*radioID === 'radioLow' */   priority = 4

            //Days[TasksForSpecifiedDay]
            dayArray[selectedDay].push(new task(todo, category, priority))
            console.log(dayArray)


            //RADIO, CATEGORY DROP DOWN & TEXT BOX RESET
            $(`#${radioID}`).attr('checked', false)
            $('#category').val('default')
            $('#category').selectmenu('refresh')
            $("#toDoInput").val('')
        }
    } catch (error) { alert(error) }

}

//VALIDATION FUNCTIONS
//RADIO BUTTON CHECK
function radioCheck() {
    return new Promise((resolve, reject) => {
        document.querySelectorAll('input[name="priorityRadio"]').forEach(i => { //Iterating all input elements with name 'urgencySelector'
            if (i.checked) resolve(i.id) //Returns ID of checked
        })
        reject("Please select an priority level!")
    })
}

//TEXT INPUT CHECK
function inputCheck() {
    return new Promise((resolve, reject) => {
        input = ($('#toDoInput').val()).trim() //Verifying input isn't just whitespace
        if (input) resolve(input)
        else reject("Please enter a valid task!")
    })
}

//CATEGORY SELECTION CHECK
function categoryCheck() {
    let categoryID = document.getElementById("category").value
    if (categoryID === 'select') {
        alert("Please select a category!");
    }
    else {
        return categoryID;
    }
}

//CALENDAR SELECTION CHECK
function calendarCheck() {
    if (selectedDay === undefined) {
        alert("Please select a date for your task!");
        console.log("calendar check failed")
        return false;
    } else console.log("calendar check success")
    return true;
}


//CATEGORY INPUT CHECK
// function nonPromise() {
//     input = ($('#toDoInput').val()).trim() //Verifying input isn't just whitespace
//     if (input) return input
//     else throw new Error ("Please enter a valid task!")
// }


//LIST TASKS IN PROGRESS
//VIEW HIGH PRIORITY TASKS ONLY
// function showHighPriorityTasks() {
//     //$("#incompleteTaskDisplay").html("") //Resetting Current Listed Tasks
//     let toDoArray = sortArray()  //Sorting array from highest to low priority 

//     for (let i = 0; i < toDoArray.length; i++) {
//         if (toDoArray[i].priority === 1 || toDoArray[i].priority === 2) {

//             let elementText = toDoArray[i].task + " -- " + (toDoArray[i].priority === 1 ? 'Very high' : 'High') + " priority"
//             printUncompletedTasks(elementText, i, toDoArray[i].priority)//Text, Index, Priority

//         }
//     }
// }

//CALENDAR DAY CLICKED
function viewMyTasks() {
    //let toDoArray = sortArray() //Sorting array from highest to low priority
    let toDoArray = dayArray[selectedDay]

    if (!toDoArray.length > 0) $("#toDoDisplay").append(`There are no tasks to display for day ${selectedDay + 1}`)
    else for (let i = 0; i < toDoArray.length; i++) { printTasks(toDoArray[i].task, i, toDoArray[i].priority) } //Text, Index, Priority
}

// //VIEW COMPLETED TASKS BUTTON CLICK
// function printCompletedTasks() {
//     for (let i = 0; i < toDoArray.length; i++){
//         if (toDoArray[i].priority === 5) {
//             let element = $(`<li>${toDoArray[i].task} -- Completed!</li>`)//Setting HTML
//             $(element).css('color',`${colorPicker(toDoArray[i].priority)}`)//Setting Color
//             $("#completedTaskDisplay").append($(element))//Printing to Screen
//         }
//     }
// }

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

    try { viewMyTasks() } catch { }
})

//Calender Reset
function calenderResetSelection() {
    $('.calendarDays').css('background-color', 'white') //Add event click for page change
    $("#toDoDisplay").html("")
} 