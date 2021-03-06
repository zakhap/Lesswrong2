import { SyncedCron } from 'meteor/littledata:synced-cron';
import { isAnyTest, onStartup, runAfterDelay } from '../lib/executionEnvironment';

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

export function addCronJob(options: any)
{
  onStartup(function() {
    if (!isAnyTest) {
      // Defer starting of cronjobs until 20s after server startup
      runAfterDelay(() => {
        SyncedCron.add(options);
      }, 20000);
    }
  });
}

export function startSyncedCron() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
}
