'use client';

import { useState } from 'react';
import Todo from './components/Todo';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask.trim(),
          completed: false,
        },
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sendTasksToEmail = async () => {
    if (!email || tasks.length === 0) return;
  
    setIsEmailSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tasks: tasks.map(task => ({
            text: task.text,
            status: task.completed ? 'Completed' : 'Pending'
          })),
          date: new Date().toLocaleDateString()
        }),
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        console.error('Server error:', error);
        throw new Error('Failed to send email');
      }
  
      alert('Tasks sent to your email successfully!');
      setEmail('');
    } catch (error) {
      console.error('Send error:', error);
      alert('Failed to send tasks to email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Daily Task Tracker
        </h1>
        
        <form onSubmit={addTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-2 mb-8">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <Todo
                key={task.id}
                id={task.id}
                text={task.text}
                completed={task.completed}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Your Tasks</h2>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={sendTasksToEmail}
                disabled={!email || isEmailSending}
                className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  !email || isEmailSending
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isEmailSending ? 'Sending...' : 'Send to Email'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
