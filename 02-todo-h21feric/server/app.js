const express = require('express');
const app = express();
const fs = require('fs/promises');
const PORT = 5000;


app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });


app.get('/tasks', async (req, res) => {
  try {
    const tasks = await fs.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    let maxTaskId = 1;
    if (currentTasks && currentTasks.length > 0) {
      maxTaskId = currentTasks.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...task };
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva en funktion som likt post eller delete tar kan hantera PUT- eller PATCH-anrop (du får välja vilket, läs på om vad som verkar mest vettigt för det du ska göra) för att kunna markera uppgifter som färdiga. Den nya statusen - completed true eller falase - kan skickas i förfrågans body (req.body) tillsammans med exempelvis id så att man kan söka fram en given uppgift ur listan, uppdatera uppgiftens status och till sist spara ner listan med den uppdaterade uppgiften */

app.put('/tasks/:id', async (req, res) => {
  console.log(req)
  try {
    const id = req.params.id;
    const taskJson =  await fs.readFile("./tasks.json");
    const currentTasks = JSON.parse(taskJson);

    currentTasks.forEach(element => {
      if (element.id == id && element.completed == true) {
        element.completed = false;
      }

      else if (element.id == id && element.completed == false) {
        element.completed = true;
      }
    });
    await fs.writeFile("./tasks.json", JSON.stringify(currentTasks));
  }
  catch(error) {
    res.status(500).send({ error: error.stack });
  }
});


/* Observera att all kod rörande backend för labb 2 ska skrivas i denna fil och inte i app.node.js. App.node.js är bara till för exempel från lektion 5 och innehåller inte någon kod som används vidare under lektionerna. */
/***********************Labb 2 ***********************/

/* Med app.listen säger man åte servern att starta. Första argumentet är port - dvs. det portnummer man vill att servern ska köra på. Det sattes till 5000 på rad 9. Det andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs bara ett meddelande ut som berättar att servern kör, så att man får feedback på att allt körts igång som det skulle. */
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
