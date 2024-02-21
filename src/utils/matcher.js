/**
 * Function to match investors and startups, each startup up to 10 startups per investor
 * {investors} - Array of investors
 * {startups} - Array of startups
 * {deletedStartups} - Object containing deleted startups for each investor
 */

function investorsStartups(investors, startups, deletedStartups = {}) {
    let startupIndex = 0;
    return investors.map((investor, index) => {
        const investorStartups = [];
        let assignedStartupsCount = 0; // Track the number of successfully assigned startups.
        let attempts = 0; // Keep track of attempts to prevent infinite loops.

        // Calculate the adjusted maximum number of startups for this investor.
        const maxStartups = 10 - (deletedStartups[index]?.length || 0);

        while (assignedStartupsCount < maxStartups && attempts < startups.length * 10) {
            const startup = startups[startupIndex % startups.length];
            // Check if the startup fits the investor's criteria and hasn't been added yet.
            if ((investor.industry === 'any' || startup.industry === investor.industry) &&
                !(deletedStartups[index]?.includes(startup.name)) &&
                !investorStartups.find(({name}) => name === startup.name)) {
                investorStartups.push(startup);
                assignedStartupsCount++;
            }

            startupIndex++;
            if (startupIndex >= startups.length) {
                startupIndex = 0; // Reset to start if we reach the end of the list.
            }

            attempts++;
        }

        return {
            investorName: investor.name,
            investorId: index,
            investorIndustry: investor.industry,
            startups: investorStartups.map(({ name }) => name)
        };
    });
}



export default investorsStartups;