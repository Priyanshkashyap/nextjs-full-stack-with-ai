import http from "k6/http";

export const options = {
  vus: 20,          // 20 concurrent users
  duration: "30s",  // Test for 30 seconds
};

export default function () {
  http.post(
    "http://localhost:3000/api/send-message",
    JSON.stringify({
      username: "priyansh",
      content: "Load testing message from k6"
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}