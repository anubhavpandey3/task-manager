'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // 1️⃣ Monitor user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('✅ User logged in:', currentUser.email);
        setUser(currentUser);
      } else {
        console.warn('⛔ No user found. Redirecting to login...');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2️⃣ Load tasks from Firestore
  useEffect(() => {
    if (!user) return;

    console.log('🔁 Setting up Firestore listener for:', user.uid);

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('dueDate')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`📥 Received ${snapshot.docs.length} task(s) from Firestore`);
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
      },
      (error) => {
        console.error('❌ Error reading from Firestore:', error);
        alert('Failed to fetch tasks');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3️⃣ Submit or Update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('User not logged in.');
      return;
    }

    const taskData = {
      title,
      description,
      category,
      dueDate,
      userId: user.uid,
      completed: editingTask ? editingTask.completed : false,
    };

    try {
      if (editingTask) {
        console.log('🔄 Updating task:', editingTask.id, taskData);
        const taskRef = doc(db, 'tasks', editingTask.id);
        await updateDoc(taskRef, taskData);
        console.log('✅ Task updated successfully');
        setEditingTask(null);
      } else {
        console.log('📝 Adding task:', taskData);
        await addDoc(collection(db, 'tasks'), taskData);
        console.log('✅ Task added successfully');
      }
      setTitle('');
      setDescription('');
      setCategory('');
      setDueDate('');
    } catch (err) {
      console.error('❌ Failed to save task:', err);
      alert('Error saving task');
    }
  };

  // Function to start editing a task
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setDueDate(task.dueDate);
  };

  // 4️⃣ Mark task as completed/pending
  const toggleComplete = async (taskId, currentStatus) => {
    if (!user) {
      alert('User not logged in.');
      return;
    }
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed: !currentStatus });
      console.log(`✅ Task ${taskId} completion status toggled.`);
    } catch (err) {
      console.error('❌ Failed to toggle task completion:', err);
      alert('Error updating task status');
    }
  };

  // 5️⃣ Delete task
  const handleDelete = async (taskId) => {
    if (!user) {
      alert('User not logged in.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await deleteDoc(taskRef);
        console.log(`✅ Task ${taskId} deleted.`);
      } catch (err) {
        console.error('❌ Failed to delete task:', err);
        alert('Error deleting task');
      }
    }
  };

  // 6️⃣ Log out user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('👋 User logged out');
      router.push('/login');
    } catch (err) {
      console.error('❌ Logout failed:', err);
      alert('Logout error');
    }
  };

  // 7️⃣ Search Functionality
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = tasks.filter(task =>
      task.title.toLowerCase().includes(lowercasedSearchTerm) ||
      task.description.toLowerCase().includes(lowercasedSearchTerm) ||
      task.category.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredTasks(results);
  }, [searchTerm, tasks]);

  // 8️⃣ Show loading if user is not ready
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg bg-gray-900 text-white">
        Loading or not logged in...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6"> {/* Darker background, light text */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl"> {/* Darker card, more shadow */}
        <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-6 tracking-wide">TASK MANAGER</h1> {/* New prominent heading */}
        <p className="text-center text-lg text-gray-300 mb-6">Welcome, {user.email}</p>

        <form onSubmit={handleSubmit} className="mb-8 grid gap-4 bg-gray-700 p-5 rounded-lg shadow-inner"> {/* Form styling */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" // Input styling
            required
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" // Input styling
            rows="3"
            required
          />
          <input
            type="text"
            placeholder="Category (e.g., Work, Personal, Shopping)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" // Input styling
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-900 text-white focus:ring-blue-500 focus:border-blue-500" // Input styling
            required
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-grow bg-blue-600 text-white py-3 px-5 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out font-semibold text-lg"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setTitle('');
                  setDescription('');
                  setCategory('');
                  setDueDate('');
                }}
                className="flex-grow bg-gray-500 text-white py-3 px-5 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out font-semibold text-lg"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h2 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Your Tasks</h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tasks by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-600 rounded-md w-full bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" // Input styling
          />
        </div>

        <ul className="space-y-4"> {/* Increased space between tasks */}
          {filteredTasks.length === 0 && searchTerm !== '' ? (
            <p className="text-gray-400 text-center text-lg">No tasks found matching your search.</p>
          ) : (searchTerm ? filteredTasks : tasks).map((task) => (
            <li key={task.id} className={`border border-gray-700 rounded-lg p-4 bg-gray-700 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors duration-200 ${task.completed ? 'bg-gray-600 border-gray-600' : ''}`}> {/* Darker background for tasks */}
              <div className="flex-grow text-gray-100"> {/* Text color for tasks */}
                <h3 className={`font-bold text-xl ${task.completed ? 'line-through text-gray-400' : 'text-blue-300'}`}>{task.title}</h3>
                <p className={`text-md mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>{task.description}</p>
                <p className={`text-sm text-gray-400 mt-1 ${task.completed ? 'line-through' : ''}`}>Category: {task.category}</p>
                <p className={`text-sm text-gray-400 ${task.completed ? 'line-through' : ''}`}>Due: {task.dueDate}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
                <button
                  onClick={() => toggleComplete(task.id, task.completed)}
                  className={`py-2 px-4 rounded-md text-white text-sm font-medium transition duration-200 w-full sm:w-auto ${task.completed ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm font-medium transition duration-200 w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm font-medium transition duration-200 w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && searchTerm === '' && (
            <p className="text-gray-400 text-center text-lg">No tasks added yet. Start by adding a new task above!</p>
          )}
        </ul>

        <div className="text-center"> {/* Center log out button */}
          <button
            onClick={handleLogout}
            className="mt-8 bg-red-700 text-white py-3 px-8 rounded-md hover:bg-red-800 transition duration-300 ease-in-out font-semibold text-lg shadow-md"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}