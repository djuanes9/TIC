import React, { useState } from "react";
import "./TabsBar.css";

const TabsBar = ({ tabs, onSelect, user, role, onLogout }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelect(tab);
  };

  return (
    <div className="tabs-bar">
      <div className="tabs">
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
      <div className="user-info">
        <span className="user-name">
          {user} - {role}
        </span>
        <button className="logout-button" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default TabsBar;
