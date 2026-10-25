import { useEffect, useState } from "react";

function Preloader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Let the truck complete its continuous pass,
    // then fade the preloader out.
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`preloader ${
        isExiting ? "preloader-exiting" : ""
      }`}
      aria-hidden="true"
    >
      <div className="preloader-scene">

        {/* HireD Logo */}
        <div className="preloader-brand">
          <img
            src="/logo-transparent.png"
            alt="HireD"
            className="preloader-logo"
          />
        </div>

        {/* Truck */}
        <div className="preloader-truck">
          <img
            src="/truck.png"
            alt=""
            className="preloader-truck-image"
          />
        </div>

        {/* Ground shadow */}
        <div className="preloader-ground-shadow" />

      </div>
    </div>
  );
}

export default Preloader;
