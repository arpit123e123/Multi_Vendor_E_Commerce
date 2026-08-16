import api from "./axios";

const aiService = {
  chat: async (message) => {
    const { data } = await api.post("/ai/chat", {
      message,
    });

    return data;
  },
};

export default aiService;