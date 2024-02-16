/**
 * Function to match investors and startups, each startup up to 10 startups per investor
 * {investors} - Array of investors
 * {startups} - Array of startups
 */

function investorsStartups(investors, startups) {
    console.log("MATCHING")
    const matches = investors.map(investor => {
        console.log("Investor", investor.name, investor.industry)
        // Filter startups by investor's interests
        const matchedStartups = startups.filter(startup =>
            investor.industry === 'any' || startup.industry === investor.industry).slice(0, 10);
        
        console.log("Matched", matchedStartups);

        return {
            investorName: investor.name,
            investorIndustry: investor.industry,
            startups: matchedStartups.map(startup => startup.name)
        };
    });

    console.log("MATCHES", matches);

    return matches;
   
}

export default investorsStartups;