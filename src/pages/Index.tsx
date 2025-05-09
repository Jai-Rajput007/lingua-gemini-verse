
import { useState, useEffect } from "react";
import TranslationForm from "@/components/TranslationForm";
import TranslationResult from "@/components/TranslationResult";
import TranslationHistory, { HistoryItem } from "@/components/TranslationHistory";
import { translateText } from "@/utils/translateApi";
import { toast } from "sonner";
import { Language } from "lucide-react";
import { getLanguageByCode } from "@/utils/languages";

const Index = () => {
  // State for translation
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("translationHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse history:", error);
      }
    }
  }, []);

  // Save history to local storage when it changes
  useEffect(() => {
    localStorage.setItem("translationHistory", JSON.stringify(history));
  }, [history]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    try {
      const { translatedText: result } = await translateText({
        sourceText: sourceText.trim(),
        sourceLanguage: getLanguageByCode(sourceLanguage).name,
        targetLanguage: getLanguageByCode(targetLanguage).name,
      });
      
      setTranslatedText(result);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        sourceText: sourceText.trim(),
        translatedText: result,
        sourceLanguage,
        targetLanguage,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (isLoading) return;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast("Translation history cleared");
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSourceLanguage(item.sourceLanguage);
    setTargetLanguage(item.targetLanguage);
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
  };

  return (
    <div className="min-h-screen translation-container">
      <header className="p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="bg-accent rounded-full p-2 text-white">
            <Language className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            LinguaGemini
          </h1>
        </div>
      </header>
      
      <main className="container max-w-4xl px-4 pb-16">
        <div className="space-y-6">
          <div className="animate-slide-up">
            <TranslationForm
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              sourceText={sourceText}
              onSourceLanguageChange={setSourceLanguage}
              onTargetLanguageChange={setTargetLanguage}
              onSourceTextChange={setSourceText}
              onSwapLanguages={handleSwapLanguages}
              onTranslate={handleTranslate}
              isLoading={isLoading}
            />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <TranslationResult
              translatedText={translatedText}
              isLoading={isLoading}
            />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <TranslationHistory
              history={history}
              onClear={handleClearHistory}
              onSelect={handleSelectHistoryItem}
            />
          </div>
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>Powered by Google Gemini 2.5 Pro</p>
      </footer>
    </div>
  );
};

export default Index;
