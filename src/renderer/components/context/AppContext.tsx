import { createContext }             from 'react';
import { NotificationItemInterface } from '../../classes/Notifications';

export const AppContext = createContext({
											toast           : null,
											showNotify      : false,
											setShowNotify   : () => {},
											notificationList: []
										} as {
											toast: any,
											showNotify: boolean,
											setShowNotify: (...args: any[]) => void,
											notificationList: NotificationItemInterface[],
										}
);
