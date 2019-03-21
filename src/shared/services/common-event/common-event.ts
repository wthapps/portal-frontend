export interface CommonEvent {
  channel?: string; // Channel listening
  action?: string; // Method call
  payload?: any; // Input data
  options?: any; // Input options
  done?: any; // Return call back output
  error?: any; // Return callback error
  from?: string; // From what compoent support debugs
}
