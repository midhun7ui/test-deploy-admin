import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const COMMAND_ITEMS = [
  {
    id: "cmd-dash",
    category: "Navigation",
    title: "Go to Operations Dashboard",
    subtitle: "Overview of all 14 transit corridors",
    icon: "dashboard",
    path: "/dashboard",
    type: "nav",
  },
  {
    id: "cmd-orders",
    category: "Navigation",
    title: "Open Orders Management",
    subtitle: "Review incoming partner orders and quotes",
    icon: "shopping_bag",
    path: "/orders",
    type: "nav",
  },
  {
    id: "cmd-trips",
    category: "Navigation",
    title: "Open B2B Trips Control Room",
    subtitle: "Live telemetry, driver assignment & tracking",
    icon: "local_shipping",
    path: "/trips",
    type: "nav",
  },
  {
    id: "cmd-drivers",
    category: "Navigation",
    title: "Open Driver Management & KYC",
    subtitle: "Roster, documents audit & verification",
    icon: "badge",
    path: "/drivers",
    type: "nav",
  },
  {
    id: "cmd-vehicles",
    category: "Navigation",
    title: "Open Vehicle Management",
    subtitle: "Fleet compliance, RC & vehicle verification",
    icon: "commute",
    path: "/vehicles",
    type: "nav",
  },
  {
    id: "cmd-support",
    category: "Navigation",
    title: "B2B Partner Support & Operations Desk",
    subtitle: "Operations desk, live sync tickets & partner problem resolution",
    icon: "support_agent",
    path: "/support",
    type: "nav",
  },
  {
    id: "cmd-payouts",
    category: "Finance",
    title: "Driver Settlements & Payouts",
    subtitle: "Disbursement batches and dual verification",
    icon: "account_balance_wallet",
    path: "/payouts",
    type: "finance",
  },
  {
    id: "cmd-invoices",
    category: "Finance",
    title: "Monthly Invoicing & Statements",
    subtitle: "Tax invoices and published corporate statements",
    icon: "receipt_long",
    path: "/invoicing",
    type: "finance",
  },
  {
    id: "cmd-quick-order",
    category: "Quick Actions",
    title: "Create / Dispatch New Order",
    subtitle: "Manual booking entry for enterprise partner",
    icon: "add_circle",
    type: "action",
  },
  {
    id: "cmd-onboard-driver",
    category: "Quick Actions",
    title: "Onboard Driver & Verify KYC",
    subtitle: "Review DL, RC & police clearance certificate",
    icon: "person_add",
    type: "action",
  },
];

function CommandPaletteModal({ isOpen, onClose, onSelectAction, onNavigate }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        handleModalClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function handleModalClose() {
    setSearch("");
    onClose();
  }

  const filteredItems = useMemo(() => {
    if (!search.trim()) return COMMAND_ITEMS;
    const query = search.toLowerCase();
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop command-backdrop" onClick={handleModalClose}>
      <div
        className="command-palette-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command search palette"
      >
        <div className="command-input-wrapper">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            ref={inputRef}
            type="text"
            className="command-search-input"
            placeholder="Type a command or search modules, orders, drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="input-command-palette"
          />
          <kbd className="command-esc-chip" onClick={handleModalClose}>
            ESC
          </kbd>
        </div>

        <div className="command-results-list">
          {filteredItems.length === 0 ? (
            <div className="command-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>No results found for &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="command-item-row"
                onClick={() => {
                  if (typeof onSelectAction === "function") {
                    onSelectAction(item);
                  } else if (typeof onNavigate === "function" && item.path) {
                    onNavigate(item.path);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                  handleModalClose();
                }}
                role="button"
                tabIndex={0}
              >
                <div className="command-icon-box">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="command-item-content">
                  <div className="command-item-title-row">
                    <strong className="command-item-title">{item.title}</strong>
                    <span className="command-item-category">{item.category}</span>
                  </div>
                  <span className="command-item-sub">{item.subtitle}</span>
                </div>
                <span className="material-symbols-outlined arrow-icon">
                  arrow_forward
                </span>
              </div>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <span>Navigate with arrows or click · Press ESC to close</span>
          <span className="brand-micro">HireD Central Ops</span>
        </div>
      </div>
    </div>
  );
}

CommandPaletteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectAction: PropTypes.func,
  onNavigate: PropTypes.func,
};

export default CommandPaletteModal;
