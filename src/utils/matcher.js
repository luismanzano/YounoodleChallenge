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
        let attempts = 0; // Keep track of attempts to prevent infinite loops.

        while (investorStartups.length < 10) {
            // If we've gone through the startups more times than there are startups, break to avoid infinite loop.
            if (attempts > startups.length * investors.length) {
                break;
            }

            const startup = startups[startupIndex % startups.length]; // Use modulo to cycle through startups.
            if ((investor.industry === 'any' || startup.industry === investor.industry) &&
                !(deletedStartups[index]?.includes(startup.name)) &&
                !investorStartups.find(({name}) => name === startup.name)) { // Ensure the startup isn't already added.
                investorStartups.push(startup);
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