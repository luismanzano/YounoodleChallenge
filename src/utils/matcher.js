/**
 * Function to match investors and startups, each startup up to 10 startups per investor
 * {investors} - Array of investors
 * {startups} - Array of startups
 */

function investorsStartups(investors, startups, deletedStartups) {
    const matches = investors.map((investor, index) => {
        console.log('startups', startups);
        console.log('deletedStartups', deletedStartups);
        // Filter startups by investor's interests
        let matchedStartups = [];
        if (deletedStartups && deletedStartups[index]) {
            matchedStartups = startups.filter(startup =>
                ((investor.industry === 'any' || startup.industry === investor.industry)
                && !deletedStartups[index].includes(startup.name)
                )).slice(0, 10 - deletedStartups[index].length);
        } else {
            matchedStartups = startups.filter(startup =>
                ((investor.industry === 'any' || startup.industry === investor.industry)
                )).slice(0, 10);
        }
        // const matchedStartups = startups.filter(startup =>
        //     ((investor.industry === 'any' || startup.industry === investor.industry)
        //     && !deletedStartups[index]?.includes(startup.name) 
        //     )).slice(0, 10 - (deletedStartups[index]?.length || 0));
        //     console.log('investorDeleted', deletedStartups[index])
        return {
            investorName: investor.name,
            investorId: index,
            investorIndustry: investor.industry,
            startups: matchedStartups.map(startup => startup.name)
        };
    });

    return matches;
   
}

export default investorsStartups;