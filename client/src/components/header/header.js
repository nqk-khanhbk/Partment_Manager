import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Stack,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Alert,
} from "@mui/material";
import { BsBell, BsChatDots } from "react-icons/bs";
import AccountMenu from "./accountMenu";
import { getCookie } from "../../helper/cookies.helper";
import { listFireAlert } from "../../service/parking.service";

const Header = () => {
  const name = getCookie("name");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await listFireAlert();
      console.log("Notifications response:", response);

      // Kiểm tra nhiều cấu trúc data có thể có
      let notificationData = [];

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        notificationData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        notificationData = response.data;
      } else if (Array.isArray(response)) {
        notificationData = response;
      }

      console.log("Processed notification data:", notificationData);

      if (notificationData.length > 0) {
        const newNotifications = notificationData.map((message, index) => ({
          id: `notification_${Date.now()}_${index}`, // ID duy nhất hơn
          message: message,
          timestamp: new Date(),
          isRead: false,
          type: message.includes("lửa") ? "fire" : "info",
        }));

        console.log("New notifications:", newNotifications);

        // Luôn cập nhật thông báo (bỏ điều kiện so sánh length)
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n) => !n.isRead).length);

        setLastUpdated(new Date());
        setError(null);
      } else {
        // Nếu không có thông báo mới, vẫn cập nhật thời gian
        setLastUpdated(new Date());
        setError(null);
        console.log("No notifications found");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo");
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "fire":
        return "🔥";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "fire":
        return "#f44336";
      default:
        return "#2196f3";
    }
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("Notifications state updated:", notifications);
    console.log("Unread count:", unreadCount);
  }, [notifications, unreadCount]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#C02135" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            src="/assets/images/hust.png"
            alt="logo"
            sx={{ height: 40 }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              BLUEMOON APARTMANT SYSTEM
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              HỆ THỐNG QUẢN LÝ CHUNG CƯ BLUEMOON
            </Typography>
          </Box>
        </Stack>

        {/* Right */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {/* Notification Bell */}
          <IconButton sx={{ color: "white" }} onClick={handleNotificationClick}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              sx={{
                "& .MuiBadge-badge": {
                  animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)" },
                  },
                },
              }}
            >
              <BsBell />
            </Badge>
          </IconButton>

          {/* Notification Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 350,
                maxHeight: 400,
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông báo ({notifications.length})
                </Typography>
                {unreadCount > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={markAllAsRead}
                  >
                    Đánh dấu đã đọc tất cả
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="textSecondary">
                Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ m: 1 }}>
                {error}
              </Alert>
            )}

            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === "development" && (
              <Box sx={{ p: 1, backgroundColor: "#f5f5f5", fontSize: "12px" }}>
                <Typography variant="caption">
                  Debug: {notifications.length} notifications, {unreadCount}{" "}
                  unread
                </Typography>
              </Box>
            )}

            {/* Notifications List */}
            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="textSecondary">
                    Không có thông báo nào
                  </Typography>
                </Box>
              ) : (
                notifications.map((notification, index) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    sx={{
                      backgroundColor: notification.isRead
                        ? "transparent"
                        : "action.hover",
                      borderLeft: `4px solid ${getNotificationColor(
                        notification.type
                      )}`,
                      "&:hover": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box display="flex" alignItems="flex-start" gap={1}>
                        <Typography sx={{ fontSize: "16px" }}>
                          {getNotificationIcon(notification.type)}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notification.isRead
                                ? "normal"
                                : "bold",
                              color: notification.isRead
                                ? "text.secondary"
                                : "text.primary",
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {notification.timestamp.toLocaleTimeString("vi-VN")}
                          </Typography>
                        </Box>
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              mt: 0.5,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Box>

            {/* Footer */}
            {notifications.length > 0 && (
              <Box
                sx={{
                  p: 1,
                  borderTop: 1,
                  borderColor: "divider",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={handleClose}
                >
                  Xem tất cả thông báo
                </Typography>
              </Box>
            )}
          </Menu>

          <IconButton sx={{ color: "white" }}>
            <BsChatDots />
          </IconButton>
          <Typography variant="body1">{name}</Typography>
          <AccountMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
