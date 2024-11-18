type Subscription = {
  id: number;
  codename: string;
  name: string;
  price: number;
  days_without_payment: number;
};

export type CustomerSubscription = Subscription;
export type TransporterSubscription = {
  win_percentage_fee: number;
} & Subscription;
