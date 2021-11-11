export abstract class Global
{
    abstract reset(): void;
    constructor() { this.reset(); }
}