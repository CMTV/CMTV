import { Status } from "../status/Status";
import { GoalProgress } from "./global";

export class DataGoals
{
    [goalName: string]: DataGoal
}

export class DataGoal
{
    title:      string;
    status:     Status;
    counted:    boolean;

    start?:     string;
    end?:       string;
    date?:      string;
    plan?:      string[];

    progress?:  DataGoalProgress;
    tags?:      string[];
}

export class DataGoalProgress
{
    label?:     string;
    start?:     number;
    current:    number;
    target:     number;
}