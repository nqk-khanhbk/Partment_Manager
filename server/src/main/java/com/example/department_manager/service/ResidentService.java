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
        // Find the highest ID in the database and increment by 1
        Long newId = residentRepository.findTopByOrderByIdDesc()
                .map(r -> r.getId() + 1L)
                .orElse(1L);  // Start with 1 if no residents exist yet

        if(resident.getAddressNumber() != null) {
            Apartment apartment = apartmentRepository.findById(resident.getAddressNumber())
                    .orElseThrow(() -> new RuntimeException("Apartment with id = " + resident.getAddressNumber() + " does not exist"));
            List<Resident> residentList = apartment.getResidentList();

            Resident resident1 = Resident.builder()
                    .id(newId)  // Use the generated ID instead of resident.getId()
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
                    .id(newId)  // Use the generated ID instead of resident.getId()
                    .name(resident.getName())
                    .dob(resident.getDob())
                    .gender(resident.getGender())
                    .cic(resident.getCic())
                    .status(ResidentEnum.fromString(resident.getStatus()))
                    .apartment(null)
                    .isActive(1)  // Set isActive to 1 by default
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
        Resident resident = this.fetchResidentById(id);
        resident.setIsActive(0);
        if (resident.getApartment() != null) {
            Apartment apartment = apartmentRepository.findById(resident.getApartmentId()).orElseThrow(() -> new RuntimeException("Apartment with id " + resident.getApartmentId() + " not found"));
            List<Resident> residentList = apartment.getResidentList();
            residentList.remove(resident);
            apartment.setResidentList(residentList);
        }
        resident.setApartment(null);
        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("delete resident success");
        response.setData(null);
        return response;
    }

}
