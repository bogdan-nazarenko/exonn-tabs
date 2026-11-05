import tabs from "@data/tabs";
import "./TabbedUI.scss";

const TabbedUI = () => {
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
                                aria-selected="false"
                                tabIndex={-1}
                            >
                                {title}
                            </button>
                            <button aria-label="Close tab"></button>
                        </div>
                    );
                })}
            </div>

            <div className="tabbed-ui__content">
                {tabs.map((tab) => {
                    const { tabId, panelId } = tab;

                    return (
                        <div
                            className="tabbed-ui__panel"
                            id={panelId}
                            role="tabpanel"
                            aria-labelledby={tabId}
                            tabIndex={0}
                            key={panelId}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default TabbedUI;
