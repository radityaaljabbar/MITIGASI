// Define the form questions
const formQuestions = [
    {
        id: "question1",
        number: 1,
        text: "Berapa pendapatan bulanan Anda?",
        type: "text",
        placeholder: "Masukkan pendapatan bulanan",
        required: true
    },
    {
        id: "question2",
        number: 2,
        text: "Berapa pengeluaran bulanan Anda?",
        type: "text",
        placeholder: "Masukkan pengeluaran bulanan",
        required: true
    },
    {
        id: "question3",
        number: 3,
        text: "Apakah Anda memiliki tanggungan keluarga?",
        type: "select",
        options: [
            { value: "", text: "Pilih Jawaban" },
            { value: "ya", text: "Ya" },
            { value: "tidak", text: "Tidak" }
        ],
        required: true
    },
    {
        id: "question4",
        number: 4,
        text: "Apakah Anda memiliki hutang atau cicilan?",
        type: "select",
        options: [
            { value: "", text: "Pilih Jawaban" },
            { value: "ya", text: "Ya" },
            { value: "tidak", text: "Tidak" }
        ],
        required: true
    },
    {
        id: "buktiPendukung",
        number: 5,
        text: "Unggah Bukti Pendukung (contoh: slip gaji, rekening koran)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        required: false
    }
];

// No need for export if you're including this file directly via script tag