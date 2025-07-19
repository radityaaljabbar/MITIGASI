// File: src/utils/dataUtils.js

/**
 * Fungsi untuk memformat data dari API ke format yang dibutuhkan oleh chart.
 * Function to format data from the API into the format required by the chart.
 * @param {Object} aspectData - Data aspek psikologi dari API.
 * @returns {Array} Data yang siap digunakan oleh komponen chart.
 */
export const formatChartData = (aspectData) => {
    // Jika tidak ada data, kembalikan array kosong
    // If there is no data, return an empty array
    if (!aspectData) return [];
    
    // Mengubah objek menjadi array of object dengan nama dan nilai
    // Converting the object into an array of objects with name and value
    return Object.entries(aspectData).map(([key, value]) => {
      // Pemetaan nama teknis ke nama yang lebih mudah dibaca
      // Mapping technical names to more readable names
      const nameMap = {
        kepribadian: 'Kepribadian',
        motivasi: 'Motivasi',
        kecemasan: 'Kecemasan',
        stres: 'Stres',
        penyesuaianDiri: 'Penyesuaian Diri'
      };
      
      return {
        name: nameMap[key] || key,
        nilai: value
      };
    });
  };
  
  /**
   * Fungsi untuk mendapatkan kekuatan dan area pengembangan berdasarkan nilai aspek.
   * Function to get strengths and development areas based on aspect scores.
   * @param {Object} aspectData - Data aspek psikologi.
   * @returns {Object} Objek yang berisi kekuatan dan area pengembangan.
   */
  export const analyzeStrengthsAndAreas = (aspectData) => {
    // Jika tidak ada data, kembalikan objek kosong
    // If there is no data, return an empty object
    if (!aspectData) return { strengths: [], developmentAreas: [] };
    
    // Logika untuk menganalisis kekuatan dan kelemahan bisa dibuat lebih kompleks di sini
    // The logic for analyzing strengths and weaknesses can be made more complex here
    // Contoh implementasi dasar:
    // Basic implementation example:
    const strengths = [];
    const developmentAreas = [];
    
    // Menentukan area pengembangan berdasarkan ambang batas nilai
    // Determining development areas based on score thresholds
    if (aspectData.kepribadian > 70) strengths.push('Kepribadian yang kuat');
    if (aspectData.motivasi > 65) strengths.push('Motivasi di atas rata-rata');
    if (aspectData.kecemasan < 50) strengths.push('Tingkat kecemasan rendah');
    if (aspectData.stres < 50) strengths.push('Kemampuan mengelola stres baik');
    if (aspectData.penyesuaianDiri > 70) strengths.push('Penyesuaian diri yang baik');
    
    if (aspectData.kepribadian < 70) developmentAreas.push('Pengembangan kepribadian');
    if (aspectData.motivasi < 65) developmentAreas.push('Peningkatan motivasi belajar');
    if (aspectData.kecemasan > 50) developmentAreas.push('Manajemen kecemasan');
    if (aspectData.stres > 50) developmentAreas.push('Teknik pengelolaan stres');
    if (aspectData.penyesuaianDiri < 70) developmentAreas.push('Kemampuan adaptasi');
    
    return { strengths, developmentAreas };
  };