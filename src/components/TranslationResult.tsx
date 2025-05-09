
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface TranslationResultProps {
  translatedText: string;
  isLoading: boolean;
}

const TranslationResult = ({
  translatedText,
  isLoading,
}: TranslationResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    toast("Translation copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Translation</h3>
          {translatedText && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <div className="h-2 w-2 bg-accent rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="min-h-24 text-left whitespace-pre-wrap">
            {translatedText || (
              <span className="text-muted-foreground italic">
                Translation will appear here
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
