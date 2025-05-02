"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";

// Define task type
export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
};

// Define context state
type TaskState = {
  tasks: Task[];
};

// Define action types
type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "MOVE_TASK"; payload: { id: string; status: Task["status"] } };

// Create initial state
const initialState: TaskState = {
  tasks: [
    {
      id: "1",
      title: "Create project structure",
      description: "Set up the initial project files and folders",
      status: "done",
    },
    {
      id: "2",
      title: "Implement task context",
      description: "Create context for state management",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Add drag and drop",
      description: "Implement drag and drop functionality",
      status: "todo",
    },
  ],
};

// Create context
const TaskContext = createContext<
  | {
      state: TaskState;
      dispatch: React.Dispatch<TaskAction>;
    }
  | undefined
>(undefined);

// Create reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    default:
      return state;
  }
}

// Create provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

// Create custom hook for using the context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
