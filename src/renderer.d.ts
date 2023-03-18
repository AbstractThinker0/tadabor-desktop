export interface IAppAPI {
  getVersion: () => Promise<any>;
}

declare global {
  interface Window {
    app: IAppAPI;
  }
}
