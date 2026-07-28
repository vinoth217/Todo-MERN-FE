import React from 'react'
import { useSelector } from 'react-redux'
import { Pencil, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';
import { updateTask, deleteTask } from '../store/slice/taskSlice';
import { type RootState, useAppDispatch } from '../store';

interface TaskCardProps {
    task: {
        _id: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        status: 'pending' | 'completed';
        dueDate: string;
    }
    onEdit: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
    const dispatch = useAppDispatch();
    const { isDarkMode } = useSelector((state: RootState) => state.theme);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await dispatch(deleteTask(task._id));
        }
    };

    const handleToggleStatus = async () => {
        await dispatch(updateTask({
            id: task._id,
            task: {
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                status: task.status === 'completed' ? 'pending' : 'completed',
            },
        }));
    };

    const priorityStyles = {
        low: isDarkMode
            ? 'bg-green-500/15 text-green-400'
            : 'bg-green-100 text-green-700',
        medium: isDarkMode
            ? 'bg-amber-500/15 text-amber-400'
            : 'bg-amber-100 text-amber-700',
        high: isDarkMode
            ? 'bg-red-500/15 text-red-400'
            : 'bg-red-100 text-red-700',
    };

    const isOverDue = new Date(task.dueDate) < new Date() && task.status === 'pending';
    const formattedDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '';

    return (
        <div className={`group p-4 sm:p-5 rounded-xl border transition-all ${
            isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
        } ${task.status === 'completed' ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-3">
                <button
                    onClick={handleToggleStatus}
                    className={`mt-0.5 shrink-0 transition-colors ${
                        task.status === 'completed'
                            ? 'text-green-500 hover:text-green-600'
                            : isDarkMode
                                ? 'text-gray-500 hover:text-blue-400'
                                : 'text-gray-400 hover:text-blue-500'
                    }`}
                    aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                >
                    {task.status === 'completed'
                        ? <CheckCircle className="w-5 h-5" />
                        : <Circle className="w-5 h-5" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className={`font-semibold truncate ${
                                task.status === 'completed'
                                    ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                                    : isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className={`mt-1 text-sm line-clamp-2 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {task.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={onEdit}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                                aria-label="Edit task"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                                aria-label="Delete task"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[task.priority]}`}>
                            {task.priority}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs ${
                            isOverDue
                                ? 'text-red-500 font-medium'
                                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                            {isOverDue && ' · Overdue'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
