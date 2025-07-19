import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pertanyaanPsikologi from '../../assets/data/UsedData/DASS12Questionnaire_questions.json';
import scoreCategories from '../../assets/data/UsedData/scoreCategories.json';
import { sendPsiResult } from '../../services/mahasiswaServices/myWellnessService';

/**
 * Komponen untuk halaman tes evaluasi psikologis (DASS-21).
 * Component for the psychological evaluation test page (DASS-21).
 */
const MyWelness_Test = () => {
    // State untuk melacak jawaban yang dipilih
    // State to track selected answers
    const [selectedAnswers, setSelectedAnswers] = useState({});
    // State untuk melacak pertanyaan yang belum dijawab
    // State to track unanswered questions
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);
    // State untuk menyimpan data hasil tes akhir sebelum dikirim
    // State to store the final test data before submission
    const [psiTestData, setPsiTestData] = useState({});
    // State untuk status loading saat mengirim data ke API
    // State for loading status when sending data to the API
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Effect akan berjalan ketika `psiTestData` diperbarui (setelah form disubmit)
    // This effect runs when `psiTestData` is updated (after the form is submitted)
    useEffect(() => {
        try {
            // If we have psiTestData and it's not empty (meaning the form was submitted)
            if (psiTestData && Object.keys(psiTestData).length > 0) {
                const sendData = async () => {
                    setIsSubmitting(true);
                    const result = await sendPsiResult(psiTestData);

                    if (result.success) {
                        toast.success(
                            result.message || 'Data berhasil disimpan!'
                        );
                        navigate('/student/my-wellness');
                    } else {
                        toast.error(result.message || 'Gagal menyimpan data');
                        setIsSubmitting(false);
                    }
                };

                sendData();
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
            toast.error('Terjadi kesalahan saat mengirim data');
            setIsSubmitting(false);
        }
    }, [psiTestData, navigate]);

    /**
     * Menangani perubahan pilihan jawaban pada pertanyaan.
     * Handles answer selection changes for a question.
     * @param {number} idPertanyaan - ID pertanyaan.
     * @param {string} choice - Pilihan jawaban teks.
     * @param {number} score - Skor dari pilihan jawaban.
     */
    const handleOptionChange = (idPertanyaan, choice, score) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [idPertanyaan]: { choice, score },
        }));

        // Correct method to update unansweredQuestions
        setUnansweredQuestions((prev) =>
            prev.filter((id) => id !== idPertanyaan)
        );
    };

    /**
     * Mengonversi skor mentah DASS-21 (0-63, di mana 0 terbaik) ke skala 1-100 (di mana 100 terbaik).
     * Converts the raw DASS-21 score (0-63, where 0 is best) to a 1-100 scale (where 100 is best).
     * @param {number} rawTotalScore - Skor total mentah.
     * @returns {number} - Skor dalam skala 1-100.
     */
    const convertToHundredScale = (rawTotalScore) => {
        // Raw score range: 0-63 (DASS-21: 0 = terbaik, 63 = terburuk)
        // Target scale: 1-100 (1 = terburuk, 100 = terbaik)

        // Pastikan rawTotalScore dalam range yang benar
        const clampedScore = Math.max(0, Math.min(63, rawTotalScore));

        // Inversi skor: 0 menjadi 63, 63 menjadi 0
        const invertedScore = 63 - clampedScore;

        // Konversi ke skala 1-100
        // 63 (inversi dari 0) → 100
        // 0 (inversi dari 63) → 1
        const scaledScore = Math.round((invertedScore / 63) * 99) + 1;

        // Pastikan hasil dalam range 1-100
        return Math.max(1, Math.min(100, scaledScore));
    };

    // Function untuk menentukan kategori berdasarkan skor dari domain tertentu (tetap DASS-21 system untuk interpretasi klinis)
    const getDomainCategory = (domain, score) => {
        if (!scoreCategories[domain]) return 'Tidak Diketahui';

        for (const category of scoreCategories[domain]) {
            const [min, max] = category.rentang.split('-').map((str) => {
                return str.includes('+')
                    ? Number.MAX_SAFE_INTEGER
                    : Number(str);
            });

            if (
                score >= min &&
                (score <= max || max === Number.MAX_SAFE_INTEGER)
            ) {
                return category.kategori;
            }
        }

        return 'Tidak Diketahui';
    };

    // Function untuk menentukan kategori berdasarkan skor overall (skala 1-100)
    const getOverallCategory = (score) => {
        for (const category of scoreCategories.overall) {
            const [min, max] = category.rentang.split('-').map((str) => {
                return str.includes('+')
                    ? Number.MAX_SAFE_INTEGER
                    : Number(str);
            });

            if (
                score >= min &&
                (score <= max || max === Number.MAX_SAFE_INTEGER)
            ) {
                return {
                    summary: category.summary,
                    suggestions: category.suggestions,
                    klasifikasiPsikologi: category.klasifikasiPsikologi,
                };
            }
        }

        // Default category jika skor di luar rentang
        return {
            summary: 'Belum dapat dikategorikan dengan jelas.',
            suggestions: 'Hubungi konselor untuk evaluasi lebih lanjut.',
            klasifikasiPsikologi: 'Siaga',
        };
    };

    // Function untuk menentukan klasifikasi berdasarkan converted score (1-100)
    const getKlasifikasi = (convertedScore) => {
        if (convertedScore >= 75) {
            return 'aman';
        } else if (convertedScore >= 50) {
            return 'siaga';
        } else {
            return 'bermasalah';
        }
    };

    // Function untuk menghitung skor berdasarkan domain (tetap DASS-21 system untuk analisis klinis)
    const calculateDomainScores = (answers) => {
        const domainScores = {
            depression: 0,
            anxiety: 0,
            stress: 0,
        };

        pertanyaanPsikologi.forEach((question) => {
            const domain = question.domain.toLowerCase();
            const answer = answers[question.idPertanyaan];

            if (answer) {
                if (
                    domain === 'depression' ||
                    domain === 'anxiety' ||
                    domain === 'stress'
                ) {
                    domainScores[domain] += answer.score;
                }
                // Handle alternative domain names
                else if (domain === 'depresi') {
                    domainScores.depression += answer.score;
                } else if (domain === 'kecemasan') {
                    domainScores.anxiety += answer.score;
                } else if (domain === 'stres') {
                    domainScores.stress += answer.score;
                }
            }
        });

        return domainScores;
    };

    // Function untuk menghitung total skor raw (DASS-21 system)
    const calculateRawTotalScore = (answers) => {
        let rawTotalScore = 0;

        for (const key in answers) {
            rawTotalScore += answers[key].score;
        }

        return rawTotalScore;
    };

    // Handler saat submit si form:
    const handleSubmit = (event) => {
        event.preventDefault();

        // Cari soal yang belum dijawab:
        const missingQuestions = pertanyaanPsikologi.reduce((acc, item) => {
            if (!selectedAnswers[item.idPertanyaan]) {
                acc.push(item.idPertanyaan);
            }
            return acc;
        }, []);

        // Kalau ada jawaban yang belum terjawab:
        if (missingQuestions.length > 0) {
            setUnansweredQuestions(missingQuestions);

            // Gerak scroll ke jawaban yang belum terjawab paling awal
            const firstUnansweredQuestionElement = document.querySelector(
                `[data-question-id="${missingQuestions[0]}"]`
            );
            firstUnansweredQuestionElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });

            // Tambahkan toast error
            toast.error('Mohon jawab semua pertanyaan');
            return;
        }

        // Hitung skor per domain (tetap DASS-21 system untuk interpretasi klinis)
        const domainScores = calculateDomainScores(selectedAnswers);

        // Hitung raw total skor (DASS-21 system: 0-63)
        const rawTotalScore = calculateRawTotalScore(selectedAnswers);

        // KONVERSI: Raw total score ke skala 1-100 (skor utama untuk display)
        const finalScore = convertToHundredScale(rawTotalScore);

        // Dapatkan kategori & saran berdasarkan converted score (1-100)
        const overallCategory = getOverallCategory(finalScore);

        // Dapatkan klasifikasi berdasarkan converted score
        const klasifikasi = getKlasifikasi(finalScore);

        // Prepare data untuk dikirim ke database
        const jawabanTestPsikologi = {
            skor_depression: domainScores.depression, // Raw DASS-21 scores untuk interpretasi klinis
            skor_anxiety: domainScores.anxiety, // Raw DASS-21 scores untuk interpretasi klinis
            skor_stress: domainScores.stress, // Raw DASS-21 scores untuk interpretasi klinis
            total_skor: finalScore, // Skor dalam skala 1-100
            kesimpulan: overallCategory.summary,
            saran: overallCategory.suggestions,
            klasifikasi: klasifikasi,
        };

        // Simpen data ke useState - this will trigger the useEffect
        setPsiTestData(jawabanTestPsikologi);
    };

    return (
        <div className="p-8 w-full overflow-y-auto text-sm">
            {/* Header dan Instruksi */}
            {/* Header and Instructions */}
            <div className="text-[#333] mb-6 text-center text-2xl font-bold">
                <h1 className="pb-4">Evaluasi Psikologis Mahasiswa</h1>
                <p className="text-sm max-w-xl mx-auto">
                    Bacalah setiap pernyataan dan pilihlah pilihan yang
                    menunjukkan seberapa besar pernyataan tersebut berlaku bagi
                    Anda selama seminggu terakhir. Tidak ada jawaban yang benar
                    atau salah. Jangan menghabiskan terlalu banyak waktu untuk
                    setiap pernyataan.
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-lg mx-auto">
                    <p className="text-sm text-blue-800 font-medium">
                        <strong>Sistem Penilaian Baru:</strong>
                    </p>
                    <div className="mt-2 text-xs text-blue-700 space-y-1">
                        <div className="flex justify-between">
                            <span>Skor Akhir:</span>
                            <span>
                                <strong>1 - 100</strong>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>100 = Sangat Sehat Mental</span>
                        </div>
                        <div className="flex justify-between">
                            <span>1 = Perlu Perhatian Segera</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-200">
                            <div className="text-xs">
                                <span className="text-green-600">
                                    75-100: Aman
                                </span>{' '}
                                |
                                <span className="text-yellow-600">
                                    {' '}
                                    50-74: Siaga
                                </span>{' '}
                                |
                                <span className="text-red-600">
                                    {' '}
                                    1-49: Bermasalah
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-2xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Melakukan iterasi untuk menampilkan semua pertanyaan */}
                    {/* Iterating to display all questions */}
                    {pertanyaanPsikologi.map((item) => (
                        <div
                            key={item.idPertanyaan}
                            data-question-id={item.idPertanyaan}
                            className={`
                            bg-white p-6 rounded-xl shadow-md transition-all duration-200 hover:translate-y-[3px] hover:shadow-lg 
                            ${
                                selectedAnswers[item.idPertanyaan]
                                    ? 'border-l-4 border-green-500'
                                    : ''
                            }
                            ${
                                unansweredQuestions.includes(item.idPertanyaan)
                                    ? 'border-2 border-red-500 animate-pulse'
                                    : ''
                            }    
                        `}>
                            <h2 className="text-[#333] mb-4 text-xl font-semibold leading-relaxed">
                                Pertanyaan {item.idPertanyaan}: {item.question}
                            </h2>

                            <div className="space-y-3">
                                {item.choices.map((choice, choiceIndex) => (
                                    <label
                                        key={choiceIndex}
                                        className={`
                                        flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedAnswers[item.idPertanyaan]
                                                ?.choice === choice
                                                ? 'bg-blue-50 border-l-3 border-blue-500'
                                                : ''
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name={`questions${item.idPertanyaan}`}
                                            value={choice}
                                            checked={
                                                selectedAnswers[
                                                    item.idPertanyaan
                                                ]?.choice === choice
                                            }
                                            onChange={() =>
                                                handleOptionChange(
                                                    item.idPertanyaan,
                                                    choice,
                                                    item.scores[choiceIndex]
                                                )
                                            }
                                            className="mr-3 w-5 h-5 text-[#951A22] focus:ring-[#951A22]"
                                        />
                                        {choice}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Tombol Submit */}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            bg-[#951A22] text-white py-3 px-6 rounded-lg block mx-auto 
                            w-fit min-w-[10cm] transition-all duration-300 focus:outline-none 
                            focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]
                            ${
                                isSubmitting
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:bg-[#7A1118] hover:translate-y-[2px]'
                            }
                        `}>
                        {isSubmitting ? 'Memproses...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyWelness_Test;
