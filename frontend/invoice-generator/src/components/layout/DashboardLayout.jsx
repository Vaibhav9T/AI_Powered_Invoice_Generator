import { memo } from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <h2>DashboardLayout</h2>
      {children}
    </div>
  );
};

export default memo(DashboardLayout);