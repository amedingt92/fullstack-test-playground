function validateUser(data) {
    const errors = [];
    if (!data.name) {
        errors.push('Name is required');
    } else {
        if (data.name.length > 100) {
            errors.push('Name must be 100 characters or less');
        }
        const nameRegex = /^[a-zA-Z\s\-']+$/; // Fixed regex
        if (!nameRegex.test(data.name)) {
            errors.push('Name contains invalid characters');
        }
    }

    if (!data.email) {
        errors.push('Email is required');
    } else {
        if (data.email.length > 100) {
            errors.push('Email must be 100 characters or less');
        }
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

module.exports = { validateUser };
