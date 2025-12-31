import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen flex overflow-hidden  font-dm-sans">
      {children}
    </div>
  );
};

export default DashboardLayout;
