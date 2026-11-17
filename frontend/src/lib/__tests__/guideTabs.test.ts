import { tabFromHash, hashForTab } from '../guideTabs';

let failed = 0;

function check(name: string, actual: string, expected: string) {
  if (actual === expected) {
    console.log(`  ✓ ${name}`);
    return;
  }
  console.error(`  ✗ ${name}: got "${actual}", expected "${expected}"`);
  failed++;
}

console.log('Guide tab tests');
check('empty hash opens Overview', tabFromHash(''), 'overview');
check('bare # opens Overview', tabFromHash('#'), 'overview');
check('#help opens Help', tabFromHash('#help'), 'help');
check('#overview opens Overview', tabFromHash('#overview'), 'overview');
check('case does not matter', tabFromHash('#HeLp'), 'help');
check('spaces are trimmed', tabFromHash('#help '), 'help');
check('unknown tab opens Overview', tabFromHash('#install'), 'overview');
check('odd characters open Overview', tabFromHash('#<script>'), 'overview');
check('a very long hash opens Overview', tabFromHash(`#${'h'.repeat(5000)}`), 'overview');
check('Overview links with no hash', hashForTab('overview'), '');
check('Help links with #help', hashForTab('help'), '#help');
check('round trip for Help', tabFromHash(hashForTab('help')), 'help');
check('round trip for Overview', tabFromHash(hashForTab('overview')), 'overview');

if (failed > 0) {
  console.error(`${failed} guide tab test(s) failed`);
  process.exit(1);
}
