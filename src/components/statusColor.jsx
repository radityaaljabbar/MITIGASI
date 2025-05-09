const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'selesai':
        case 'completed':
        case 'done':
            return 'bg-green-100 text-green-800';

        case 'dalam proses':
        case 'processing':
        case 'in progress':
            return 'bg-blue-100 text-blue-800';

        case 'ditolak':
        case 'rejected':
        case 'denied':
            return 'bg-red-100 text-red-800';

        case 'menunggu':
        case 'menunggu respon':
        case 'pending':
        case 'waiting':
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

export default getStatusColor;
