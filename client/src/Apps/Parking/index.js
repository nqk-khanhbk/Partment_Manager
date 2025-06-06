import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { listParking } from "../../service/parking.service";

const Parking = () => {
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Định nghĩa layout các hàng đậu xe
  const parkingRows = [
    { name: "Hàng A", spots: Array.from({ length: 11 }, (_, i) => i + 1) },
    { name: "Hàng B", spots: Array.from({ length: 12 }, (_, i) => i + 12) },
    { name: "Hàng C", spots: Array.from({ length: 11 }, (_, i) => i + 24) },
    { name: "Hàng D", spots: Array.from({ length: 11 }, (_, i) => i + 35) },
    { name: "Hàng E", spots: Array.from({ length: 12 }, (_, i) => i + 46) },
    { name: "Hàng F", spots: Array.from({ length: 12 }, (_, i) => i + 58) },
  ];

  const totalSpots = 69;

  useEffect(() => {
    fetchParkingData();
    // Refresh data every 3 seconds
    const interval = setInterval(() => {
      fetchParkingData(false); // false = không hiển thị loading
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchParkingData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await listParking();
      console.log("Parking data response:", response);

      // Xử lý cấu trúc data mới
      if (response.data && response.data.data) {
        setParkingData(response.data.data);
        setLastUpdated(new Date());
      } else {
        setParkingData(response.data);
        setLastUpdated(new Date());
      }

      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu bãi đậu xe");
      console.error("Error fetching parking data:", err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const isSpotFree = (spotNumber) => {
    if (!parkingData || !parkingData.free_positions) return false;
    return parkingData.free_positions.includes(spotNumber);
  };

  const ParkingSpot = ({ spotNumber, isFree }) => (
    <Box
      sx={{
        width: 50,
        height: 50,
        border: 2,
        borderColor: isFree ? "#4CAF50" : "#F44336",
        backgroundColor: isFree ? "#E8F5E8" : "#FFEBEE",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 2,
        },
      }}
    >
      <DirectionsCarIcon
        sx={{
          color: isFree ? "#4CAF50" : "#F44336",
          fontSize: 20,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: -18,
          fontSize: "10px",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        {spotNumber}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  const totalFree = parkingData?.total_free || 0;
  const totalOccupied = totalSpots - totalFree;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 3,
          mb: 3,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#C01235",
            textAlign: "center",
            mb: 2,
          }}
        >
          Quản Lý Bãi Đậu Xe
        </Typography>

        {/* Statistics */}
        <Box display="flex" justifyContent="center" gap={4} sx={{ mb: 2 }}>
          <Chip
            label={`Tổng: ${totalSpots} chỗ`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Trống: ${totalFree} chỗ`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`Đã đậu: ${totalOccupied} chỗ`}
            color="error"
            variant="outlined"
          />
        </Box>

        {/* Real-time indicator */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          />
          <Typography variant="caption" color="textSecondary">
            Cập nhật mỗi 3 giây - Lần cuối:{" "}
            {lastUpdated.toLocaleTimeString("vi-VN")}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Parking Layout */}
      <Paper
        sx={{
          p: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          minHeight: "500px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Sơ Đồ Bãi Đậu Xe
        </Typography>

        {/* Legend */}
        <Box display="flex" justifyContent="center" gap={4} sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCarIcon sx={{ color: "#4CAF50", fontSize: 20 }} />
            <Typography variant="body2">Chỗ trống</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCarIcon sx={{ color: "#F44336", fontSize: 20 }} />
            <Typography variant="body2">Đã đậu xe</Typography>
          </Box>
        </Box>

        {/* Parking Rows */}
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {parkingRows.map((row, rowIndex) => (
            <Box key={row.name} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#666",
                  textAlign: "center",
                }}
              >
                {row.name}
              </Typography>

              <Box
                display="flex"
                justifyContent="center"
                gap={1}
                sx={{ position: "relative" }}
              >
                {row.spots.map((spotNumber, index) => {
                  // Tạo lỗ hổng ở giữa hàng
                  const shouldAddGap =
                    (row.spots.length === 11 && index === 5) ||
                    (row.spots.length === 12 && index === 6);

                  return (
                    <Box key={spotNumber} display="flex" alignItems="center">
                      <ParkingSpot
                        spotNumber={spotNumber}
                        isFree={isSpotFree(spotNumber)}
                      />
                      {shouldAddGap && (
                        <Box
                          sx={{
                            width: 40,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            |
                          </Typography>
                        </Box>
                      )}
                      {index < row.spots.length - 1 && !shouldAddGap && (
                        <Box sx={{ width: 4 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Debug info */}
        {process.env.NODE_ENV === "development" && parkingData && (
          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "#e0e0e0", borderRadius: 1 }}
          >
            <Typography variant="caption" component="div">
              Debug - Chỗ trống: [{parkingData.free_positions?.join(", ")}]
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Parking;
