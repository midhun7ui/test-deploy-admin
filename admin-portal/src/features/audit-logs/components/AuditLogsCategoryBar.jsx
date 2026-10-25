import PropTypes from "prop-types";

export default function AuditLogsCategoryBar({
  categories,
  activeCategory,
  onSelectCategory,
  isLiveTailActive,
  onToggleLiveTail,
}) {
  return (
    <div className="audit-category-tail-bar" id="audit-logs-category-bar">
      {/* Category Tabs */}
      <div className="audit-categories-scroll-group" role="tablist">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`audit-cat-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
              id={`cat-btn-${cat.id}`}
            >
              <span>{cat.label}</span>
              <span className="audit-cat-count-pill">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Live Tail Controller */}
      <div className="audit-live-tail-pill" title="Live tail websocket streaming status">
        <span
          className="audit-pulse-dot"
          style={{ backgroundColor: isLiveTailActive ? "var(--audit-primary-container)" : "var(--audit-outline)" }}
        />
        <span>{isLiveTailActive ? "Live Tail: 5s Poll" : "Stream Paused"}</span>
        <button
          type="button"
          className="audit-btn-pause-stream"
          onClick={onToggleLiveTail}
          title={isLiveTailActive ? "Pause live tail stream" : "Resume live tail stream"}
          id="btn-toggle-live-tail"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            {isLiveTailActive ? "pause_circle" : "play_circle"}
          </span>
        </button>
      </div>
    </div>
  );
}

AuditLogsCategoryBar.propTypes = {
  categories: PropTypes.array.isRequired,
  activeCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  isLiveTailActive: PropTypes.bool.isRequired,
  onToggleLiveTail: PropTypes.func.isRequired,
};
