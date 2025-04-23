// File: src/utils/dataUtils.js

/**
 * Fungsi untuk memformat data dari API ke format yang dibutuhkan chart
 * @param {Object} aspectData - Data aspek psikologi dari API
 * @returns {Array} Data yang siap digunakan oleh komponen chart
 */
export const formatChartData = (aspectData) => {
    if (!aspectData) return [];
    
    return Object.entries(aspectData).map(([key, value]) => {
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
   * Fungsi untuk mendapatkan kekuatan dan area pengembangan berdasarkan nilai aspek
   * @param {Object} aspectData - Data aspek psikologi
   * @returns {Object} Kekuatan dan area pengembangan
   */
  export const analyzeStrengthsAndAreas = (aspectData) => {
    if (!aspectData) return { strengths: [], developmentAreas: [] };
    
    // Logika untuk menganalisis kekuatan dan kelemahan bisa dibuat di sini
    // Contoh implementasi dasar:
    const strengths = [];
    const developmentAreas = [];
    
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