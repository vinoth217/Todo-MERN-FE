import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createTask, updateTask } from '../store/slice/taskSlice';
import { type RootState, useAppDispatch } from '../store';
import { toast } from 'react-hot-toast';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: {
        _id: string;
        title: string;
        description: string;
        priority: string;
        status: string;
        dueDate: string;
    } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
    const dispatch = useAppDispatch();
    const { isDarkMode } = useSelector((state: RootState) => state.theme);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('pending');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setStatus(task.status);
            setDueDate(task.dueDate?.split('T')[0] || '');
        } else {
            setTitle('');
            setDescription('');
            setPriority('low');
            setStatus('pending');
            setDueDate('');
        }
    }, [task, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!dueDate) {
            toast.error('Due date is required');
            return;
        }

        const selectedDueDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDueDate < today) {
            toast.error('Due date cannot be in the past');
            return;
        }

        const taskData: any = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate,
        };

        try {
            if (task) {
                await dispatch(updateTask({ id: task._id, task: taskData })).unwrap();
            } else {
                await dispatch(createTask(taskData)).unwrap();
            }
            toast.success(task ? 'Task updated successfully' : 'Task created successfully');
            onClose();
        } catch {
            toast.error('Failed to save task');
        }
    };

    const inputClass = `w-full px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500 ${
        isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }`;

    const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`relative w-full max-w-md rounded-lg shadow-xl ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between px-6 py-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <h2 id="task-modal-title" className="text-xl font-semibold">
                        {task ? 'Edit Task' : 'Create Task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`p-1 rounded-md transition-colors ${
                            isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-500'
                        }`}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label htmlFor="title" className={labelClass}>Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className={labelClass}>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            rows={3}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className={labelClass}>Priority</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className={inputClass}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className={labelClass}>Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={inputClass}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className={labelClass}>Due Date</label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        >
                            {task ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
