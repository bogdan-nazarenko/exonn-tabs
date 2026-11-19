import { useState, useRef, useEffect } from "react";
import { Reorder } from "motion/react";
import tabs from "@data/tabs";
import "./TabbedUI.scss";

const TabbedUI = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].tabId);
    const [targetTabs, setTargetTabs] = useState({ visible: tabs, hidden: [] });
    const tabData = tabs.find((tab) => tab.tabId === activeTab);

    function selectTab(tabId) {
        if (activeTab === tabId) return;

        setActiveTab(tabId);
    }

    function moveFocus(event, isVerticalMenu = false) {
        const tabBar = event.currentTarget;
        const tab = event.target;
        let newTab = null;

        switch (event.key) {
            case isVerticalMenu ? "ArrowUp" : "ArrowLeft":
                newTab = tab.previousElementSibling || tabBar.lastElementChild;
                break;
            case isVerticalMenu ? "ArrowDown" : "ArrowRight":
                newTab = tab.nextElementSibling || tabBar.firstElementChild;
                break;
            case "Home":
                newTab = tabBar.firstElementChild;
                break;
            case "End":
                newTab = tabBar.lastElementChild;
                break;
            default:
                return;
        }

        event.preventDefault();
        newTab.focus();
    }

    const tabBarRef = useRef(null);
    const hiddenMenuRef = useRef(null);

    useEffect(() => {
        function updateOverflow() {
            const { clientWidth } = tabBarRef.current;
            const visibleTabs = tabBarRef.current.children;
            let accumulatedWidth = 0;

            for (let i = 0; i < visibleTabs.length; i++) {
                accumulatedWidth += visibleTabs[i].clientWidth;
            }

            const difference = clientWidth - accumulatedWidth;

            if (difference < 0) {
                setTargetTabs((prev) => {
                    const tabBarRect =
                        tabBarRef.current.getBoundingClientRect();

                    const outOfBoundTabs = [];

                    for (let i = 0; i < visibleTabs.length; i++) {
                        const { id } = visibleTabs[i];

                        const tabRect = visibleTabs[i].getBoundingClientRect();

                        if (tabRect.right <= tabBarRect.right) continue;

                        const foundedTab = prev.visible.find(
                            (tab) => tab.tabId === id
                        );

                        if (!foundedTab) continue;

                        outOfBoundTabs.push(foundedTab);
                    }

                    return {
                        visible: prev.visible.filter((tab) => {
                            return !outOfBoundTabs.some(
                                (o) => o.tabId === tab.tabId
                            );
                        }),
                        hidden: [...outOfBoundTabs, ...prev.hidden],
                    };
                });
            } else if (difference > 0) {
                setTargetTabs((prev) => {
                    const hiddenTabs = hiddenMenuRef.current.children;
                    const restoredTabs = [];

                    for (let i = 0; i < hiddenTabs.length; i++) {
                        const { clientWidth, id } = hiddenTabs[i];

                        if (clientWidth > difference) break;

                        const foundedTab = prev.hidden.find(
                            (tab) => tab.tabId === id
                        );

                        restoredTabs.push(foundedTab);
                    }

                    return {
                        visible: [...prev.visible, ...restoredTabs],
                        hidden: prev.hidden.filter((tab) => {
                            return !restoredTabs.some(
                                (r) => r.tabId === tab.tabId
                            );
                        }),
                    };
                });
            }
        }

        let timeoutId = null;

        function handleResize() {
            if (timeoutId) clearTimeout(timeoutId);

            setTimeout(updateOverflow, 100);
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [isMenuVisible, setMenuVisible] = useState(false);
    const menuButtonRef = useRef(null);
    const firstHiddenRef = useRef(null);

    useEffect(() => {
        function closeMenu(event) {
            if (
                !event.target.closest(".tabbed-ui__menu-button") &&
                !event.target.closest(".tabbed-ui__menu")
            ) {
                setMenuVisible(false);
            }
        }

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, []);

    const [isPressed, setPressed] = useState(false);
    const [pinnedTabs, setPinnedTabs] = useState([]);

    function togglePinning(tabId, tab) {
        const pinnedTab = pinnedTabs.find((tab) => tab.tabId === tabId);

        if (pinnedTab) {
            setPinnedTabs((prev) => {
                return prev.filter((tab) => tab.tabId !== tabId);
            });

            return;
        }

        setPinnedTabs((prev) => [tab, ...prev]);
    }

    return (
        <div className="tabbed-ui">
            <div className="tabbed-ui__controls">
                <button
                    className="tabbed-ui__pin-button"
                    title={
                        isPressed
                            ? "Tab pinning mode"
                            : "Select tabs to pin or unpin"
                    }
                    aria-label={
                        isPressed
                            ? "Tab pinning mode"
                            : "Select tabs to pin or unpin"
                    }
                    aria-pressed={isPressed ? "true" : "false"}
                    onClick={() => setPressed((prev) => !prev)}
                ></button>

                <Reorder.Group
                    className="tabbed-ui__tab-bar"
                    role="tablist"
                    as="div"
                    axis="xy"
                    values={targetTabs.visible}
                    onReorder={(newOrder) =>
                        setTargetTabs((prev) => ({
                            visible: newOrder,
                            hidden: [...prev.hidden],
                        }))
                    }
                    onKeyDown={moveFocus}
                    ref={tabBarRef}
                >
                    {targetTabs.visible.map((tab) => {
                        const { tabId, panelId, title } = tab;
                        const pinnedTab = pinnedTabs.find(
                            (tab) => tab.tabId === tabId
                        );

                        return (
                            <Reorder.Item
                                className={`tabbed-ui__tab ${pinnedTab ? "tabbed-ui__tab_pinned" : ""}`.trim()}
                                as="button"
                                drag={pinnedTab ? false : true}
                                value={tab}
                                id={tabId}
                                role="tab"
                                aria-label={
                                    pinnedTab
                                        ? `Pinned tab: ${title}`
                                        : undefined
                                }
                                aria-controls={panelId}
                                aria-selected={
                                    activeTab === tabId ? "true" : "false"
                                }
                                tabIndex={activeTab === tabId ? 0 : -1}
                                onClick={
                                    isPressed
                                        ? () => togglePinning(tabId, tab)
                                        : () => selectTab(tabId)
                                }
                                key={tabId}
                            >
                                <span
                                    className={`tabbed-ui__icon tabbed-ui__icon_${title.replace(" ", "-").toLowerCase()}`}
                                ></span>
                                <span
                                    aria-hidden={pinnedTab ? "true" : "false"}
                                >
                                    {title}
                                </span>
                            </Reorder.Item>
                        );
                    })}
                </Reorder.Group>

                <button
                    className="tabbed-ui__menu-button"
                    id="menu-button"
                    title="Show more tabs"
                    aria-label="Show more tabs"
                    aria-controls="hidden-menu"
                    aria-expanded={isMenuVisible ? "true" : "false"}
                    ref={menuButtonRef}
                    onClick={() => setMenuVisible((prev) => !prev)}
                    onKeyDown={(event) => {
                        if (event.key !== "ArrowDown") return;

                        event.preventDefault();
                        firstHiddenRef.current?.focus();
                    }}
                ></button>

                <div
                    className={`tabbed-ui__menu ${isMenuVisible ? "tabbed-ui__menu_visible" : ""}`.trim()}
                    id="hidden-menu"
                    role="tablist"
                    aria-labelledby="menu-button"
                    onKeyDown={(event) => moveFocus(event, true)}
                    ref={hiddenMenuRef}
                >
                    {targetTabs.hidden.map((tab, index) => {
                        const { tabId, panelId, title } = tab;

                        return (
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
                                ref={index === 0 ? firstHiddenRef : undefined}
                                key={tabId}
                            >
                                <span
                                    className={`tabbed-ui__icon tabbed-ui__icon_${title.replace(" ", "-").toLowerCase()}`}
                                ></span>
                                <span>{title}</span>
                            </button>
                        );
                    })}
                </div>
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
