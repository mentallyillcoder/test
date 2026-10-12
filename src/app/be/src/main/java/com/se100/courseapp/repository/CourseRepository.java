package com.se100.courseapp.repository;

import com.se100.courseapp.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByPublishedTrueOrderByTitleAsc();
}
