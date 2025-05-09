
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Language, languages } from "@/utils/languages";
import { ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const LanguageSelector = ({ value, onChange, label }: LanguageSelectorProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage = languages.find((lang) => lang.code === value) || {
    code: value,
    name: value,
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    (lang.nativeName && lang.nativeName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectLanguage = (lang: Language) => {
    onChange(lang.code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-left">{label}</label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="justify-between w-full font-normal"
          >
            <span>
              {selectedLanguage.name}
              {selectedLanguage.nativeName && selectedLanguage.name !== selectedLanguage.nativeName
                ? ` (${selectedLanguage.nativeName})`
                : ""}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px] p-0" align="start">
          <div className="p-2">
            <Input
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <ScrollArea className="h-[300px]">
            {filteredLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onSelect={() => handleSelectLanguage(lang)}
                className="cursor-pointer"
              >
                <div>
                  <div>{lang.name}</div>
                  {lang.nativeName && lang.name !== lang.nativeName && (
                    <div className="text-xs text-muted-foreground">
                      {lang.nativeName}
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
