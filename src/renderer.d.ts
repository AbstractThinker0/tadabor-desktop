export interface IAppAPI {
  getVersion: () => Promise<string>;
}

declare global {
  interface Window {
    app: IAppAPI;
  }
}
