/**
 * Notifications via Socket.IO only.
 *
 * All notification operations (get, mark read, mark all, delete) are handled
 * through Socket.IO events. This file is intentionally empty of RTK Query
 * endpoints to avoid duplicate state management.
 *
 * Socket events (client → server):
 *   notifications:get      { page, limit }
 *   notification:read      { notificationId }
 *   notification:readAll   {}
 *   notification:delete    { notificationId }
 *
 * Socket events (server → client):
 *   notifications:loaded   { notifications[], meta }
 *   notification:new       { notification }
 *   notification:updated   { notification }
 *   notification:deleted   { notificationId }
 *   notifications:allRead  {}
 */
export {};
