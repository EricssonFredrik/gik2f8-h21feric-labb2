todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));



todoForm.addEventListener('submit', onSubmit);
const todoListElement = document.getElementById('todoList');
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;


const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };
  

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}


function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
  tasks.sort(function (a, b) {
    return new Date(a.dueDate) < new Date(b.dueDate) ? 1 : -1;
  });
  tasks.sort(function (a, b) {
    return a.completed > b.completed ? 1 : -1;
  });
  tasks.forEach((task) => {
    todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
  });
}
});
}


function renderTask({ id, title, description, dueDate, completed }) {
  const checkCompleted =  completed == true ? "checked" : "";
  const bgColor = completed == true ? "bg-gray-100 rounded" : "";

  let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-300 ${bgColor}">
      <div class="flex items-center" id=${id}>
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded ml-2">Ta bort</button>
          <br>
          <input onclick="finishedTask(${id})" type="checkbox" id="completeBox" name="completeBox"${checkCompleted}>
          <label for="completedBox">Klar</label><br>
        </div>
      </div>`;

  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  html += `
    </li>`;
  
  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva den funktion som angivits som eventlyssnare för när någon markerar en uppgift som färdig. Jag pratar alltså om den eventlyssnare som angavs i templatesträngen i renderTask. Det kan t.ex. heta updateTask.*/

function finishedTask(id){
  api.update(id);
}



/*Funktionen bör ta emot ett id som skickas från <li>-elementet.
*/

/* Inuti funktionen kan ett objekt skickas till api-metoden update. Objektet ska som minst innehålla id på den uppgift som ska förändras, samt egenskapen completed som true eller false, beroende på om uppgiften markerades som färdig eller ofärdig i gränssnittet. 

Det finns några sätt att utforma det som ska skickas till api.update-metoden. 

Alternativ 1: objektet består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
Alternativ 2: objektet består bara av förändringarna och id på den uppgift som ska förändras. Exempel: {id: 1, completed: true/false } 

Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
*/

/* Anropet till api.update ska följas av then(). then() behöver, som bör vara bekant vid det här laget, en callbackfunktion som ska hantera det som kommer tillbaka från servern via vår api-klass. Inuti den funktionen bör listan med uppgifter renderas på nytt, så att den nyligen gjorda förändringen syns. */

/***********************Labb 2 ***********************/

/* Slutligen. renderList anropas också direkt, så att listan visas när man först kommer in på webbsidan.  */


renderList();
