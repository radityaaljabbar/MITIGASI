import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pertanyaanPsikologi from '../../assets/data/UsedData/DASS12Questionnaire_questions.json';
import scoreCategories from '../../assets/data/UsedData/scoreCategories.json';
import { sendPsiResult } from '../../services/mahasiswaServices/myWellnessService';

const MyWellness_Test = () => {
    // Make useState untuk tracking kondisi jawaban yang dipilih:
    const [selectedAnswers, setSelectedAnswers] = useState({});
    // Make useState juga untuk tracking kondisi jawaban yang belum dipilih:
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);
    // useState untuk simpen data akhir:
    const [psiTestData, setPsiTestData] = useState({});
    // Add loading state for API calls
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

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

    // Handler untuk seleksi pilihan:
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

    // Function untuk menentukan kategori berdasarkan skor dari domain tertentu
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

    // Function untuk menentukan kategori berdasarkan skor overall
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

        // Default category jika skor di luar rentang (unlikely but as a fallback)
        return {
            summary: 'Belum dapat dikategorikan dengan jelas.',
            suggestions: 'Hubungi konselor untuk evaluasi lebih lanjut.',
            klasifikasiPsikologi: 'Belum Terkategorisasi',
        };
    };

    // Function untuk menentukan klasifikasi (Aman, Siaga, Bermasalah) berdasarkan skor domain
    const getKlasifikasi = (depressionScore, anxietyScore, stressScore) => {
        // Get kategori untuk setiap domain
        const depressionCategory = getDomainCategory(
            'depression',
            depressionScore
        );
        const anxietyCategory = getDomainCategory('anxiety', anxietyScore);
        const stressCategory = getDomainCategory('stress', stressScore);

        // Logic untuk menentukan klasifikasi keseluruhan
        if (
            depressionCategory === 'Normal' &&
            anxietyCategory === 'Normal' &&
            stressCategory === 'Normal'
        ) {
            return 'aman';
        } else if (
            depressionCategory === 'Parah' ||
            depressionCategory === 'Sangat Parah' ||
            anxietyCategory === 'Parah' ||
            anxietyCategory === 'Sangat Parah' ||
            stressCategory === 'Parah' ||
            stressCategory === 'Sangat Parah'
        ) {
            return 'bermasalah';
        } else {
            return 'siaga';
        }
    };

    // Function untuk menghitung skor berdasarkan domain
    const calculateDomainScores = (answers) => {
        const domainScores = {
            depression: 0,
            anxiety: 0,
            stress: 0,
        };

        pertanyaanPsikologi.forEach((question) => {
            const domain = question.domain.toLowerCase(); // Convert to lowercase to ensure matching
            const answer = answers[question.idPertanyaan];

            if (answer) {
                // Ensure we only add to domains that exist in our object
                if (
                    domain === 'depression' ||
                    domain === 'anxiety' ||
                    domain === 'stress'
                ) {
                    domainScores[domain] += answer.score;
                }
                // Handle case where domain might be stored differently in the question data
                else if (domain === 'depresi') {
                    domainScores.depression += answer.score;
                } else if (domain === 'kecemasan') {
                    domainScores.anxiety += answer.score;
                } else if (domain === 'stres') {
                    domainScores.stress += answer.score;
                }

                // Log unutk debugging
                // console.log(
                //     `Question ${question.idPertanyaan} - Domain: ${domain}, Score: ${answer.score}`
                // );
            }
        });

        console.log('Final domain scores:', domainScores);
        return domainScores;
    };

    // Function untuk menghitung total skor
    const calculateTotalScore = (answers) => {
        let totalScore = 0;

        for (const key in answers) {
            totalScore += answers[key].score;
        }

        return totalScore;
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

        // Hitung skor per domain
        const domainScores = calculateDomainScores(selectedAnswers);

        // Hitung total skor
        const totalScore = calculateTotalScore(selectedAnswers);

        // Dapatkan kategori & saran berdasarkan overall score
        const overallCategory = getOverallCategory(totalScore);

        // Dapatkan klasifikasi (Aman, Siaga, Bermasalah)
        const klasifikasi = getKlasifikasi(
            domainScores.depression,
            domainScores.anxiety,
            domainScores.stress
        );

        // Prepare data untuk dikirim ke database
        const jawabanTestPsikologi = {
            skor_depression: domainScores.depression,
            skor_anxiety: domainScores.anxiety,
            skor_stress: domainScores.stress,
            total_skor: totalScore,
            kesimpulan: overallCategory.summary,
            saran: overallCategory.suggestions,
            klasifikasi: klasifikasi,
        };

        // Log untuk debugging
        console.log('Preparing to send data:', jawabanTestPsikologi);

        // Simpen data ke useState - this will trigger the useEffect
        setPsiTestData(jawabanTestPsikologi);
    };

    return (
        <div className="p-8 w-full overflow-y-auto text-sm">
            <div className="text-[#333] mb-6 text-center text-2xl font-bold">
                <h1 className="pb-4">Evaluasi Psikologis Mahasiswa</h1>
                <p className="text-sm  max-w-xl mx-auto">
                    Bacalah setiap pernyataan dan pilihlah pilihan yang
                    menunjukkan seberapa besar pernyataan tersebut berlaku bagi
                    Anda selama seminggu terakhir. Tidak ada jawaban yang benar
                    atau salah. Jangan menghabiskan terlalu banyak waktu untuk
                    setiap pernyataan.
                </p>
            </div>
            <div className="max-w-2xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="text-gray-600 mb-3">
                                {/* Domain: {item.domain} */}
                            </div>

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

export default MyWellness_Test;
