import React from "react";
import { nanoid } from "nanoid";
import "./App.css";
import { useAutoAnimate } from '@formkit/auto-animate/react'


function App() {
  const [tasks,setTasks] = React.useState(() => {
     return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [parent, enableAnimations] = useAutoAnimate()

  React.useEffect(() => {
    localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks]);

  const taskElements = tasks.map((task) => {
    return(
      <li key={task.id} onClick={(event) => toggleCompleted(task.id,event)} className={`${task.completed ? "completed" : ""} flex justify-between gap-4 px-4 py-2 border rounded-md mt-2 cursor-pointer text-xl transition-colors hover:bg-white hover:text-purple-950`}>
        <p className="flex-1 " >{task.text}</p>
        <button className="shrink-0 invisible font-semibold outline-none cursor-pointer" onClick={() => deleteTask(task.id)}>x</button>
      </li>
    );
  });

  function toggleCompleted(id,event) {
    if(event.target.tagName === "BUTTON") {
      deleteTask(id);
      return;
    }
    let selectedElement = tasks.find(task => task.id === id);
    selectedElement = {...selectedElement, completed: !selectedElement.completed};
    const filteredArray = tasks.filter((task) => task.id !== id);
    if(selectedElement.completed){
      setTasks( () => [...filteredArray, selectedElement]);
    }else{
      setTasks( () => [selectedElement, ...filteredArray]);
    }
  }

  function setNewTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskInput = formData.get("task-input");
    if(taskInput === "") return;
    event.target.elements["task-input"].value = "";
    setTasks(prev => [{id: nanoid(), text: taskInput, completed: false}, ...prev]);
  }

  function deleteTask(id) {
    setTasks(prev => tasks.filter(task => {
      return task.id != id;
    }));
  }

  return(
    <div className="flex flex-col justify-center content-center border-1 w-1/2 rounded-md p-6 mt-10 mx-auto min-w-min bg-purple-950 text-white max-sm:w-3/4">
      <h1 className="text-5xl text-center">Todo App</h1>
      <form onSubmit={setNewTask} className="flex gap-2 mt-6">
        <input type="text" placeholder="Type a task!" name="task-input" className="flex-1 px-4 py-2 border rounded outline-none"/>
        <button className="shrink-0 border py-1 px-4 rounded cursor-pointer transition bg-white text-purple-950 font-semibold hover:bg-purple-300 outline-none  ">Submit</button>
      </form>
      <ul id="task-list" ref={parent} className="border-t mt-4 pt-4">
        {taskElements}
      </ul>
    </div>
  );
}

export default App;