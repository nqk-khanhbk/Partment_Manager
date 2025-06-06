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
}

// Request DTO
@Data
class AlertRequest {
    private List<Integer> freePositions = new ArrayList<>();
}