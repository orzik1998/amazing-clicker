import React from 'react';
import { GameState, TaskItem } from '../types';
import { TASKS } from '../constants';
import { CheckCircle2, Circle } from 'lucide-react';

interface TasksSectionProps {
  state: GameState;
  onCompleteTask: (task: TaskItem) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({ state, onCompleteTask }) => {
  return (
    <div className="flex flex-col h-full pt-6 px-4 pb-24 overflow-y-auto page-enter">
      <h2 className="text-2xl font-bold mb-2 text-center drop-shadow-md">Задания</h2>
      <p className="text-center text-slate-300 text-sm mb-6 opacity-80">Выполняй задания и получай монеты!</p>

      <div className="grid gap-3">
        {TASKS.map((task) => {
          const isCompleted = state.completedTasks.includes(task.id);

          return (
            <div 
              key={task.id}
              className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-900/20 border-green-500/30 opacity-60 grayscale-[0.5]' 
                  : 'bg-slate-800/60 border-slate-700/50 backdrop-blur-md hover:bg-slate-800/80'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mr-4 shrink-0 shadow-lg border border-white/5">
                {task.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${isCompleted ? 'text-green-300 line-through decoration-green-500/50' : 'text-white'}`}>
                    {task.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                   <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                     <img src="https://cdn-icons-png.flaticon.com/512/12117/12117188.png" className="w-3 h-3" alt="coin" />
                   </div>
                   <span className="text-yellow-400 text-xs font-bold">+{task.reward.toLocaleString()}</span>
                </div>
              </div>

              {isCompleted ? (
                <div className="ml-3 p-2 animate-bounce">
                   <CheckCircle2 className="text-green-500 drop-shadow-lg" size={28} />
                </div>
              ) : (
                <button
                    onClick={() => onCompleteTask(task)}
                    className="ml-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-blue-900/30 whitespace-nowrap border border-blue-400/20"
                >
                    {task.actionText}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};