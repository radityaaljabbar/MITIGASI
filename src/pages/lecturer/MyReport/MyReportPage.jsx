import React, { useState } from "react";
import StudentListView from "./StudentListView";
import StudentDetailView from "./StudentDetailView";

function MyReportPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
        My Report Page
      </h1>
      {selectedStudent ? (
        <StudentDetailView student={selectedStudent} onBack={handleBack} />
      ) : (
        <StudentListView onViewDetail={handleViewDetail} />
      )}
    </div>
  );
}

export default MyReportPage;