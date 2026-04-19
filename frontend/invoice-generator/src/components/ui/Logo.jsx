import React from 'react'

const Logo = () => {
  return (
    <div className="shrink-0 flex items-center gap-2 cursor-pointer">
      {/* Custom Icon to match the blue cone/mountain in your image */}
      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 22H22L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
        InvoiceAI
      </span>
    </div>
  )
}

export default Logo;