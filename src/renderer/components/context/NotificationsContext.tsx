import { createContext }             from 'react';
import { NotificationItemInterface } from '../../classes/Notifications';

export const NotificationsContext = createContext<{ notificationList: NotificationItemInterface[] }>({ notificationList: [] }
);
