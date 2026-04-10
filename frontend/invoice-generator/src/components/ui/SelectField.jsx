import React from 'react'

export const SelectField = ({ label, name, options, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-slate-700'>
        {label}
      </label>
      <select id={name} name={name} {...props}
      className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm'
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
