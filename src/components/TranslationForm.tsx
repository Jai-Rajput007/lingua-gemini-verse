
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import LanguageSelector from "./LanguageSelector";
import { ArrowRight, RotateCcw, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslationFormProps {
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  onSourceLanguageChange: (value: string) => void;
  onTargetLanguageChange: (value: string) => void;
  onSourceTextChange: (value: string) => void;
  onSwapLanguages: () => void;
  onTranslate: () => void;
  isLoading: boolean;
  characterLimit?: number;
}

const TranslationForm = ({
  sourceLanguage,
  targetLanguage,
  sourceText,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSourceTextChange,
  onSwapLanguages,
  onTranslate,
  isLoading,
  characterLimit = 5000,
}: TranslationFormProps) => {
  const { toast } = useToast();
  const [isFocused, setIsFocused] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > characterLimit) {
      toast({
        title: "Character limit exceeded",
        description: `Please keep your text under ${characterLimit} characters.`,
        variant: "destructive",
      });
      return;
    }
    onSourceTextChange(text);
  };

  const characterCount = sourceText.length;
  const isLimitClose = characterCount > characterLimit * 0.9;

  return (
    <Card className="glass-card animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <LanguageSelector
                value={sourceLanguage}
                onChange={onSourceLanguageChange}
                label="Translate from"
              />
            </div>
            <div className="flex items-end justify-center mb-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={onSwapLanguages}
                className="rounded-full"
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Swap languages</span>
              </Button>
            </div>
            <div className="flex-1">
              <LanguageSelector
                value={targetLanguage}
                onChange={onTargetLanguageChange}
                label="Translate to"
              />
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={handleTextareaChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`min-h-24 resize-none transition-all duration-200 ${
                isFocused ? "ring-2 ring-accent" : ""
              }`}
              disabled={isLoading}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                isLimitClose ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {characterCount}/{characterLimit}
            </div>
          </div>

          <Button
            onClick={onTranslate}
            disabled={isLoading || !sourceText.trim()}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Translating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <span>Translate</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationForm;
