import { DataGoalProgress } from "./data";

export class GoalProgress
{
    label:      string;
    width:      number;

    static fromDataProgress(dataProgress: DataGoalProgress): GoalProgress
    {
        if (!dataProgress) return null;

        let start = dataProgress.start || 0;
        let label = dataProgress.label || `${dataProgress.current} / ${dataProgress.target}`;

        let progress = new GoalProgress;
            progress.label = label;
            progress.width = Math.abs((start - dataProgress.current) / (start - dataProgress.target)) * 100;
        
        return progress;
    }
}