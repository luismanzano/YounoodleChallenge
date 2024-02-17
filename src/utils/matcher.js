/**
 * Function to match investors and startups, each startup up to 10 startups per investor
 * {investors} - Array of investors
 * {startups} - Array of startups
 */

function investorsStartups(investors, startups) {
    const matches = investors.map(investor => {
        // Filter startups by investor's interests
        const matchedStartups = startups.filter(startup =>
            investor.industry === 'any' || startup.industry === investor.industry).slice(0, 10);

        return {
            investorName: investor.name,
            investorIndustry: investor.industry,
            startups: matchedStartups.map(startup => startup.name)
        };
    });

    return matches;
   
}

export default investorsStartups;