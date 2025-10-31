import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';



export const DifficultySelector=({ value, onChange }) =>{
    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold">Select Difficulty</Label>
            <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-3">
                <div>
                    <RadioGroupItem value="easy" id="easy" className="peer sr-only" />
                    <Label
                        htmlFor="easy"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                        <span className="text-2xl mb-1">😊</span>
                        <span className="font-semibold">Easy</span>
                        <span className="text-xs text-muted-foreground mt-1">30 clues</span>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                    <Label
                        htmlFor="medium"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                        <span className="text-2xl mb-1">🤔</span>
                        <span className="font-semibold">Medium</span>
                        <span className="text-xs text-muted-foreground mt-1">40 clues</span>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="hard" id="hard" className="peer sr-only" />
                    <Label
                        htmlFor="hard"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                        <span className="text-2xl mb-1">🔥</span>
                        <span className="font-semibold">Hard</span>
                        <span className="text-xs text-muted-foreground mt-1">50 clues</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}
