import React from 'react'

export const InputField = ({ icon: Icon, label, name, ...props}) => {
  return (
    
    <div>
        <label htmlFor={name} className={label}>
            <div className='flex items-center gap-2'>
                {Icon && <div className="text-slate-500"><Icon size={18} />
                    <Icon size={18} className="text-slate-500" />
                </div>}
               <input
                    id={name}
                    name={name}
                    {...props}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent sm:text-sm"
                />
             </div>
             <div className="text-xs text-slate-500 mt-1">
                {props.error}
             </div>
             <div className="text-xs text-slate-500 mt-1">
                {props.helperText}
             </div>
        </label>
    </div>
  )
}

