$(document).ready(function () {
    $('#addToDoButton').on('click', addTask)
    $('#viewMyTasksButton').on('click', viewMyTasks)
    $('#viewHighPriorityOnlyButton').on('click', showHighPriorityTasks)
    //$('#prioritizeButton').on('click', prioritizeTasks())
    //$('#viewMyCompletedTasksButton').on('click', printCompletedTasks)
});


//TO-DO LIST OBJECT & ARRAY HOLDING TO-DO LIST ITEM CREATION
function task(task, category, priority) { this.task = task, this.category = category, this.priority = priority }
let toDoArray = []


//FUNCTION ADDING ITEMS TO TO-DO LIST
async function addTask() {
    try {
        //GRABBING INFO FROM URGENCY SELECTOR RADIO BUTTONS
        let radioID = await radioCheck(), todo = await inputCheck() //Verifying Button-Press/Text-Input
        let categoryID = document.getElementById("category").value
        let category
        let priority
        let notes = ' '

        //TO-DO LIST ITEM CREATION & ARRAY PUSH
        radioID === 'radioVeryHigh' ? (priority = 1) :
            radioID === 'radioHigh' ? (priority = 2) :
                radioID === 'radioMedium' ? (priority = 3) :
                    (priority = 4)

        categoryID === 'work' ? (category = 1) :
            categoryID === 'school' ? (category = 2) :
                categoryID === 'home' ? (category = 3) :
                    (category = 4)

        toDoArray.push(new task(todo, category, priority, notes))
        console.log(toDoArray
        )
        //RADIO, CATEGORY DROP DOWN & TEXT BOX RESET
        $(`#${radioID}`).attr('checked', false)
        $("#toDoInput").val('')

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
        input = ($('#toDoInput').val()).trim()
        input ? resolve(input) : reject("Please enter a valid task!") //Verifying input isn't just whitespace
    })
}



//LIST TASKS IN PROGRESS
//SHOW TO-DO LIST BUTTON CLICKED
function viewMyTasks() {
    $("#incompleteTaskDisplay").html("") //Resetting Current Listed Tasks
    let toDoArray = sortArray() //Sorting array from highest to low priority 

    for (let i = 0; i < toDoArray.length; i++) {
        //Verifying task is incomplete before printing
        if (toDoArray[i].priority !== 5) printUncompletedTasks(toDoArray[i].task, i, toDoArray[i].priority)//Text, Index, Priority
    }
}




//VIEW HIGH PRIORITY TASKS ONLY
function showHighPriorityTasks() {
    $("#incompleteTaskDisplay").html("") //Resetting Current Listed Tasks
    let toDoArray = sortArray()  //Sorting array from highest to low priority 

    for (let i = 0; i < toDoArray.length; i++) {
        if (toDoArray[i].priority === 1 || toDoArray[i].priority === 2) {

            let elementText = toDoArray[i].task + " -- " + (toDoArray[i].priority === 1 ? 'Very high' : 'High') + " priority"
            printUncompletedTasks(elementText, i, toDoArray[i].priority)//Text, Index, Priority

        }
    }
}