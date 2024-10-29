import React from 'react';

const ResumeSection = ({ title, data, type = 'text' }) => {
  if (type === 'text') {
    return (
      <div className="resume-section">
        <h3>{title}</h3>
        <p>{data}</p>
      </div>
    );
  } else if (type === 'list') {
    return (
      <div className="resume-section">
        <h3>{title}</h3>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  } else if (type === 'objectList') {
    return (
        <div className="resume-section">
          <h3>{title}</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <span key={key}>
                    <strong>{key}:</strong> {value}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      );
    }
};

export default ResumeSection;