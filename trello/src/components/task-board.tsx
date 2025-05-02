"use client";

import { useState } from "react";
import { useTaskContext, type Task } from "@/context/task-context";
//import TaskColumn from "./task-column"
//import TaskForm from "./task-form"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
//import TaskCard from "./task-card"

export default function TaskBoard() {
  const { state, dispatch } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = state.tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If the task is dropped over a column
    if (overId === "todo" || overId === "in-progress" || overId === "done") {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          id: activeId as string,
          status: overId as Task["status"],
        },
      });
    }
  };

  const todoTasks = state.tasks.filter((task) => task.status === "todo");
  const inProgressTasks = state.tasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = state.tasks.filter((task) => task.status === "done");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <Button onClick={handleAddTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* <TaskColumn id="todo" title="To Do" tasks={todoTasks} onEditTask={handleEditTask} /> */}
          {/* <TaskColumn id="in-progress" title="In Progress" tasks={inProgressTasks} onEditTask={handleEditTask} />
          <TaskColumn id="done" title="Done" tasks={doneTasks} onEditTask={handleEditTask} /> */}
        </div>

        {/* <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay> */}
      </DndContext>

      {/* {isFormOpen && <TaskForm task={editingTask} onClose={handleCloseForm} />} */}
    </div>
  );
}
