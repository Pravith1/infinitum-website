// PSG Colleges and their email domains
export const PSG_COLLEGES = {
    'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004': '@psgtech.ac.in',
    'PSG Institute of Technology and Applied Research, Avinashi Road, Neelambur, Coimbatore 641062': '@psgitech.ac.in'
};

/**
 * Check if the given email belongs to a PSG student
 * @param {string} email 
 * @returns {boolean}
 */
export const isPsgEmail = (email) => {
    if (!email) return false;
    const emailLower = email.toLowerCase();
    return Object.values(PSG_COLLEGES).some(domain => emailLower.endsWith(domain));
};

/**
 * Check if the given college name is a PSG college
 * @param {string} collegeName 
 * @returns {boolean}
 */
export const isPsgCollege = (collegeName) => {
    if (!collegeName) return false;
    return Object.keys(PSG_COLLEGES).includes(collegeName);
};
