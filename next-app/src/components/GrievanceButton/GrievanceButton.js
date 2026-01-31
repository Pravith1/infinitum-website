'use client';

import React from 'react';
import './GrievanceButton.css';

// Replace this with your actual Google Form URL
const GRIEVANCE_FORM_URL = 'https://forms.google.com/your-form-url';

export default function GrievanceButton() {
    const handleClick = () => {
        window.open(GRIEVANCE_FORM_URL, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            className="grievance-button"
            onClick={handleClick}
            aria-label="Submit a grievance"
            title="Submit a grievance"
        >
            <i className="ri-feedback-line"></i>
        </button>
    );
}
