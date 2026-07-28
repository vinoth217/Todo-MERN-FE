import React, { useEffect, useState } from 'react'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { useSelector } from 'react-redux'
import { type RootState, useAppDispatch } from '../store'
import { fetchTasks } from '../store/slice/taskSlice'
import { PlusCircle, Calendar, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
] as const;

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<null | any>(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const { tasks = [], isLoading } = useSelector((state: RootState) => state.tasks);
    const { isDarkMode } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const openModal = (task: any = null) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const filterTasks = tasks.filter((task: any) => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'completed') return task.status === 'completed';
        if (filterStatus === 'pending') return task.status === 'pending';
        if (filterStatus === 'overdue') {
            return task.dueDate < todayStr && task.status === 'pending';
        }
        return false;
    });

    const dueTodayCount = tasks.filter((task: any) =>
        task.dueDate?.split('T')[0] === todayStr && task.status === 'pending'
    ).length;

    const pendingCount = tasks.filter((task: any) => task.status === 'pending').length;
    const completedCount = tasks.filter((task: any) => task.status === 'completed').length;
    const highPriorityCount = tasks.filter((task: any) => task.priority === 'high' && task.status === 'pending').length;

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        My Tasks
                    </h1>
                    {/* <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tasks.length} total · {pendingCount} pending
                    </p> */}
                </div>
                <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Task
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <SummaryCard
                    title="Due Today"
                    count={dueTodayCount}
                    icon={<Calendar className="w-5 h-5" />}
                    accent="text-blue-500 bg-blue-500/10"
                    isDarkMode={isDarkMode}
                />
                <SummaryCard
                    title="Pending"
                    count={pendingCount}
                    icon={<Clock className="w-5 h-5" />}
                    accent="text-amber-500 bg-amber-500/10"
                    isDarkMode={isDarkMode}
                />
                <SummaryCard
                    title="Completed"
                    count={completedCount}
                    icon={<CheckCircle className="w-5 h-5" />}
                    accent="text-green-500 bg-green-500/10"
                    isDarkMode={isDarkMode}
                />
                <SummaryCard
                    title="High Priority"
                    count={highPriorityCount}
                    icon={<AlertCircle className="w-5 h-5" />}
                    accent="text-red-500 bg-red-500/10"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {FILTERS.map(({ key, label }) => {
                    const isActive = filterStatus === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                isActive
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : isDarkMode
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Task list */}
            <div className="space-y-3">
                {filterTasks.length === 0 ? (
                    <div className={`text-center py-16 rounded-xl border border-dashed ${
                        isDarkMode
                            ? 'border-gray-700 bg-gray-800/50 text-gray-400'
                            : 'border-gray-300 bg-white text-gray-500'
                    }`}>
                        <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No tasks found</p>
                        <p className="text-sm mt-1 opacity-75">
                            {filterStatus === 'all'
                                ? 'Create your first task to get started'
                                : `No ${filterStatus} tasks right now`}
                        </p>
                        {filterStatus === 'all' && (
                            <button
                                onClick={() => openModal(null)}
                                className="mt-4 inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Task
                            </button>
                        )}
                    </div>
                ) : (
                    filterTasks.map((task: any) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={() => openModal(task)}
                        />
                    ))
                )}
            </div>

            <TaskModal isOpen={isModalOpen} onClose={closeModal} task={selectedTask} />
        </div>
    );
};

const SummaryCard = ({
    title,
    count,
    icon,
    accent,
    isDarkMode,
}: {
    title: string;
    count: number;
    icon: React.ReactNode;
    accent: string;
    isDarkMode: boolean;
}) => {
    return (
        <div className={`p-4 sm:p-5 rounded-xl border transition-colors ${
            isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200 shadow-sm'
        }`}>
            <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {title}
                </p>
                <div className={`p-2 rounded-lg ${accent}`}>
                    {icon}
                </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {count}
            </p>
        </div>
    );
};

export default Dashboard;
