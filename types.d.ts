declare global {
    interface Window {
      loadPyodide: (options: { indexURL: string }) => Promise<any>;
    }
  }

  declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
      constructor();
    }
    export default WebpackWorker;
  }

  declare module "pyodide" {
    export interface PyodideInterface {
        runPythonAsync: (code: string) => any;
    }
    
    export function loadPyodide(options?: { indexURL: string }): Promise<PyodideInterface>;
}

export {};