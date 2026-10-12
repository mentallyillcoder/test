import React from "react";

export function CourseSelector({ courses, selectedCourseId, onSelectCourse }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <label style={{ fontWeight: "bold", marginRight: "10px" }}>
        Chọn Khóa Học:
      </label>
      <select
        value={selectedCourseId}
        onChange={(e) => onSelectCourse(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
    </div>
  );
}
