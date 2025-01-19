import axios from "axios";

const API_BASE_URL = "http://192.168.43.94:3000/api";

export const robotApi = {
  setServoPosition: async (servoId, position) => {
    return axios.post(`${API_BASE_URL}/servo`, {
      servo_id: servoId,
      position: position,
    });
  },

  setConveyorState: async (running) => {
    return axios.post(`${API_BASE_URL}/conveyor`, {
      running: running,
    });
  },

  pickPackage: async (shape) => {
    return axios.post(`${API_BASE_URL}/pick-package`, {
      shape: shape,
    });
  },

  setInitialPosition: async () => {
    return axios.post(`${API_BASE_URL}/initial-position`);
  },
};
