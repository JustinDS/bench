export enum UserRole {
  Free = 0,
  Premium = 1,
  // Admin = 2, etc.
}

export enum SubscriptionStatus {
  inactive = "inactive",
  active = "active",
  grace = "grace",
  expired = "expired",
  cancelled = "cancelled",
  paused = "paused",
}
