import { useState, useRef } from "react";
import { Reorder } from "motion/react";
import tabs from "@data/tabs";
import "./TabbedUI.scss";

const TabList = ({
    className = "tabbed-ui__tab-bar",
    id,
    labelId,
    values,
    ref,
    onReorder,
    onKeyDown,
    children,
}) => {
    return (
        <Reorder.Group
            className={className}
            id={id}
            role="tablist"
            aria-labelledby={labelId}
            as="div"
            axis="xy"
            values={values}
            ref={ref}
            onReorder={onReorder}
            onKeyDown={onKeyDown}
        >
            {children}
        </Reorder.Group>
    );
};

const Item = ({ value, tabId, panelId, activeTab, onClick, title }) => {
    return (
        <Reorder.Item
            className="tabbed-ui__item"
            as="div"
            value={value}
            tabIndex={undefined}
        >
            <button
                className="tabbed-ui__tab"
                id={tabId}
                role="tab"
                aria-controls={panelId}
                aria-selected={activeTab === tabId ? "true" : "false"}
                tabIndex={activeTab === tabId ? 0 : -1}
                onClick={onClick}
            >
                {title}
            </button>
            <button aria-label="Close tab"></button>
        </Reorder.Item>
    );
};

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

    const tabBarRef = useRef(null);

    return (
        <div className="tabbed-ui">
            <TabList
                values={tabOrder}
                onReorder={setTabOrder}
                onKeyDown={moveFocus}
                ref={tabBarRef}
            >
                {tabOrder.map((tab) => {
                    const { tabId, panelId, title } = tab;

                    return (
                        <Item
                            value={tab}
                            tabId={tabId}
                            panelId={panelId}
                            activeTab={activeTab}
                            onClick={() => selectTab(tabId)}
                            title={title}
                            key={tabId}
                        />
                    );
                })}
            </TabList>

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
