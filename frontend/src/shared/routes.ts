enum Routes {
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD_CONFIRM = "/reset-password-confirm/:token",
  FIND_CARGO = "/find-cargo",

  HOME = "/",
  NEW_ORDER = "/new-order",
  EDIT_ORDER = "/edit-order/:transportationNumber",
  PROFILE = "/cabinet",
  CARGO_PLAN = "/cargo-plan",

  ORDERS_IN_AUCTION = "/orders_in_auction",
  ORDERS_IN_BIDDING = "/orders_in_bidding",
  ORDERS_IN_DIRECT = "/orders_in_direct",
  ORDERS_BEING_EXECUTED = "/orders_being_executed",

  CANCELLED_ORDERS = "/cancelled_orders",
  UNPUBLISHED_ORDERS = "/unpublished_orders",
}

export default Routes;
