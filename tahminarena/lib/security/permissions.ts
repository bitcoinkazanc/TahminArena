export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete";

export type PermissionResource =
  | "profile"
  | "prediction"
  | "comment"
  | "coupon"
  | "chat"
  | "notification"
  | "report";

type PermissionContext = {
  userId?: string | null;
  resourceOwnerId?: string | null;
  isAdmin?: boolean;
};

export function canPerformAction(
  action: PermissionAction,
  resource: PermissionResource,
  context: PermissionContext,
): boolean {
  if (context.isAdmin) {
    return true;
  }

  if (!context.userId) {
    return action === "view";
  }

  if (
    action === "view" &&
    resource !== "notification"
  ) {
    return true;
  }

  if (
    action === "create" &&
    resource !== "profile"
  ) {
    return true;
  }

  if (
    action === "update" ||
    action === "delete"
  ) {
    return Boolean(
      context.resourceOwnerId &&
        context.resourceOwnerId ===
          context.userId,
    );
  }

  return false;
}

export function canViewPrivateProfile(
  viewerId: string | null | undefined,
  profileOwnerId: string,
): boolean {
  if (!viewerId) {
    return false;
  }

  return viewerId === profileOwnerId;
}

export function canModifyResource(
  userId: string | null | undefined,
  resourceOwnerId: string,
): boolean {
  if (!userId) {
    return false;
  }

  return userId === resourceOwnerId;
}

export function canAccessAdminResource(
  isAdmin: boolean,
): boolean {
  return isAdmin;
}