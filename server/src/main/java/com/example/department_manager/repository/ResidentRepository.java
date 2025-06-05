package com.example.department_manager.repository;

import com.example.department_manager.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long>, JpaSpecificationExecutor<Resident> {
    @Query("DELETE FROM Resident r WHERE r.id = :id")
    @Modifying
    @Transactional
    void delete(@Param("id") Long id);

    Optional<Resident> findTopByOrderByIdDesc();
}
