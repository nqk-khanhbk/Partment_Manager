package com.example.department_manager.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://localhost:3000")
public class AialertController {

    // Static variable to store the latest alert data
    private static Map<String, Object> alertData = new HashMap<>();

    // Static list to store notifications
    private static List<String> notifications = new ArrayList<>();

    @PostMapping("/alert")
    public ResponseEntity<Map<String, Object>> receiveAlert(@RequestBody AlertRequest request) {
        // Update the static variable with new data
        alertData.put("free_positions", request.getFreePositions());
        alertData.put("total_free", request.getFreePositions().size());

        return ResponseEntity.ok(alertData);
    }

    @GetMapping("/alert")
    public ResponseEntity<Map<String, Object>> getAlertData() {
        return ResponseEntity.ok(alertData);
    }

    @PostMapping("/notification")
    public ResponseEntity<Map<String, Object>> receiveNotification(@RequestBody NotificationRequest request) {
        // Add the notification to the list
        notifications.add(request.getMessage());

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Notification received");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/notification")
    public ResponseEntity<List<String>> getNotifications() {
        return ResponseEntity.ok(notifications);
    }
}

// Request DTOs
@Data
class AlertRequest {
    private List<Integer> freePositions = new ArrayList<>();
}

@Data
class NotificationRequest {
    private String message;
}