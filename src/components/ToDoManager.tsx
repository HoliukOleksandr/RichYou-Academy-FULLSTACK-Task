import React, { useState, useEffect } from 'react';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const ToDo: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
            setNewTask('');
        }
    };

    const toggleComplete = (id: number) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const startEditing = (id: number, text: string) => {
        setEditingTaskId(id);
        setEditingText(text);
    };

    const saveEdit = (id: number) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editingText } : task)));
        setEditingTaskId(null);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <div className="todo">
            <h2>ToDo Менеджер</h2>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Нове завдання"
            />
            <button onClick={addTask}>Додати</button>
            <div className="filters">
                <button onClick={() => setFilter('all')}>Усі</button>
                <button onClick={() => setFilter('completed')}>Виконані</button>
                <button onClick={() => setFilter('incomplete')}>Невиконані</button>
            </div>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button onClick={() => saveEdit(task.id)}>Зберегти</button>
                            </>
                        ) : (
                            <>
                                <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
                                <button onClick={() => startEditing(task.id, task.text)}>Редагувати</button>
                                <button onClick={() => deleteTask(task.id)}>Видалити</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDo;