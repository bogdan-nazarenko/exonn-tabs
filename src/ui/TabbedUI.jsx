import "./TabbedUI.scss";

const TabbedUI = () => {
    return (
        <div className="tabbed-ui">
            <div className="tabbed-ui__tab-bar" role="tablist">
                <div className="tabbed-ui__group">
                    <button role="tab" tabIndex={-1}></button>
                    <button aria-label="Close tab"></button>
                </div>
            </div>

            <div className="tabbed-ui__content">
                <div
                    className="tabbed-ui__panel"
                    role="tabpanel"
                    tabIndex={0}
                ></div>
            </div>
        </div>
    );
};

export default TabbedUI;
