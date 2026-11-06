import { useState } from "react";
import tabs from "@data/tabs";
import "./TabbedUI.scss";

const TabbedUI = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].tabId);

    const tabData = tabs.find((tab) => tab.tabId === activeTab);

    function tabHandler(tab) {
        if (activeTab === tab) return;

        setActiveTab(tab);
    }

    return (
        <div className="tabbed-ui">
            <div className="tabbed-ui__tab-bar" role="tablist">
                {tabs.map((tab) => {
                    const { tabId, title, panelId } = tab;

                    return (
                        <div className="tabbed-ui__group" key={tabId}>
                            <button
                                className="tabbed-ui__tab"
                                id={tabId}
                                role="tab"
                                aria-controls={panelId}
                                aria-selected={
                                    activeTab === tabId ? "true" : "false"
                                }
                                tabIndex={activeTab === tabId ? 0 : -1}
                                onClick={() => tabHandler(tabId)}
                            >
                                {title}
                            </button>
                            <button aria-label="Close tab"></button>
                        </div>
                    );
                })}
            </div>

            <div className="tabbed-ui__content">
                {tabData && (
                    <div
                        className="tabbed-ui__panel"
                        id={tabData.panelId}
                        role="tabpanel"
                        aria-labelledby={tabData.tabId}
                        tabIndex={0}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default TabbedUI;
