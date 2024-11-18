export enum NotificationType {
  INFO = "info",
  NEW_ORDER_IN_AUCTION = "new_order_in_auction",
  NEW_ORDER_IN_BIDDING = "new_order_in_bidding",
  NEW_ORDER_IN_DIRECT = "new_order_in_direct",
  NEW_ORDER_BEING_EXECUTED = "new_order_being_executed",
  ORDER_CANCELLED = "order_cancelled",
  POPUP_NOTIFICATION = "popup_notification",
}

export type TNotification = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  type: NotificationType;
};
