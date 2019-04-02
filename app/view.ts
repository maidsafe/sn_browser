import { BrowserView, app, Menu, BrowserWindow } from 'electron';
import path from 'path';
import { ViewManager } from './view-manager';
// import { appPath } from '$Constants';
import { logger } from '$Logger';
import { addNotification } from '$Actions/notification_actions';

export class View extends BrowserView {
  public title: string = '';

  public url: string = '';

  public tabId: number;

  public homeUrl: string;

  private mainWindow: BrowserWindow;

  private viewManager: ViewManager;

  public constructor(
    id: number,
    url: string,
    mainWindow: BrowserWindow,
    viewManager: ViewManager
  ) {
    super({
      webPreferences: {
        preload: `${path.join(__dirname, '/webPreload.prod.js')}`,
        nodeIntegration: true,
        additionalArguments: [`--tab-id=${id}`],
        contextIsolation: false,
        partition: 'persist:safe-tab'
      }
    });

    logger.info(
      'PRELOAD PATHHHH: file://',
      path.join(__dirname, 'webPreload.prod.js')
    );
    this.homeUrl = url;
    this.tabId = id;
    this.mainWindow = mainWindow;
    this.viewManager = viewManager;

    this.webContents.on('context-menu', (e, params) => {
      const menu = Menu.buildFromTemplate([
        {
          id: 'inspect',
          label: 'Inspect Element',
          click: () => {
            this.webContents.inspectElement(params.x, params.y);

            if (this.webContents.isDevToolsOpened()) {
              this.webContents.devToolsWebContents.focus();
            }
          }
        }
      ]);

      menu.popup();
    });

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
      mainWindow.webContents.send(`view-loading-${this.tabId}`, false);
    });

    this.webContents.addListener(
      'did-fail-load',
      (_event, _code, description: string, url: string) => {
        if (description === 'ERR_BLOCKED_BY_CLIENT') {
          const notification = {
            title: 'Blocked URL',
            body: url
          };
          viewManager.store.dispatch(addNotification(notification));
        }
      }
    );

    this.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState();
      mainWindow.webContents.send(`view-loading-${this.tabId}`, true);
    });

    this.webContents.addListener('did-start-navigation', () => {
      this.updateNavigationState();

      this.emitWebNavigationEvent('onBeforeNavigate', {
        tabId: this.tabId,
        url: this.webContents.getURL(),
        frameId: 0,
        timeStamp: Date.now(),
        processId: process.pid,
        parentFrameId: -1
      });

      this.emitWebNavigationEvent('onCommitted', {
        tabId: this.tabId,
        url,
        sourceFrameId: 0,
        timeStamp: Date.now(),
        processId: process.pid,
        frameId: 0,
        parentFrameId: -1
      });
    });

    this.webContents.addListener('did-finish-load', async () => {
      this.emitWebNavigationEvent('onCompleted', {
        tabId: this.tabId,
        url: this.webContents.getURL(),
        frameId: 0,
        timeStamp: Date.now(),
        processId: process.pid
      });

      mainWindow.webContents.send(
        `new-screenshot-${this.tabId}`,
        await this.getScreenshot()
      );
    });

    this.webContents.addListener('did-frame-finish-load', async () => {
      mainWindow.webContents.send(
        `new-screenshot-${this.tabId}`,
        await this.getScreenshot()
      );
    });

    this.webContents.addListener(
      'new-window',
      (e, url, frameName, disposition) => {
        if (disposition === 'new-window' || disposition === 'foreground-tab') {
          mainWindow.webContents.send('api-tabs-create', { url, active: true });
        } else if (disposition === 'background-tab') {
          mainWindow.webContents.send('api-tabs-create', {
            url,
            active: false
          });
        }

        this.emitWebNavigationEvent('onCreatedNavigationTarget', {
          tabId: this.tabId,
          url,
          sourceFrameId: 0,
          timeStamp: Date.now()
        });
      }
    );

    this.webContents.addListener('dom-ready', () => {
      this.emitWebNavigationEvent('onDOMContentLoaded', {
        tabId: this.tabId,
        url: this.webContents.getURL(),
        frameId: 0,
        timeStamp: Date.now(),
        processId: process.pid
      });
    });

    this.webContents.addListener(
      'page-favicon-updated',
      async (e, favicons) => {
        mainWindow.webContents.send(
          `browserview-favicon-updated-${this.tabId}`,
          favicons[0]
        );
      }
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      mainWindow.webContents.send(
        `browserview-theme-color-updated-${this.tabId}`,
        color
      );
    });

    (this.webContents as any).addListener(
      'certificate-error',
      (
        event: Electron.Event,
        url: string,
        error: string,
        certificate: Electron.Certificate,
        callback: Function
      ) => {
        console.log(certificate, error, url);
        // TODO: properly handle insecure websites.
        event.preventDefault();
        callback(true);
      }
    );

    this.setAutoResize({ width: true, height: true });
    this.webContents.loadURL(url);
  }

  public updateNavigationState() {
    if (this.isDestroyed()) return;

    if (this.viewManager.selectedId === this.tabId) {
      this.mainWindow.webContents.send('update-navigation-state', {
        canGoBack: this.webContents.canGoBack(),
        canGoForward: this.webContents.canGoForward()
      });
    }
  }

  public emitWebNavigationEvent = (name: string, ...data: Array<any>) => {
    this.webContents.send(`api-emit-event-webNavigation-${name}`, ...data);
  };

  public async getScreenshot(): Promise<string> {
    return new Promise((resolve) => {
      this.webContents.capturePage((img) => {
        resolve(img.toDataURL());
      });
    });
  }
}
