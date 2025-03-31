import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pertanyaanPsikologi from '../assets/data/mockupjsonMyWellness/pertanyaanPsikologi.json';
import scoreCategories from '../assets/data/mockupjsonMyWellness/scoreCategories.json';

const MyWellness_Test = ({ submitTestPsikologi }) => {
    // Hardcode NIM dan Nama nanti diambil dri backend pas session mereka login
    const testNIM = 11032100102;
    const testName = 'Kiboy';
    // Make useState untuk tracking kondisi jawaban yang dipilih:
    const [selectedAnswers, setSelectedAnswers] = useState({});
    // Make useState juga untuk tracking kondisi jawaban yang belum dipilih:
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);

    const navigate = useNavigate();

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

    // Function untuk menentukan kategori berdasarkan skor
    const getCategoryFromScore = (score) => {
        for (const category of scoreCategories) {
            const [min, max] = category.rentang.split('-').map(Number);
            if (score >= min && score <= max) {
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

    // Function untuk menghitung skor berdasarkan domain
    const calculateDomainScores = (answers) => {
        const domainScores = {};

        pertanyaanPsikologi.forEach((question) => {
            const domain = question.domain;
            const answer = answers[question.idPertanyaan];

            if (answer) {
                if (!domainScores[domain]) {
                    domainScores[domain] = {
                        total: 0,
                        count: 0,
                        average: 0,
                    };
                }

                domainScores[domain].total += answer.score;
                domainScores[domain].count++;
                domainScores[domain].average =
                    domainScores[domain].total / domainScores[domain].count;
            }
        });

        return domainScores;
    };

    // Function untuk menghitung total skor
    const calculateTotalScore = (answers) => {
        let totalScore = 0;
        let answeredQuestions = 0;

        for (const key in answers) {
            totalScore += answers[key].score;
            answeredQuestions++;
        }

        return {
            score: totalScore,
            average: answeredQuestions > 0 ? totalScore / answeredQuestions : 0,
            count: answeredQuestions,
        };
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

        // Hitung hasil berdasarkan domain
        const domainScores = calculateDomainScores(selectedAnswers);

        // Hitung total skor
        const totalScoreResult = calculateTotalScore(selectedAnswers);

        // Mendapatkan skor yang dinormalisasi ke skala 0-100
        const maxPossibleScore = pertanyaanPsikologi.length * 5; // Asumsi skor maksimum per pertanyaan adalah 5
        const normalizedScore = Math.round(
            (totalScoreResult.score / maxPossibleScore) * 100
        );

        // Dapatkan kategori berdasarkan skor
        const category = getCategoryFromScore(normalizedScore);

        // Prepare psychological test submission
        const jawabanTestPsikologi = {
            NIM: testNIM,
            Name: testName,
            answers: selectedAnswers,
            domainScores: domainScores,
            totalScore: totalScoreResult,
            normalizedScore: normalizedScore,
            summary: category.summary,
            suggestions: category.suggestions,
            klasifikasiPsikologi: category.klasifikasiPsikologi,
            testDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        };

        // Call submit function from parent component
        submitTestPsikologi(jawabanTestPsikologi);

        // Tambahkan toast success
        toast.success('Tes Psikologi Berhasil Dikirim!');

        // Navigate to results page
        return navigate('/my-wellness');
    };

    return (
        <div className="p-8 w-full overflow-y-auto text-sm">
            <h1 className="text-[#333] mb-6 text-center text-2xl font-bold">
                Evaluasi Psikologis Mahasiswa
            </h1>
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
                                Domain: {item.domain}
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
                        className="bg-[#951A22] text-white py-3 px-6 rounded-lg block mx-auto w-fit min-w-[10cm] hover:bg-[#7A1118] hover:translate-y-[2px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyWellness_Test;
