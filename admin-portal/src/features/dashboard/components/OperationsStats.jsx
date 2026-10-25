import PropTypes from "prop-types";
import StatCard from "./StatCard";

function OperationsStats({ stats, onStatClick }) {
  if (!stats) return null;

  const {
    totalOrders,
    pendingOrders,
    activeTrips,
    completedTrips,
    availableDrivers,
    busyDrivers,
    pendingDriverOnboarding,
  } = stats;

  return (
    <section className="operations-stats-section" aria-label="Operational KPI Metrics">
      <div className="section-title-row">
        <div>
          <h2 className="section-title">Operational Key Performance Indicators</h2>
          <p className="section-subtitle">
            Live metrics aggregated across 14 enterprise transit corridors and driver dispatch hubs
          </p>
        </div>
        <div className="telemetry-live-pill">
          <span className="live-dot" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      <div className="stats-kpi-grid">
        {/* 1. Total orders */}
        <StatCard
          id={totalOrders.id}
          label={totalOrders.label}
          value={totalOrders.value}
          change={totalOrders.change}
          changeType={totalOrders.changeType}
          periodText={totalOrders.periodText}
          icon={totalOrders.icon}
          theme={totalOrders.theme}
          badge={totalOrders.badge}
          description={totalOrders.description}
          breakdown={totalOrders.breakdown}
          onClick={() => onStatClick?.("totalOrders")}
        />

        {/* 2. Pending orders */}
        <StatCard
          id={pendingOrders.id}
          label={pendingOrders.label}
          value={pendingOrders.value}
          change={pendingOrders.change}
          changeType={pendingOrders.changeType}
          periodText={pendingOrders.periodText}
          icon={pendingOrders.icon}
          theme={pendingOrders.theme}
          badge={pendingOrders.badge}
          description={pendingOrders.description}
          breakdown={pendingOrders.breakdown}
          onClick={() => onStatClick?.("pendingOrders")}
        />

        {/* 3. Active trips */}
        <StatCard
          id={activeTrips.id}
          label={activeTrips.label}
          value={activeTrips.value}
          change={activeTrips.change}
          changeType={activeTrips.changeType}
          periodText={activeTrips.periodText}
          icon={activeTrips.icon}
          theme={activeTrips.theme}
          badge={activeTrips.badge}
          description={activeTrips.description}
          breakdown={activeTrips.breakdown}
          onClick={() => onStatClick?.("activeTrips")}
        />

        {/* 4. Completed trips */}
        <StatCard
          id={completedTrips.id}
          label={completedTrips.label}
          value={completedTrips.value}
          change={completedTrips.change}
          changeType={completedTrips.changeType}
          periodText={completedTrips.periodText}
          icon={completedTrips.icon}
          theme={completedTrips.theme}
          badge={completedTrips.badge}
          description={completedTrips.description}
          breakdown={completedTrips.breakdown}
          onClick={() => onStatClick?.("completedTrips")}
        />

        {/* 5. Available drivers */}
        <StatCard
          id={availableDrivers.id}
          label={availableDrivers.label}
          value={availableDrivers.value}
          change={availableDrivers.change}
          changeType={availableDrivers.changeType}
          periodText={availableDrivers.periodText}
          icon={availableDrivers.icon}
          theme={availableDrivers.theme}
          badge={availableDrivers.badge}
          description={availableDrivers.description}
          breakdown={availableDrivers.breakdown}
          onClick={() => onStatClick?.("availableDrivers")}
        />

        {/* 6. Busy drivers */}
        <StatCard
          id={busyDrivers.id}
          label={busyDrivers.label}
          value={busyDrivers.value}
          change={busyDrivers.change}
          changeType={busyDrivers.changeType}
          periodText={busyDrivers.periodText}
          icon={busyDrivers.icon}
          theme={busyDrivers.theme}
          badge={busyDrivers.badge}
          description={busyDrivers.description}
          breakdown={busyDrivers.breakdown}
          onClick={() => onStatClick?.("busyDrivers")}
        />

        {/* 7. Pending driver onboarding */}
        <StatCard
          id={pendingDriverOnboarding.id}
          label={pendingDriverOnboarding.label}
          value={pendingDriverOnboarding.value}
          change={pendingDriverOnboarding.change}
          changeType={pendingDriverOnboarding.changeType}
          periodText={pendingDriverOnboarding.periodText}
          icon={pendingDriverOnboarding.icon}
          theme={pendingDriverOnboarding.theme}
          badge={pendingDriverOnboarding.badge}
          description={pendingDriverOnboarding.description}
          breakdown={pendingDriverOnboarding.breakdown}
          onClick={() => onStatClick?.("pendingDriverOnboarding")}
        />
      </div>
    </section>
  );
}

OperationsStats.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.object.isRequired,
    pendingOrders: PropTypes.object.isRequired,
    activeTrips: PropTypes.object.isRequired,
    completedTrips: PropTypes.object.isRequired,
    availableDrivers: PropTypes.object.isRequired,
    busyDrivers: PropTypes.object.isRequired,
    pendingDriverOnboarding: PropTypes.object.isRequired,
  }),
  onStatClick: PropTypes.func,
};

export default OperationsStats;
