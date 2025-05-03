import TaskBoard from "@/components/task-board";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-red-950">
        Task Management App
      </h1>
      <TaskBoard />
    </main>
  );
}
