const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Reply only with OK"
        }
      ]
    })
  }
);

console.log("Status:", response.status);
console.log("Headers:");

for (const [k, v] of response.headers)
    console.log(k + ":", v);

console.log();
console.log(await response.text());
