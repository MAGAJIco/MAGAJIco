import { createSportsAPIService, SportsAPIService } from './sports';

async function main() {
  console.log('=== Sports API Service Demo ===\n');
  
  const service = createSportsAPIService();
  
  console.log('Checking API health status...\n');
  const healthChecks = await service.checkAPIHealth();
  
  console.log('API Health Status:');
  console.log('─'.repeat(80));
  healthChecks.forEach(check => {
    const statusIcon = check.status === 'healthy' ? '✓' : '✗';
    const statusColor = check.status === 'healthy' ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';
    console.log(`${statusColor}${statusIcon}${resetColor} ${check.service.padEnd(25)} - ${check.status}`);
    if (check.error) {
      console.log(`  Error: ${check.error}`);
    }
  });
  console.log('─'.repeat(80));
  
  const healthyServices = healthChecks.filter(c => c.status === 'healthy');
  console.log(`\n${healthyServices.length}/${healthChecks.length} services are healthy`);
  
  console.log('\n=== Fetching Live Matches (using free ESPN APIs) ===\n');
  
  try {
    console.log('Fetching ESPN NFL scores...');
    const nflMatches = await service.fetchESPNNFL();
    console.log(`Found ${nflMatches.length} NFL matches`);
    if (nflMatches.length > 0) {
      console.log('\nSample NFL Match:');
      const sample = nflMatches[0];
      console.log(`  ${sample.awayTeam} @ ${sample.homeTeam}`);
      console.log(`  Score: ${sample.awayScore} - ${sample.homeScore}`);
      console.log(`  Status: ${sample.status}`);
    }
  } catch (error: any) {
    console.log(`  Error: ${error.message}`);
  }
  
  console.log('\nFetching ESPN NBA scores...');
  try {
    const nbaMatches = await service.fetchESPNNBA();
    console.log(`Found ${nbaMatches.length} NBA matches`);
    if (nbaMatches.length > 0) {
      console.log('\nSample NBA Match:');
      const sample = nbaMatches[0];
      console.log(`  ${sample.awayTeam} @ ${sample.homeTeam}`);
      console.log(`  Score: ${sample.awayScore} - ${sample.homeScore}`);
      console.log(`  Status: ${sample.status}`);
    }
  } catch (error: any) {
    console.log(`  Error: ${error.message}`);
  }
  
  console.log('\nFetching ESPN MLB scores...');
  try {
    const mlbMatches = await service.fetchESPNMLB();
    console.log(`Found ${mlbMatches.length} MLB matches`);
    if (mlbMatches.length > 0) {
      console.log('\nSample MLB Match:');
      const sample = mlbMatches[0];
      console.log(`  ${sample.awayTeam} @ ${sample.homeTeam}`);
      console.log(`  Score: ${sample.awayScore} - ${sample.homeScore}`);
      console.log(`  Status: ${sample.status}`);
    }
  } catch (error: any) {
    console.log(`  Error: ${error.message}`);
  }
  
  console.log('\n=== Demo Complete ===');
  console.log('\nNote: To use premium APIs (RapidAPI, Odds API, Football-Data), set these environment variables:');
  console.log('  - RAPIDAPI_KEY');
  console.log('  - ODDS_API_KEY');
  console.log('  - FOOTBALL_DATA_API_KEY');
}

main().catch(console.error);
