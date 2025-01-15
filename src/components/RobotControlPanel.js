"use client";
import React, { useState } from "react";
import {
  FaCircle,
  FaSquare,
  FaPlay,
  FaPause,
  FaSlidersH,
  FaExclamationTriangle,
} from "react-icons/fa";

const RobotControlPanel = () => {
  const [status, setStatus] = useState("Idle");
  const [latestNotification, setLatestNotification] = useState("");
  const [servoPositions, setServoPositions] = useState([90, 90, 90, 90, 90]);
  const [isConveyorRunning, setIsConveyorRunning] = useState(true);
  const [activeButton, setActiveButton] = useState(null);

  const handlePickPackage = (shape) => {
    setActiveButton(shape);
    setStatus(`Positioning ${shape} package...`);
    setLatestNotification(`Positioned ${shape} package successfully.`);

    setTimeout(() => {
      setStatus("Idle");
      setActiveButton(null);
    }, 1000);
  };

  const handleToggleConveyor = () => {
    const newState = !isConveyorRunning;
    setIsConveyorRunning(newState);
    setStatus(
      newState ? "Starting conveyor belt..." : "Stopping conveyor belt..."
    );
    setLatestNotification(
      newState ? "Conveyor belt started." : "Conveyor belt stopped."
    );

    setTimeout(() => {
      setStatus(newState ? "Conveyor running" : "Conveyor stopped");
    }, 1000);
  };

  const handleServoChange = (index, value) => {
    const newPositions = [...servoPositions];
    newPositions[index] = parseInt(value);
    setServoPositions(newPositions);
    setLatestNotification(`Servo ${index + 1} moved to position ${value}°`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="container mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Robot Arm Control Panel
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Robot Arm Visualization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaSlidersH className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Robot Arm</h2>
            </div>
            <div className="relative w-full rounded-lg overflow-hidden">
              <img
                src="/images/arm.jpg"
                alt="Robot Arm"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Servo Controls */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaSlidersH className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Servo Controls</h2>
            </div>
            <div className="space-y-6">
              {servoPositions.map((position, index) => (
                <div key={index} className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Servo {index + 1}
                    </span>
                    <span className="text-sm text-gray-300">{position}°</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={position}
                    onChange={(e) => handleServoChange(index, e.target.value)}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Package Controls */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Package Controls</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: FaCircle, label: "Circle", value: "circle" },
                  { icon: FaSquare, label: "Square", value: "square" },
                  {
                    icon: FaExclamationTriangle,
                    label: "Triangle",
                    value: "triangle",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <button
                    key={label}
                    onClick={() => handlePickPackage(value)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg transition-all duration-200 
                    ${
                      activeButton === value
                        ? "bg-blue-600 transform scale-95"
                        : "hover:bg-gray-700 active:transform active:scale-95"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        activeButton === value ? "text-blue-300" : ""
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleToggleConveyor}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 
                ${
                  isConveyorRunning
                    ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                }`}
              >
                {isConveyorRunning ? (
                  <FaPause className="w-4 h-4" />
                ) : (
                  <FaPlay className="w-4 h-4" />
                )}
                {isConveyorRunning
                  ? "Stop Conveyor Belt"
                  : "Start Conveyor Belt"}
              </button>
            </div>
          </div>

          {/* Status and Latest Notification */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  status === "Idle"
                    ? "bg-green-700 text-green-200"
                    : "bg-yellow-700 text-yellow-200"
                }`}
              >
                {status}
              </div>
              {latestNotification && (
                <div className="space-y-2">
                  <h3 className="font-medium">Latest Action</h3>
                  <div className="p-3 bg-gray-700 rounded-lg text-sm">
                    {latestNotification}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotControlPanel;
