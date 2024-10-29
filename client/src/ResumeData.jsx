import React, { useState } from 'react';
import ResumeSection from './ResumeSection';

const ResumeData = () => {
  const [resumeData, setResumeData] = useState(null);

  const fetchData = async () => {
    try {
      // Create FormData object
      const formData = new FormData(document.getElementById('file-upload-form'));
      
      // Log FormData entries for debugging
      console.log('FormData entries:', [...formData]);

      // Send the request to the server
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        setResumeData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <form id="file-upload-form">
        <input type="file" name="file" />
        <button type="button" onClick={fetchData}>Upload</button>
      </form>
      {resumeData && (
        <div className="resume-container">
          <h2 className="resume-title">Resume Information</h2>

          {/* Use the ResumeSection component for each section */}
          <ResumeSection title="Name" data={resumeData.Name || ''} /> 
    <ResumeSection 
      title="Contact Information" 
      data={resumeData.ContactInformation || []} 
      type="objectList" 
    />
        </div>
      )}
    </div>
  );
};

export default ResumeData;
