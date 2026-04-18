import React from 'react'

export const InputField = ({ icon: Icon, label, name, error, helperText, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 dark:text-slate-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          {...props}
          className={`w-full p-2 ${Icon ? 'pl-10' : ''} bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent sm:text-sm transition-colors`}
        />
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      {helperText && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</div>}
    </div>
  )
}
