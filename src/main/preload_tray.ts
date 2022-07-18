import { contextBridge } from 'electron';
import { bridge }        from './preload';

contextBridge.exposeInMainWorld('electron', { ...bridge, tray: true });
