import { useState, useRef, useEffect } from "react";
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

const Item = ({ value, ref, tabId, panelId, activeTab, onClick, title }) => {
    return (
        <Reorder.Item
            className="tabbed-ui__item"
            data-tab-id={tabId}
            data-selected={tabId === activeTab ? "true" : "false"}
            as="div"
            value={value}
            tabIndex={undefined}
            ref={ref}
        >
            <button
                className="tabbed-ui__tab"
                id={tabId}
                role="tab"
                aria-controls={panelId}
                aria-selected={tabId === activeTab ? "true" : "false"}
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
    const activeTabRef = useRef(activeTab);
    const visibleItems = useRef(new Map());
    const [hiddenIDs, setHiddenIDs] = useState([]);
    const hiddenIDsRef = useRef(null);

    function setItemRef(node, tabId) {
        const map = visibleItems.current;

        map.set(tabId, node);

        return () => map.delete(tabId);
    }

    useEffect(() => {
        activeTabRef.current = activeTab;
    }, [activeTab]);

    useEffect(() => {
        hiddenIDsRef.current = hiddenIDs;
    }, [hiddenIDs]);

    useEffect(() => {
        const items = visibleItems.current;

        function updateOverflow() {
            const { clientWidth, children } = tabBarRef.current;

            let accumulatedWidth = 0;

            for (let i = 0; i < children.length; i++) {
                accumulatedWidth += children[i].clientWidth;
            }

            const difference = clientWidth - accumulatedWidth;

            if (difference < 0) {
                const activeItem = visibleItems.current.get(
                    activeTabRef.current
                );

                const tabBarRight =
                    tabBarRef.current.getBoundingClientRect().right;
                const activeItemRight =
                    activeItem.getBoundingClientRect().right;

                if (activeItemRight > tabBarRight) {
                    setTabOrder((prev) => {
                        const index = prev.findIndex((tab) => {
                            return tab.tabId === activeItem.dataset.tabId;
                        });

                        if (index <= 0) return prev;

                        const newOrder = [...prev];
                        const selectedItem = newOrder[index];

                        newOrder[index] = newOrder[index - 1];
                        newOrder[index - 1] = selectedItem;

                        return newOrder;
                    });
                }

                const hidden = [];

                for (const item of items.values()) {
                    const { tabId, selected } = item.dataset;

                    if (selected === "true") continue;

                    const itemRight = item.getBoundingClientRect().right;

                    if (itemRight <= tabBarRight) continue;

                    items.delete(tabId);
                    hidden.push({
                        tabId,
                        visibleWidth: item.clientWidth,
                    });
                }

                setHiddenIDs((prev) => [...prev, ...hidden]);
            } else if (difference > 0) {
                let count = 0;

                for (let i = 0; i < hiddenIDsRef.current.length; i++) {
                    const { visibleWidth } = hiddenIDsRef.current[i];

                    if (visibleWidth > difference) break;

                    count++;
                }

                setHiddenIDs((prev) => prev.slice(count));
            }
        }

        updateOverflow();
        window.addEventListener("resize", updateOverflow);

        return () => window.removeEventListener("resize", updateOverflow);
    }, []);

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

                    const hiddenId = hiddenIDs.find(
                        (hidden) => hidden.tabId === tabId
                    );

                    if (!hiddenId) {
                        return (
                            <Item
                                value={tab}
                                tabId={tabId}
                                panelId={panelId}
                                activeTab={activeTab}
                                onClick={() => selectTab(tabId)}
                                title={title}
                                ref={(node) => setItemRef(node, tabId)}
                                key={tabId}
                            />
                        );
                    }
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
