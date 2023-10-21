async function getData() {
  try {
    const response = await fetch(
      "https://one00x-data-analysis.onrender.com/assignment?email=mdanassabah@gmail.com",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const assignmentId = response.headers.get("x-assignment-id");
      const data = await response.json();
      const wordCount = findWordCount(data);
      const maxFrequencyWord = findMostUsedWord(wordCount);
      await sendData(maxFrequencyWord, assignmentId);
    } else if (response.status === 500) {
      console.warn("Status: HTTP 500. Retrying...");
    } else {
      throw new Error("Error fetching data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function findWordCount(jargons) {
  const wordCount = jargons.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  console.log(wordCount);
  return wordCount;
}

function findMostUsedWord(wordCount) {
  const wordFrequencyArray = Object.entries(wordCount);
  const maxFrequencyWord = wordFrequencyArray.reduce((max, current) => {
    return current[1] > max[1] ? current : max;
  }, wordFrequencyArray[0]);

  return maxFrequencyWord[0];
}

async function sendData(maxFrequencyWord, assignmentId) {
  const result = {
    assignment_id: assignmentId,
    answer: maxFrequencyWord,
  };

  try {
    const response = await fetch(
      "https://one00x-data-analysis.onrender.com/assignment?url=mdanassabah@gmail.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error("Posting result failed");
    }
  } catch (error) {
    console.error(error);
  }
}

getData();
