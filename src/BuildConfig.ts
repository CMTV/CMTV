export class BuildConfig
{
    projects:   string[];

    buildDb:    boolean;
    buildSite:  boolean;

    devMode:    boolean;
    whole:      boolean;

    watch:      boolean;

    //

    makeWholeSite(): boolean
    {
        return this.whole || !this.projects;
    }

    projectAllowed(projectId: string): boolean
    {
        if (!this.projects)
            return true;

        return this.projects.includes(projectId);
    }
}

export let BUILD_CONFIG = new BuildConfig;
export function SET_BUILD_CONFIG(buildConfig: BuildConfig) { BUILD_CONFIG = buildConfig; }