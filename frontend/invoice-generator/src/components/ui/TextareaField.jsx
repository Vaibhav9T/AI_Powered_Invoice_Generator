import React from 'react'

export const TextareaField = ({icon: Icon,label, name, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-slate-700'>
        {label}
      </label>
      <div className='flex items-center gap-2 mb-1'>
        {Icon && <div className="text-slate-500"><Icon size={18} /></div>}
      </div>
      <textarea id={name} name={name} {...props}
        className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm'
      />
    </div>
  )
}
