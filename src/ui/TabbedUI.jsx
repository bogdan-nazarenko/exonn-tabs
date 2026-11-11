import { useState } from "react";
import { Reorder } from "motion/react";
import tabs from "@data/tabs";
import "./TabbedUI.scss";

const TabbedUI = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].tabId);
    const [tabOrder, setTabOrder] = useState(tabs);
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
            <Reorder.Group
                className="tabbed-ui__tab-bar"
                role="tablist"
                as="div"
                axis="xy"
                values={tabOrder}
                onReorder={setTabOrder}
                onKeyDown={moveFocus}
            >
                {tabOrder.map((tab) => {
                    const { tabId, title, panelId } = tab;

                    return (
                        <Reorder.Item
                            className="tabbed-ui__item"
                            as="div"
                            value={tab}
                            key={tabId}
                            tabIndex={undefined}
                        >
                            <button
                                className="tabbed-ui__tab"
                                id={tabId}
                                role="tab"
                                aria-controls={panelId}
                                aria-selected={
                                    activeTab === tabId ? "true" : "false"
                                }
                                tabIndex={activeTab === tabId ? 0 : -1}
                                onClick={() => selectTab(tabId)}
                            >
                                <span
                                    className={`tabbed-ui__icon tabbed-ui__icon_${title.replace(" ", "-").toLowerCase()}`}
                                    aria-hidden="true"
                                ></span>
                                <span>{title}</span>
                            </button>
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>

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
