export const generateAssessments = async (tutorial, user_id) => {
  try {
    const tutorialKey = `tutorial:${tutorial}`;
    const model = genAI.getGenerativeModel({ model: process.env.MODEL });

    const cachedTutorial = await fetchTutorialId(tutorial);
    const materi = cachedTutorial.content ?? JSON.stringify(cachedTutorial);

    const prompt = `
    Berdasarkan materi berikut, buatkan 4 soal pilihan ganda untuk asesmen pembelajaran.
    Tiap soal harus memiliki 4 opsi jawaban (A, B, C, D) dan jelaskan alasan benar/salahnya.

    === Materi ===
    ${materi}

    === Format JSON WAJIB ===
    [
      {
        "assessment": "Teks soal",
        "multiple_choice": [
          { "id": 1, "option": "Opsi A", "correct": true, "explanation": "Alasan" },
          { "id": 2, "option": "Opsi B", "correct": false, "explanation": "Alasan" },
          { "id": 3, "option": "Opsi C", "correct": false, "explanation": "Alasan" },
          { "id": 4, "option": "Opsi D", "correct": false, "explanation": "Alasan" }
        ]
      }
    ]
    `;

    let parsed;

    // ===============================
    // ✅ HYBRID MODE: GEMINI → MOCK
    // ===============================
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      parsed = JSON.parse(text);
    } catch (apiErr) {
      console.warn("⚠️ Gemini gagal, fallback ke MOCK:", apiErr.message);

      // ✅ MOCK DATA (ANTI DOWN)
      parsed = [
        {
          assessment: "Apa fungsi utama Redis?",
          multiple_choice: [
            { id: 1, option: "Database relasional", correct: false, explanation: "Redis bukan SQL" },
            { id: 2, option: "In-memory cache", correct: true, explanation: "Redis adalah cache in-memory" },
            { id: 3, option: "Web server", correct: false, explanation: "Redis bukan web server" },
            { id: 4, option: "Load balancer", correct: false, explanation: "Redis bukan load balancer" }
          ]
        },
        {
          assessment: "Apa kepanjangan dari API?",
          multiple_choice: [
            { id: 1, option: "Application Program Interface", correct: false, explanation: "Kurang tepat" },
            { id: 2, option: "Application Programming Interface", correct: true, explanation: "Ini jawaban yang benar" },
            { id: 3, option: "Applied Program Integration", correct: false, explanation: "Salah konsep" },
            { id: 4, option: "Application Process Integration", correct: false, explanation: "Tidak tepat" }
          ]
        },
        {
          assessment: "Docker digunakan untuk?",
          multiple_choice: [
            { id: 1, option: "Virtualisasi container", correct: true, explanation: "Docker berbasis container" },
            { id: 2, option: "Desain UI", correct: false, explanation: "Bukan UI tool" },
            { id: 3, option: "Manajemen database", correct: false, explanation: "Bukan DBMS" },
            { id: 4, option: "Load balancing", correct: false, explanation: "Bukan load balancer" }
          ]
        },
        {
          assessment: "Apa fungsi utama Redis di backend?",
          multiple_choice: [
            { id: 1, option: "Authentication", correct: false, explanation: "Bukan fungsi utama" },
            { id: 2, option: "Authorization", correct: false, explanation: "Bukan fungsi utama" },
            { id: 3, option: "Caching dan message broker", correct: true, explanation: "Fungsi utama Redis" },
            { id: 4, option: "Web scraping", correct: false, explanation: "Bukan tugas Redis" }
          ]
        }
      ];
    }

    // ===============================
    // ✅ NORMALISASI OUTPUT
    // ===============================
    const data = parsed.map((q, index) => ({
      id: nanoid(8),
      assessment: q.assessment,
      multiple_choice: q.multiple_choice.map((m) => ({
        id: m.id || nanoid(6),
        option: m.option,
        correct: m.correct,
        explanation: m.explanation,
      })),
      question_number: index + 1,
      time: 30000,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 120000).toISOString(),
    }));

    const firstQuestion = data[0];
    const exists = await findOne(user_id, tutorial);

    if (!exists) {
      await createQuestion({
        id: firstQuestion.id,
        user_id,
        assessment: firstQuestion.assessment,
        tutorial_id: tutorial,
        option_1: firstQuestion.multiple_choice[0].option,
        option_2: firstQuestion.multiple_choice[1].option,
        option_3: firstQuestion.multiple_choice[2].option,
        option_4: firstQuestion.multiple_choice[3].option,
        answer:
          firstQuestion.multiple_choice.find((m) => m.correct)?.id.toString() ?? "1",
      });
    }

    const remaining = data.slice(1);
    const redisKey = `assessment:${nanoid(6)}`;

    await redisClient.set(redisKey, JSON.stringify(remaining), { EX: 120 });

    return {
      key: redisKey,
      materi_key: tutorialKey,
      data: remaining,
      source: "hybrid", // ✅ penanda: gemini atau mock
    };
  } catch (err) {
    throw err;
  }
};
