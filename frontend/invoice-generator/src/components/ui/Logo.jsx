import React from "react";

const Logo = ({ size = 40, imgFixed = false }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      {imgFixed ? (
        <img
          src="/logo/logo-dark.png"
          alt="Ainvoy Logo"
          style={{ width: size, height: size }}
          className="transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <>
          <img
            src="/logo/logo-white.png"
            alt="Ainvoy Logo"
            style={{ width: size, height: size }}
            className="block dark:hidden transition-transform duration-300 hover:scale-105"
          />
          <img
            src="/logo/logo-dark.png"
            alt="Ainvoy Logo"
            style={{ width: size, height: size }}
            className="hidden dark:block transition-transform duration-300 hover:scale-105"
          />
        </>
      )}

      {/* Brand Name */}
      <span className="text-slate-900 dark:text-white font-semibold text-xl tracking-[0.12em]">
        AINVOY
      </span>
    </div>
  );
};

export default Logo;