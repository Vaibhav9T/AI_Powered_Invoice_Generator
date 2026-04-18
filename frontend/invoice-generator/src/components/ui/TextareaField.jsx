import React from 'react'

export const TextareaField = ({icon: Icon,label, name, ...props }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {Icon && (
          <div className="text-slate-400 dark:text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
          {label}
        </label>
      </div>
      <textarea id={name} name={name} {...props}
        className='w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent sm:text-sm transition-colors'
      />
    </div>
  )
}
