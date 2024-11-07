// TabsBar.jsx
import React, { useState } from "react";
import "./TabsBar.css";

const TabsBar = ({ tabs, onSelect }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelect(tab);
  };

  return (
    <div className="tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? "active" : ""}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabsBar;
