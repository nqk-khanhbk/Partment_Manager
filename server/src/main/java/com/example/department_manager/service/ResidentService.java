package com.example.department_manager.service;

import com.example.department_manager.constant.ResidentEnum;
import com.example.department_manager.dto.request.ResidentCreateRequest;
import com.example.department_manager.dto.request.ResidentUpdateRequest;
import com.example.department_manager.dto.response.ApiResponse;
import com.example.department_manager.dto.response.PaginatedResponse;
import com.example.department_manager.entity.Apartment;
import com.example.department_manager.entity.Resident;
import com.example.department_manager.entity.Vehicle;
import com.example.department_manager.repository.ApartmentRepository;
import com.example.department_manager.repository.ResidentRepository;
import com.example.department_manager.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResidentService {
    ResidentRepository residentRepository;
    ApartmentRepository apartmentRepository;
    VehicleRepository vehicleRepository;

    public PaginatedResponse<Resident> fetchAllResidents(Specification<Resident> spec, Pageable pageable) {
        //Page<Resident> pageResident = this.residentRepository.findAll(spec, pageable);
        Specification<Resident> notMovedSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("status"), ResidentEnum.Moved);

        Specification<Resident> combinedSpec = spec == null ? notMovedSpec : spec.and(notMovedSpec);

        Page<Resident> pageResident = this.residentRepository.findAll(combinedSpec, pageable);

        PaginatedResponse<Resident> page = new PaginatedResponse<>();
        page.setPageSize(pageable.getPageSize());
        page.setCurPage(pageable.getPageNumber());
        page.setTotalPages(pageResident.getTotalPages());
        page.setTotalElements(pageResident.getNumberOfElements());
        page.setResult(pageResident.getContent());
        return page;
    }

    public PaginatedResponse<Resident> fetchAll(Specification<Resident> spec, Pageable pageable) {
        Page<Resident> pageResident = this.residentRepository.findAll(spec, pageable);
        PaginatedResponse<Resident> page = new PaginatedResponse<>();
        page.setPageSize(pageable.getPageSize());
        page.setCurPage(pageable.getPageNumber());
        page.setTotalPages(pageResident.getTotalPages());
        page.setTotalElements(pageResident.getNumberOfElements());
        page.setResult(pageResident.getContent());
        return page;
    }

    @Transactional
    public Resident fetchResidentById(Long id) throws RuntimeException {
        return this.residentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Resident with id = "+id+ " is not found"));
    }

    @Transactional
    public Resident createResident(ResidentCreateRequest resident) throws RuntimeException {
        if (this.residentRepository.findById(resident.getId()).isPresent()) {
            throw new RuntimeException("Resident with id = " + resident.getId() + " already exists");
        }

        if(resident.getAddressNumber() != null) {
            Apartment apartment = apartmentRepository.findById(resident.getAddressNumber())
                    .orElseThrow(() -> new RuntimeException("Apartment with id = " + resident.getAddressNumber() + " does not exist"));
            List<Resident> residentList = apartment.getResidentList();

            Resident resident1 = Resident.builder()
                    .id(resident.getId())
                    .name(resident.getName())
                    .dob(resident.getDob())
                    .gender(resident.getGender())
                    .cic(resident.getCic())
                    .status(ResidentEnum.fromString(resident.getStatus()))
                    .build();
            // Synchronize
            residentList.add(resident1);
            apartment.setResidentList(residentList);
            apartmentRepository.save(apartment);
            resident1.setApartment(apartment);
            resident1.setIsActive(1);

            return this.residentRepository.save(resident1);
        }
        else {
            Resident resident1 = Resident.builder()
                    .id(resident.getId())
                    .name(resident.getName())
                    .dob(resident.getDob())
                    .gender(resident.getGender())
                    .cic(resident.getCic())
                    .status(ResidentEnum.fromString(resident.getStatus()))
                    .apartment(null)
                    .build();
            return this.residentRepository.save(resident1);
        }
    }

    @Transactional
    public Resident updateResident(ResidentUpdateRequest resident) throws Exception {
        Resident oldResident = this.fetchResidentById(resident.getId());
        if (oldResident == null) {
            throw new Exception("Resident with id = " + resident.getId() + " is not found");
        }

        if (resident.getStatus() != null && resident.getStatus().equals("Moved")) {
            // Remove from apartment if necessary
            Apartment apartment = apartmentRepository.findByOwner_Id(resident.getId()).orElse(null);

            if (apartment != null) {
                apartment.setOwner(null);
                apartment.setOwnerPhone(null);
                apartmentRepository.save(apartment);
                List<Resident> residentList = apartment.getResidentList();
                for (Resident r : residentList) {
                    r.setApartment(null);
                    r.setIsActive(0);
                    r.setStatus(ResidentEnum.Moved);
                    residentRepository.save(r);
                }
            } else {
                oldResident.setIsActive(0);
                oldResident.setStatus(ResidentEnum.Moved);
                oldResident.setApartment(null);
                residentRepository.save(oldResident);
            }
            return null; // hoặc ném ngoại lệ nếu bạn muốn báo là đã xóa
        }

        // Cập nhật thông tin khác
        if (resident.getName() != null)
            oldResident.setName(resident.getName());
        if (resident.getDob() != null)
            oldResident.setDob(resident.getDob());
        if (resident.getStatus() != null)
            oldResident.setStatus(ResidentEnum.fromString(resident.getStatus()));

        oldResident.setIsActive(1);
        if (resident.getGender() != null)
            oldResident.setGender(resident.getGender());
        if (resident.getCic() != null)
            oldResident.setCic(resident.getCic());
        if (resident.getAddressNumber() != null) {
            Apartment newApartment = apartmentRepository.findById(resident.getAddressNumber())
                    .orElseThrow(() -> new RuntimeException(
                            "Apartment with address number " + resident.getAddressNumber() + " not found"));
            List<Resident> residentList = newApartment.getResidentList();
            residentList.add(oldResident);
            newApartment.setResidentList(residentList);
            apartmentRepository.save(newApartment);
            oldResident.setApartment(newApartment);
        }

        try {
            return residentRepository.save(oldResident);
        } catch (Exception e) {
            throw new RuntimeException("Error saving resident: " + e.getMessage());
        }
    }


    @Transactional
    public ApiResponse<String> deleteResident(Long id) throws Exception {
        // Kiểm tra xem resident có tồn tại không
        Resident resident = this.fetchResidentById(id);

        // TH1: Người đó chưa có phòng --> xóa luôn
        if (resident.getApartment() == null) {
            residentRepository.deleteById(id);
        }
        // TH2: Người đó đã có phòng
        else {
            // Lấy thông tin căn hộ của resident
            Apartment apartment = resident.getApartment();

            // TH con 1: Nếu người đó là chủ căn hộ --> xóa cả người đó và các thành viên
            Apartment ownedApartment = apartmentRepository.findByOwner_Id(resident.getId()).orElse(null);
            if (ownedApartment != null) {
                // Xác nhận đây là chủ hộ
                Long addressNumber = apartment.getAddressNumber();

                // Gỡ bỏ thông tin chủ hộ khỏi căn hộ
                ownedApartment.setOwner(null);
                ownedApartment.setOwnerPhone(null);
                apartmentRepository.save(ownedApartment);

                // Lấy danh sách tất cả thành viên trong căn hộ
                List<Resident> allResidents = apartment.getResidentList();

                // Xóa tất cả xe cộ liên kết với căn hộ
                List<Vehicle> allVehicles = apartment.getVehicleList();
                if (allVehicles != null && !allVehicles.isEmpty()) {
                    for (Vehicle vehicle : allVehicles) {
                        // Xóa hoàn toàn xe khỏi database
                        vehicleRepository.deleteById(vehicle.getId());
                    }
                    // Xóa tham chiếu đến xe cộ trong căn hộ
                    apartment.setVehicleList(Collections.emptyList());
                    apartmentRepository.save(apartment);
                }
                // Ngắt kết nối tất cả residents với apartment trước khi xóa để tránh lỗi ràng
                // buộc
                for (Resident r : allResidents) {
                    r.setApartment(null);
                    residentRepository.save(r);
                }

                for (Resident r : allResidents) {
                    residentRepository.delete(r.getId());
                }
            }
            // TH con 2: Nếu người đó là thành viên --> chỉ xóa thành viên đó
            else {
                // Xóa resident khỏi danh sách cư dân của căn hộ
                List<Resident> residentList = apartment.getResidentList();
                residentList.removeIf(r -> r.getId().equals(resident.getId()));
                apartment.setResidentList(residentList);
                apartmentRepository.save(apartment);

                // Ngắt kết nối giữa resident và apartment
                resident.setApartment(null);
                residentRepository.save(resident);

                // Xóa resident
                residentRepository.deleteById(id);
            }
        }

        // Trả về response
        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Deleted resident successfully");
        response.setData(null);
        return response;
    }

}
