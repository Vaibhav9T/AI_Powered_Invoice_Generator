import React from 'react'

export const SelectField = ({ label, name, options, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors'>
        {label}
      </label>
      <select id={name} name={name} {...props}
      className='w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent sm:text-sm transition-colors'
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
