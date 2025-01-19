"use client";
import { robotApi } from "./api";
import React, { useState } from "react";
import {
  FaCircle,
  FaSquare,
  FaSlidersH,
  FaExclamationTriangle,
  FaUndo,
} from "react-icons/fa";

const RobotControlPanel = () => {
  const [status, setStatus] = useState("Idle");
  const [latestNotification, setLatestNotification] = useState("");
  const [servoPositions, setServoPositions] = useState([
    90, 180, 180, 120, 0, 0,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleServoChange = async (index, value) => {
    try {
      setIsLoading(true);
      const response = await robotApi.setServoPosition(index, parseInt(value));
      const newPositions = [...servoPositions];
      newPositions[index] = parseInt(value);
      setServoPositions(newPositions);
      setLatestNotification("Servo position updated successfully");
    } catch (error) {
      setLatestNotification(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickPackage = async (shape) => {
    try {
      setIsLoading(true);
      setActiveButton(shape);
      setStatus(`Picking ${shape} package...`);
      const response = await robotApi.pickPackage(shape);
      setLatestNotification(`Picking ${shape} package`);

      setTimeout(() => {
        setStatus("Idle");
        setActiveButton(null);
      }, 1000);
    } catch (error) {
      setLatestNotification(`Error: ${error.message}`);
      setStatus("Error");
      setActiveButton(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPosition = async () => {
    try {
      setIsLoading(true);
      setStatus("Resetting to initial position...");
      const response = await robotApi.setInitialPosition();
      setLatestNotification("Reset to initial position");
      setStatus("Idle");
      // Reset servo positions to initial values
      setServoPositions([90, 180, 180, 120, 0, 0]);
    } catch (error) {
      setLatestNotification(`Error: ${error.message}`);
      setStatus("Error");
    } finally {
      setIsLoading(false);
      setShowResetConfirm(false);
    }
  };

  // Rest of the JSX remains the same as in the previous version
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="container mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          RoboArm Control Panel
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg transition-all duration-200 
                    ${
                      activeButton === value
                        ? "bg-blue-600 transform scale-95"
                        : "hover:bg-gray-700 active:transform active:scale-95"
                    }
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
              <div className="relative">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 
                  bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FaUndo className="w-4 h-4" />
                  Reset to Initial Position
                </button>

                {/* Reset Confirmation Dialog */}
                {showResetConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Reset Robot Position
                      </h3>
                      <p className="text-gray-300 mb-4">
                        This will move all servos back to their initial
                        positions. Are you sure you want to continue?
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleResetPosition}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                    : status === "Error"
                    ? "bg-red-700 text-red-200"
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
