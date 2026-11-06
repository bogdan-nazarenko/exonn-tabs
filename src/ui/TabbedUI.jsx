import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import tabs from "@data/tabs";
import "./TabbedUI.scss";

const Group = ({ tabId, panelId, index, activeTab, title, onClick }) => {
    const { ref } = useSortable({ id: tabId, index });

    return (
        <div className="tabbed-ui__group" key={tabId}>
            <button
                className="tabbed-ui__tab"
                id={tabId}
                role="tab"
                aria-controls={panelId}
                aria-selected={activeTab === tabId ? "true" : "false"}
                tabIndex={activeTab === tabId ? 0 : -1}
                ref={ref}
                onClick={onClick}
            >
                {title}
            </button>
            <button aria-label="Close tab"></button>
        </div>
    );
};

const TabbedUI = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].tabId);

    const tabData = tabs.find((tab) => tab.tabId === activeTab);

    function selectTab(tabId) {
        if (activeTab === tabId) return;

        setActiveTab(tabId);
    }

    function moveFocus(event) {
        const tabBar = event.currentTarget;
        const tab = event.target;
        let newTab = null;

        switch (event.key) {
            case "ArrowLeft":
                newTab =
                    tab.parentElement.previousElementSibling?.children[0] ||
                    tabBar.lastElementChild.children[0];
                break;
            case "ArrowRight":
                newTab =
                    tab.parentElement.nextElementSibling?.children[0] ||
                    tabBar.firstElementChild.children[0];
                break;
            case "Home":
                newTab = tabBar.firstElementChild.children[0];
                break;
            case "End":
                newTab = tabBar.lastElementChild.children[0];
                break;
            default:
                return;
        }

        event.preventDefault();
        newTab.focus();
    }

    return (
        <div className="tabbed-ui">
            <div
                className="tabbed-ui__tab-bar"
                role="tablist"
                onKeyDown={moveFocus}
            >
                {tabs.map((tab, index) => {
                    const { tabId, title, panelId } = tab;

                    return (
                        <Group
                            tabId={tabId}
                            panelId={panelId}
                            index={index}
                            activeTab={activeTab}
                            title={title}
                            key={tabId}
                            onClick={() => selectTab(tabId)}
                        />
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
