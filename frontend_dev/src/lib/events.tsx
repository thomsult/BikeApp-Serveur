type Callback = (type: "showAlert", payload: any) => void;

const listeners: Map<string, Callback[]> = new Map();

export const modalEmitter = {
  on(cb: Callback) {
    if (!listeners.has("showAlert")) {
      listeners.set("showAlert", []);
    }
    listeners.get("showAlert")!.push(cb);
  },
  off(cb: Callback) {
    const cbs = listeners.get("showAlert");
    if (!cbs) return;
    const index = cbs.indexOf(cb);
    if (index > -1) cbs.splice(index, 1);
  },
  emit(type: "showAlert", payload: any) {
    const cbs = listeners.get(type);
    if (!cbs) return;
    cbs.forEach((cb) => cb(type, payload));
  },
  listenerCount(type: "showAlert") {
    const cbs = listeners.get(type);
    return cbs ? cbs.length : 0;
  },
  removeAllListeners() {
    listeners.clear();
  },
};