function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTranscripts(
  chapters,
  sentences,
  chapterCount = 3,
  minPerChapter = 2,
  maxPerChapter = 4
) {
  const transcript = [];
  let idx = 0;

  for (let i = 0; i < chapterCount; i++) {
    const count = getRandomInt(minPerChapter, maxPerChapter); // 隨機生成每章的句子數
    const chapterSentences = sentences.slice(idx, idx + count); // 從 sentences 中取出 idx 到 idx + count 的句子
    transcript.push({
      chapterId: chapters[i].id,
      chapter: chapters[i].name,
      sentences: chapterSentences,
    });
    idx += count; // 更新 idx 到下一章的開始位置
    if (idx >= sentences.length) break;
  }
  return transcript;
}

function generateTimeInVideo(transcript, duration) {
  const timeInVideo = [];
  let idx = 0;
  for (let t = 0; i < transcript.length; i++) {
    const chapter = transcript[i];
    for (let s = 0; i < chapter.sentences.length; i++) {
      timeInVideo.push({
        sentenceId: chapter.sentences[s].id,
        sentence: chapter.sentences[s].sentence,
        time: chapter.sentences[s].time,
        duration: chapter.sentences[s].duration,
      });
    }
  }
}

function generateTimeStamps(transcript, totalDuration) {
  // 計算所有句子的總數
  const totalSentences = transcript.reduce(
    (acc, chapter) => acc + chapter.sentences.length,
    0
  );

  // 計算每個句子的平均持續時間（預留一些間隔）
  const averageDuration = (totalDuration * 0.8) / totalSentences; // 使用80%的總時長來分配時間
  const gapDuration = (totalDuration * 0.2) / (totalSentences - 1); // 剩餘20%用於間隔

  let currentTime = 0;
  const result = transcript.map((chapter) => ({
    ...chapter,
    sentences: chapter.sentences.map((sentence) => {
      const duration = averageDuration;
      const startTime = currentTime;
      currentTime += duration + gapDuration; // 添加間隔時間
      return {
        ...sentence,
        start_time: startTime,
        duration: duration,
      };
    }),
  }));

  return result;
}

function generateHighlight(transcript) {
  const highlight = [];
  for (let i = 0; i < transcript.length; i++) {
    const chapter = transcript[i];
    for (let s = 0; s < chapter.sentences.length; s++) {
      chapter.sentences[s].highlight = Boolean(Math.random() < 0.5);
    }
    highlight.push(chapter);
  }
  return highlight;
}

export {
  generateTranscripts,
  generateTimeInVideo,
  generateTimeStamps,
  generateHighlight,
};
