/**
 * Function to match investors and startups, each startup up to 10 startups per investor
 * {investors} - Array of investors
 * {startups} - Array of startups
 * {deletedStartups} - Object containing deleted startups for each investor
 */

function investorsStartups(investors, startups, deletedStartups = {}) {
    return investors.map((investor, index) => {
        // Combine checks for investor interest and non-deletion into one filter step.
        const filteredStartups = startups.filter(startup => 
            (investor.industry === 'any' || startup.industry === investor.industry) &&
            !(deletedStartups[index]?.includes(startup.name))
        );
        
        // Determine the maximum number of startups to include, adjusting for deletions.
        const maxStartups = 10 - (deletedStartups[index]?.length || 0);
        const matchedStartups = filteredStartups.slice(0, Math.max(maxStartups, 0));

        return {
            investorName: investor.name,
            investorId: index,
            investorIndustry: investor.industry,
            startups: matchedStartups.map(({ name }) => name)
        };
    });
}



export default investorsStartups;