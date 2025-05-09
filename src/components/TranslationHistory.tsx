
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLanguageByCode } from "@/utils/languages";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

interface TranslationHistoryProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

const TranslationHistory = ({
  history,
  onClear,
  onSelect,
}: TranslationHistoryProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Recent Translations</CardTitle>
          <Button variant="ghost" onClick={onClear} size="sm">
            Clear All
          </Button>
        </div>
        <CardDescription>
          Your translation history is stored locally
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {history.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator />}
              <div
                className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-muted-foreground">
                    {getLanguageByCode(item.sourceLanguage).name} →{" "}
                    {getLanguageByCode(item.targetLanguage).name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`text-left ${
                    expanded[item.id]
                      ? ""
                      : "line-clamp-2 text-ellipsis overflow-hidden"
                  }`}
                >
                  {item.sourceText}
                </div>
                {item.sourceText.length > 120 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.id);
                    }}
                  >
                    {expanded[item.id] ? "Show less" : "Show more"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranslationHistory;
