export interface CommonEvent {
  channel?: string; // Channel listening
  action?: string; // Method call
  payload?: any; // Input data
  options?: any; // Input options
  from?: string; // From what compoent support debugs
  // methods
  onStart?: any; // Return call back on start
  onDone?: any; // Return call back output
  onError?: any; // Return callback error
}
