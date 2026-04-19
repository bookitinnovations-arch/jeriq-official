async function callAIGenerate(action: string, payload: any) {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `AI request failed with status ${response.status}`);
  }
  return response.json();
}

export async function generateRapName(realName: string, city: string) {
  return callAIGenerate('rap-name', { realName, city });
}

export async function generateNewsReport(fanName: string, achievement: string) {
  return callAIGenerate('news-report', { fanName, achievement });
}

export async function generateRapBattle(topic: string) {
  return callAIGenerate('rap-battle', { topic });
}

export async function analyzeFlow(lyrics: string) {
  return callAIGenerate('flow-analyzer', { lyrics });
}

export async function generateProphecy(name: string) {
  return callAIGenerate('prophecy', { name });
}

export async function readBeatMood(mood: string) {
  return callAIGenerate('mood-reader', { mood });
}

export const iyooAI = {
  async chat(userMessage: string, history: any[]) {
    // Simplified chat for now (non-streaming in the initial fix to ensure stability)
    const sanitizedHistory = history.filter((msg, index) => {
      if (index === 0 && msg.role === 'model') return false;
      return true;
    });

    return callAIGenerate('chat', { 
      messages: [
        ...sanitizedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });
  }
};
