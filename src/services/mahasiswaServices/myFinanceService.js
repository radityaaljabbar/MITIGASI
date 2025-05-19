const API_URL = 'http://localhost:5000/api/student';

export const submitRelief = async (formData) => {
    try {
        const token = localStorage.getItem('token');

        const payload = {
            monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
            parentIncome: parseFloat(formData.parentIncome) || 0,
            dependents: parseInt(formData.dependents) || 0,
            housingStatus: formData.housingStatus,
            transportationCost: parseFloat(formData.transportationCost) || 0,
            otherExpenses: parseFloat(formData.otherExpenses) || 0,
            reliefType: formData.reliefType,
            reasonCategory: formData.reasonCategory,
            requestedAmount: formData.reliefType === 'full' ? 0 : parseFloat(formData.requestedAmount) || 0,
            reliefReason: formData.reliefReason,
            submissionDate: new Date().toISOString()
        };

        console.log('Sending data to backend:', payload);

        if (!token) {
            return {
                success: false,
                message: 'Token tidak ditemukan',
            };
        }

        // Log the request payload for debugging
        console.log('Sending response with payload:', formData);

        const response = await fetch(`${API_URL}/sendRelief`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        return response;
    } catch (error) {
        
    }
}