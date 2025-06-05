package com.example.department_manager.repository;

import com.example.department_manager.entity.Apartment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long>, JpaSpecificationExecutor<Apartment> {
    @EntityGraph(attributePaths = {"residentList", "owner"})
    Optional<Apartment> findById(Long addressNumber);
    @EntityGraph(attributePaths = { "residentList", "owner" })
    Optional<Apartment> findByOwner_Id(Long ownerId);

}
