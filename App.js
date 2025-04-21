import React, { useState, useEffect } from 'react';
import './App.css'; // You can create a separate CSS file for styling

function App() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [newCourseType, setNewCourseType] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [selectedCourseTypeFilter, setSelectedCourseTypeFilter] = useState('');

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedCourseTypes = JSON.parse(localStorage.getItem('courseTypes')) || [];
    const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const storedCourseOfferings = JSON.parse(localStorage.getItem('courseOfferings')) || [];
    const storedRegistrations = JSON.parse(localStorage.getItem('registrations')) || [];

    setCourseTypes(storedCourseTypes);
    setCourses(storedCourses);
    setCourseOfferings(storedCourseOfferings);
    setRegistrations(storedRegistrations);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('courseTypes', JSON.stringify(courseTypes));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('courseOfferings', JSON.stringify(courseOfferings));
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [courseTypes, courses, courseOfferings, registrations]);


  // Course Type Functions
  const createCourseType = () => {
    if (newCourseType.trim() !== '') {
      setCourseTypes([...courseTypes, { id: Date.now(), name: newCourseType }]);
      setNewCourseType('');
    }
  };

  const updateCourseType = (id, newName) => {
    setCourseTypes(courseTypes.map(type => (type.id === id ? { ...type, name: newName } : type)));
  };

  const deleteCourseType = (id) => {
    setCourseTypes(courseTypes.filter(type => type.id !== id));
    // Also delete any course offerings associated with this course type
    setCourseOfferings(courseOfferings.filter(offering => offering.courseTypeId !== id));
  };

  // Course Functions
  const createCourse = () => {
    if (newCourse.trim() !== '') {
      setCourses([...courses, { id: Date.now(), name: newCourse }]);
      setNewCourse('');
    }
  };

  const updateCourse = (id, newName) => {
    setCourses(courses.map(course => (course.id === id ? { ...course, name: newName } : course)));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    // Also delete any course offerings associated with this course
     setCourseOfferings(courseOfferings.filter(offering => offering.courseId !== id));
  };

  // Course Offering Functions
  const createCourseOffering = (courseId, courseTypeId) => {
    const course = courses.find(c => c.id === courseId);
    const courseType = courseTypes.find(type => type.id === courseTypeId);
    if (course && courseType) {
      setCourseOfferings([...courseOfferings, { id: Date.now(), courseId, courseTypeId, name: `${courseType.name} - ${course.name}` }]);
    }
  };

  const updateCourseOffering = (id, newCourseId, newCourseTypeId) => {
    const course = courses.find(c => c.id === newCourseId);
    const courseType = courseTypes.find(type => type.id === newCourseTypeId);
    if (course && courseType) {
      setCourseOfferings(courseOfferings.map(offering => (offering.id === id ? { ...offering, courseId: newCourseId, courseTypeId: newCourseTypeId, name: `${courseType.name} - ${course.name}` } : offering)));
    }
  };


  const deleteCourseOffering = (id) => {
    setCourseOfferings(courseOfferings.filter(offering => offering.id !== id));
    // Also delete any registrations associated with this offering
    setRegistrations(registrations.filter(reg => reg.courseOfferingId !== id));
  };

  // Student Registration Functions
  const registerStudent = (courseOfferingId, studentName) => {
    if (studentName.trim() !== '') {
      setRegistrations([...registrations, { id: Date.now(), courseOfferingId, studentName }]);
    }
  };

  const listRegisteredStudents = (courseOfferingId) => {
    return registrations.filter(reg => reg.courseOfferingId === courseOfferingId);
  };

  const filteredCourseOfferings = selectedCourseTypeFilter
    ? courseOfferings.filter(offering => offering.courseTypeId === parseInt(selectedCourseTypeFilter))
    : courseOfferings;


  return (
    <div className='student-container'>
    <div className="app-container">
      <h1>Student Registration System</h1>

      {/* Course Types Management */}
      <div className="section-container">
        <h2>Course Types</h2>
        <div className="input-group">
          <input
            type="text"
            value={newCourseType}
            onChange={(e) => setNewCourseType(e.target.value)}
            placeholder="Enter new course type"
          />
          <button onClick={createCourseType}>Create Course Type</button>
        </div>
        <ul className="list-group">
          {courseTypes.map(type => (
            <li key={type.id} className="list-item">
              {type.name}
              <div className="list-actions">
                <button onClick={() => {
                    const newName = prompt("Enter new name", type.name);
                    if (newName) updateCourseType(type.id, newName);
                  }}>Update</button>
                <button onClick={() => deleteCourseType(type.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Courses Management */}
      <div className="section-container">
        <h2>Courses</h2>
        <div className="input-group">
          <input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Enter new course name"
          />
          <button onClick={createCourse}>Create Course</button>
        </div>
        <ul className="list-group">
          {courses.map(course => (
            <li key={course.id} className="list-item">
              {course.name}
              <div className="list-actions">
                <button onClick={() => {
                    const newName = prompt("Enter new name", course.name);
                    if (newName) updateCourse(course.id, newName);
                  }}>Update</button>
                <button onClick={() => deleteCourse(course.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Course Offerings Management */}
      <div className="section-container">
        <h2>Course Offerings</h2>
        <div className="input-group">
          <select id="courseSelect">
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <select id="courseTypeSelect">
            <option value="">Select Course Type</option>
            {courseTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <button onClick={() => {
            const courseSelect = document.getElementById('courseSelect');
            const courseTypeSelect = document.getElementById('courseTypeSelect');
            if (courseSelect.value && courseTypeSelect.value) {
              createCourseOffering(parseInt(courseSelect.value), parseInt(courseTypeSelect.value));
              courseSelect.value = ''; // Reset the select
              courseTypeSelect.value = ''; // Reset the select
            } else {
              alert('Please select a course and a course type.');
            }
          }}>Create Offering</button>

        </div>
        <div>
          <select value={selectedCourseTypeFilter} onChange={(e) => setSelectedCourseTypeFilter(e.target.value)}>
            <option value="">All Course Offerings</option>
            {courseTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <ul className="list-group">
          {filteredCourseOfferings.map(offering => (
            <li key={offering.id} className="list-item">
              {offering.name}
              <div className="list-actions">
                <button onClick={() => {
                  const newCourseId = prompt("Enter new Course ID", offering.courseId);
                  const newCourseTypeId = prompt("Enter new Course Type ID", offering.courseTypeId);
                  if (newCourseId && newCourseTypeId) {
                    updateCourseOffering(offering.id, parseInt(newCourseId), parseInt(newCourseTypeId));
                  }
                }}>Update</button>
                <button onClick={() => deleteCourseOffering(offering.id)}>Delete</button>
                <button onClick={() => {
                  const studentName = prompt("Enter student name to register:");
                  if (studentName) registerStudent(offering.id, studentName);
                }}>Register Student</button>
                <button onClick={() => {
                  const students = listRegisteredStudents(offering.id);
                  alert(students.length > 0 ? students.map(s => s.studentName).join(', ') : 'No students registered.');
                }}>View Students</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default App;